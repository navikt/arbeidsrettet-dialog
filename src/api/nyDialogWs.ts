import { v4 as uuidv4 } from 'uuid';

const PLEASE_URL = (import.meta.env.VITE_PLEASE_API_URL || '').replace('https://', '');
const ticketUrl = `/please/ws-auth-ticket`;
const socketUrl = `ws://${PLEASE_URL}/ws`;

enum EventTypes {
    NY_MELDING = 'NY_DIALOGMELDING_FRA_BRUKER_TIL_NAV',
}

enum ReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

export enum EventType {
    NY_DIALOGMELDING_FRA_BRUKER_TIL_NAV = 'NY_DIALOGMELDING_FRA_BRUKER_TIL_NAV',
    NY_DIALOGMELDING_FRA_NAV_TIL_BRUKER = 'NY_DIALOGMELDING_FRA_NAV_TIL_BRUKER',
}

interface SubscriptionPayload {
    subscriptionKey: string;
    events: EventType[];
}

let socketSingleton: WebSocket | undefined = undefined;
let ticketSingleton: { ticket: string; fnr: string } | undefined;

const handleMessage = (callback: () => void, body: SubscriptionPayload) => (event: MessageEvent) => {
    if (event.data === 'AUTHENTICATED') return;
    if (event.data === 'INVALID_TOKEN' && socketSingleton) {
        ticketSingleton = undefined;
        getTicketAndAuthenticate(body);
        return;
    }
    const message = JSON.parse(event.data);
    if (message !== EventTypes.NY_MELDING) return;
    console.log('Received event', message);
    callback();
};

const maxRetries = 10;
let retries = 0;
const handleClose = (callback: () => void, body: SubscriptionPayload) => (event: CloseEvent) => {
    if (retries >= maxRetries) return;
    retries++;
    setTimeout(() => {
        socketSingleton?.close();
        reconnectWebsocket(callback, body);
        getTicketAndAuthenticate(body);
    }, 1000);
};

const sendTicketWhenOpen = (socket: WebSocket, ticket: string) => {
    const sendTicket = () => socket.send(ticket);
    if (socket?.readyState === ReadyState.OPEN) {
        console.log('Websocket already open - sending auth');
        sendTicket();
    } else {
        console.log('Websocket was opened - sending auth');
        socket.onopen = sendTicket;
    }
};

const getTicket = (body: SubscriptionPayload): Promise<string> => {
    if (ticketSingleton && ticketSingleton.fnr === body.subscriptionKey) return Promise.resolve(ticketSingleton.ticket);
    return fetch(ticketUrl, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Nav-Consumer-Id': 'arbeidsrettet-dialog',
            'Nav-Call-Id': uuidv4(),
        },
    })
        .then((response) => {
            if (!response.ok) throw Error('Failed to fetch ticket for websocket');
            return response.text();
        })
        .then((ticket) => {
            ticketSingleton = { ticket, fnr: body.subscriptionKey };
            return ticket;
        });
};

const authenticate = (socket: WebSocket, ticket: string) => {
    sendTicketWhenOpen(socket, ticket);
};

const getTicketAndAuthenticate = async (body: SubscriptionPayload) => {
    let ticket = await getTicket(body);
    if (!socketSingleton) return;
    authenticate(socketSingleton, ticket);
};

const reconnectWebsocket = (callback: () => void, body: SubscriptionPayload) => {
    const socket = new WebSocket(socketUrl);
    socketSingleton = socket;
    socketSingleton.onmessage = handleMessage(callback, body);
    socketSingleton.onclose = handleClose(callback, body);
    return socket;
};

export const listenForNyDialogEvents = (callback: () => void, fnr: string | undefined, events: EventType[]) => {
    // Start with only internal
    if (!fnr) return () => {};
    const body = { subscriptionKey: fnr, events };
    const currentReadyState = socketSingleton?.readyState;
    if (
        socketSingleton === undefined ||
        ![ReadyState.OPEN, ReadyState.CONNECTING].includes(socketSingleton.readyState)
    ) {
        reconnectWebsocket(callback, body);
        getTicketAndAuthenticate(body);
    } else {
        console.log('Socket looks good, keep going');
    }
    return () => {
        if (currentReadyState === ReadyState.CLOSING) return;
        if (socketSingleton) {
            // Clear reconnect try on intentional close
            socketSingleton.onclose = () => {};
            socketSingleton.close();
        }
    };
};

export const closeWebsocket = () => {
    if (socketSingleton?.readyState === ReadyState.CLOSING) return;
    if (socketSingleton) {
        // Clear reconnect try on intentional close
        socketSingleton.onclose = () => {};
        socketSingleton.close();
    }
};

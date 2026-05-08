import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom installerer sin egen AbortController/AbortSignal/Request som er andre klasser
// enn Nodes native (som undici sin fetch krever). Vi henter Nodes native klasser
// fra `process` (lastet inn av preload-natives.cjs via --require før jsdom-env settes opp).
const NativeAbortController = (process as any).__nativeAbortController__ ?? globalThis.AbortController;
const NativeAbortSignal = (process as any).__nativeAbortSignal__ ?? globalThis.AbortSignal;
const NativeRequest = (process as any).__nativeRequest__ ?? globalThis.Request;
const NativeFetch = (process as any).__nativeFetch__ ?? globalThis.fetch;

// @ts-ignore
globalThis.AbortController = NativeAbortController;
// @ts-ignore
globalThis.AbortSignal = NativeAbortSignal;
// @ts-ignore
globalThis.Request = NativeRequest;
// @ts-ignore
globalThis.fetch = NativeFetch;
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.AbortController = NativeAbortController;
    // @ts-ignore
    window.AbortSignal = NativeAbortSignal;
    // @ts-ignore
    window.Request = NativeRequest;
    // @ts-ignore
    window.fetch = NativeFetch;
}

// React 19: act() venter på alle pending async operasjoner. Polling via setInterval
// skaper en uendelig kjede av fetch-promises som act() aldri kan settle.
// Stub setInterval som no-op – data lastes via react-router loadere i stedet.
let _intervalId = 1;
// @ts-ignore
globalThis.setInterval = ((..._args: any[]) => {
    return _intervalId++ as any;
}) as typeof setInterval;

// Stub WebSocket slik at ingen reelle koblinger åpnes i testmiljø.
class NoopWebSocket {
    static CONNECTING = 0 as const;
    static OPEN = 1 as const;
    static CLOSING = 2 as const;
    static CLOSED = 3 as const;
    readyState = NoopWebSocket.CLOSED;
    url: string;
    onopen: ((ev: any) => void) | null = null;
    onmessage: ((ev: any) => void) | null = null;
    onclose: ((ev: any) => void) | null = null;
    onerror: ((ev: any) => void) | null = null;
    constructor(url: string) {
        this.url = url;
    }
    send() {}
    close() {
        this.readyState = NoopWebSocket.CLOSED;
    }
    addEventListener() {}
    removeEventListener() {}
}
// @ts-ignore
globalThis.WebSocket = NoopWebSocket;
// @ts-ignore
if (typeof window !== 'undefined') window.WebSocket = NoopWebSocket;

vi.mock('../felleskomponenter/logging', () => ({
    default: vi.fn(),
    loggChangeInDialog: vi.fn(),
}));

afterAll(async () => {
    try {
        const mod = await import('../view/dialogProvider/dialogStore');
        mod.useDialogStore.getState().stopPolling();
    } catch {}
});

// React 19: cleanup() mellom tester unmounter React-trær og kjører useEffect-
// cleanups (bl.a. stopPolling), slik at async arbeid fra én test ikke lekker
// inn i neste og får testkjøreren til å henge.
afterEach(() => {
    cleanup();
});

Element.prototype.scrollTo = () => {};
// @ts-ignore
window.matchMedia = (): boolean => true;

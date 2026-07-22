import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const process = (globalThis as any).process ?? {};

const NativeAbortController = process.__nativeAbortController__ ?? globalThis.AbortController;
const NativeAbortSignal = process.__nativeAbortSignal__ ?? globalThis.AbortSignal;
const NativeRequest = process.__nativeRequest__ ?? globalThis.Request;
const NativeFetch = process.__nativeFetch__ ?? globalThis.fetch;

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

interface Storage {
    length: number;
    getItem: (key: string) => string | null;
    clear: () => void;
    key: (index: number) => string | null;
    removeItem: (key: string) => void;
    setItem: (key: string, value: string) => void;
}
declare const window: {
    sessionStorage: Storage;
    localStorage: Storage;
};

const ensureMemoryStorage = (storageName: 'sessionStorage' | 'localStorage') => {
    const current = window[storageName] as any;
    if (current && typeof current.getItem === 'function') {
        return;
    }
    let store = {} as any;
    window[storageName] = {
        get length() {
            return Object.keys(store).length;
        },
        clear() {
            store = {};
        },
        getItem(key: any) {
            return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
        },
        key(index: any) {
            const keys = Object.keys(store);
            return keys[index] ?? null;
        },
        removeItem(key: any) {
            delete store[key];
        },
        setItem(key: any, value: any) {
            store[key] = String(value);
        },
    };
};

ensureMemoryStorage('localStorage');
ensureMemoryStorage('sessionStorage');

import '@testing-library/jest-dom/vitest';
// import '../polyfill';
// import.meta.env.VITE_DIALOG_API_URL = 'http://localhost:3000'; // Dette er det som ligger på window.location i jsdom

// jsdom installerer sin egen AbortController/AbortSignal/Request som er andre klasser
// enn Nodes native (som undici sin fetch krever). Når react-router lager en
// AbortController i jsdom-konteksten og sender signal til fetch/Request, kaster
// undici TypeError. Vi henter Nodes native klasser fra `process` (lastet inn av
// preload-natives.cjs via --require før jsdom-env settes opp).
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

vi.mock('../felleskomponenter/logging', () => ({
    default: vi.fn(),
    loggChangeInDialog: vi.fn(),
}));
Element.prototype.scrollTo = () => {};
// @ts-ignore
window.matchMedia = (): boolean => true;

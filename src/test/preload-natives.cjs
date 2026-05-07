// Lastet via Node sin --require før vitest worker setter opp jsdom env.
// Vi stasher Nodes native AbortController/AbortSignal på `process` (som ikke
// blir overskrevet av jsdom) slik at setup-filen kan installere dem på window.
process.__nativeAbortController__ = globalThis.AbortController;
process.__nativeAbortSignal__ = globalThis.AbortSignal;
process.__nativeRequest__ = globalThis.Request;
process.__nativeFetch__ = globalThis.fetch;


import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
// import '../polyfill';
// import.meta.env.VITE_DIALOG_API_URL = 'http://localhost:3000'; // Dette er det som ligger på window.location i jsdom
vi.mock('../felleskomponenter/logging', () => ({
    default: vi.fn(),
    loggChangeInDialog: vi.fn(),
}));
Element.prototype.scrollTo = () => {};
// @ts-ignore
window.matchMedia = (): boolean => true;

// Global opprydding mellom tester for å unngå minnelekkasjer i CI
afterEach(() => {
    cleanup(); // unmount React-trær fra testing-library
    vi.restoreAllMocks(); // restore vi.spyOn (clearAllMocks alene gjør ikke dette)
    vi.clearAllTimers();
});

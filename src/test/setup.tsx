// import '../polyfill';
// import.meta.env.VITE_DIALOG_API_URL = 'http://localhost:3000'; // Dette er det som ligger på window.location i jsdom
vi.mock('../felleskomponenter/logging', () => ({
    default: vi.fn(),
    loggChangeInDialog: vi.fn()
}));
Element.prototype.scrollTo = () => {};
// @ts-ignore
window.matchMedia = (): boolean => true;

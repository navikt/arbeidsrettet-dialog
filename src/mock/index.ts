import FetchMock, {Middleware} from "yet-another-fetch-mock";
import dialoger, {opprettDialog} from "./dialog";
import bruker from "./bruker";

const loggingMiddleware: Middleware = (request, response) => {
    console.log('response', response);
    return response;
};


const mock = FetchMock.configure({
    enableFallback: false, // default: true
    middleware: loggingMiddleware // default: (req, resp) => resp
});


mock.get("/veilarbdialog/api/dialog", dialoger);

mock.post('/veilarbdialog/api/dialog/ny', ({ body }) =>
    opprettDialog(body)
);

mock.get("/veilarboppfolging/api/oppfolging/me", bruker);


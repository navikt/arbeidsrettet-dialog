export class UnautorizedError extends Error {
    response: Response;
    constructor(response: Response) {
        super('Unauthorized request, session expired?');
        this.response = response;
    }
}

export class ForbiddenError extends Error {
    response: Response;
    constructor(response: Response) {
        super('Forbidden');
        this.response = response;
    }
}

export class ClientError extends Error {
    response: Response;
    constructor(response: Response) {
        super(`Client error: ${response.status}`);
        this.response = response;
    }
}

export class InternalServerError extends Error {
    response: Response;
    constructor(response: Response) {
        super(`InternalServerError: ${response.status}`);
        this.response = response;
    }
}

export class NetworkError extends Error {
    response: Response;
    constructor(response: Response) {
        super(`NetworkError`);
        this.response = response;
    }
}

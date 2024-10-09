import { ClientError, ForbiddenError, InternalServerError, NetworkError, UnautorizedError } from './fetchErrors';

function getCookie(name: string) {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
}

function getHeaders() {
    // Hvis du legger til flere headers husk å whitelist headeren i ./utils/UseFetch.ts
    return {
        'Content-Type': 'application/json',
        'Nav-Consumer-Id': 'arbeidsrettet-dialog',
        NAV_CSRF_PROTECTION: getCookie('NAV_CSRF_PROTECTION') // eslint-disable-line quote-props
    };
}

export const REQUEST_CONFIG: RequestInit = {
    credentials: 'same-origin',
    headers: getHeaders()
};

export function fetchData<T>(url: string, config: RequestInit = {}): Promise<T> {
    return fetch(url, { ...config, ...REQUEST_CONFIG })
        .then(sjekkStatuskode)
        .then(toJson);
}

export function sjekkStatuskode(response: Response) {
    if (response.status >= 200 && response.status < 300 && response.ok) {
        return response;
    }
    if (response.status === 401) {
        throw new UnautorizedError(response);
    }
    if (response.status === 403) {
        throw new ForbiddenError(response);
    }
    if (response.status >= 400 && response.status <= 500) {
        throw new ClientError(response);
    }
    if (response.status >= 500) {
        throw new InternalServerError(response);
    }
    throw new NetworkError(response);
}

export function toJson(response: Response) {
    if (response.status !== 204) {
        // No content
        return response.json();
    }
    return response;
}

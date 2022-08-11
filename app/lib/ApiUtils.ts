import store from '../common/redux/store';
import {authManager} from './CredsManager';
import {CredentialsState} from '../common/redux/credentialsReducer';

export class ApiUtils {
    // safe api calls - uses auth token
    static async makeGetRequest<T>(
        url: string,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return await this.makeApiCall(
            url,
            {
                method: 'GET',
                signal,
            },
            headers ? headers : {},
        );
    }
    static async makePostRequestWithJsonBody<T>(
        url: string,
        body: object,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return await this.makeApiCall(
            url,
            {
                method: 'POST',
                body: JSON.stringify(body),
                signal,
            },
            {
                ...headers,
                'Content-Type': 'application/json',
            },
        );
    }
    static async makePostRequestWithFormDataBody<T>(
        url: string,
        body: FormData,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return await this.makeApiCall(
            url,
            {
                method: 'POST',
                body: body,
                signal,
            },
            headers ? headers : {},
        );
    }

    // unsafe api calls - does not uses auth token
    static makeGetRequestUnsafe<T>(
        url: string,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return this.makeApiCallUnsafe(
            url,
            {method: 'GET', signal},
            headers ? headers : {},
        );
    }
    static makePostRequestWithJsonBodyUnsafe<T>(
        url: string,
        body: object,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return this.makeApiCallUnsafe(
            url,
            {
                method: 'POST',
                body: JSON.stringify(body),
                signal,
            },
            {
                ...headers,
                'Content-Type': 'application/json',
            },
        );
    }
    static makePostRequestWithFormDataBodyUnsafe(
        url: string,
        body: FormData,
        headers?: object,
        signal?: AbortSignal,
    ) {
        return this.makeApiCallUnsafe(
            url,
            {
                method: 'POST',
                body: body,
                signal,
            },
            {
                ...headers,
            },
        );
    }

    private static async makeApiCall<T>(
        url: string,
        options: object,
        headers: object,
    ): Promise<T> {
        const makeApiCall = () => {
            const accessToken = (
                (store.getState() as any).credentialsReducer as CredentialsState
            ).accessToken;
            return fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    Authorization: accessToken,
                },
            })
                .then(this.handleResponseParsing)
                .then((data: T) => data);
        };
        if (authManager.areCredentialsExpired()) {
            await authManager.renewAndSaveCredentials();
            return makeApiCall();
        }
        return makeApiCall();
    }

    private static async makeApiCallUnsafe<T>(
        url: string,
        options: object,
        headers: object,
    ): Promise<T> {
        const apiCall = () => {
            return fetch(url, {
                ...options,
                headers: {
                    ...headers,
                },
            })
                .then(this.handleResponseParsing)
                .then(this.handleData);
        };
        return apiCall();
    }

    private static handleResponseParsing(r: Response) {
        // specific to expressjs backend
        const ct = r.headers.get('content-type')?.replace('; charset=utf-8', '') ||  '';
        // handle response parsing here
        switch (ct) {
            case 'application/json':
                return r.json();
            case 'application/octet-stream':
                return r.blob();
            default:
                return r.text();
        }
    }

    private static handleData<T>(d: T): T {
        // Make data mutations here
        return d;
    }
}

import { HttpMethod } from './http-method'
import { HttpRequestHandler } from './http-request-handler'

export class HttpClient {
    public static get<ResponseType>(endpoint: string, silent: boolean = true) {
        return HttpRequestHandler.request<never, ResponseType>(
            {
                endpoint,
                method: HttpMethod.GET,
            },
            silent,
        )
    }

    public static post<RequestType = never, ResponseType = RequestType>(
        endpoint: string,
        body?: RequestType,
        silent: boolean = true,
    ) {
        return HttpRequestHandler.request<RequestType, ResponseType>(
            {
                endpoint,
                method: HttpMethod.POST,
                body,
            },
            silent,
        )
    }

    public static patch<RequestType = never, ResponseType = RequestType>(
        endpoint: string,
        body: RequestType,
        silent: boolean = true,
    ) {
        return HttpRequestHandler.request<RequestType, ResponseType>(
            {
                endpoint,
                method: HttpMethod.PATCH,
                body,
            },
            silent,
        )
    }

    public static put<RequestType = never, ResponseType = RequestType>(
        endpoint: string,
        body: RequestType,
        silent: boolean = true,
    ) {
        return HttpRequestHandler.request<RequestType, ResponseType>(
            {
                endpoint,
                method: HttpMethod.PUT,
                body,
            },
            silent,
        )
    }

    public static delete<ResponseType>(
        endpoint: string,
        silent: boolean = true,
    ) {
        return HttpRequestHandler.request<never, ResponseType>(
            {
                endpoint,
                method: HttpMethod.DELETE,
            },
            silent,
        )
    }
}

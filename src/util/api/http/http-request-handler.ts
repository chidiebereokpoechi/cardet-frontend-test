import { of } from 'rxjs'
import { ajax, AjaxError } from 'rxjs/ajax'
import { catchError, finalize, map } from 'rxjs/operators'
import { rootState } from '../../../modules/root'
import { HttpApiResponse } from '../api-response'
import { ApiUtil } from '../api-util'
import { HttpRequest } from './http-request'

export class HttpRequestHandler {
  public static request<RequestType = undefined, ResponseType = undefined>(
    args: HttpRequest<RequestType>,
    silent: boolean = true,
  ) {
    let queued: ReturnType<typeof rootState['queueTask']>
    if (!silent) queued = rootState.queueTask()

    return ajax(ApiUtil.getRequest(args)).pipe(
      catchError((error) => {
        if (error instanceof AjaxError && error.response) {
          console.log(error.response)
          return of({ ...error, response: error.response })
        }

        throw error
      }),
      map(
        (response): HttpApiResponse<ResponseType> => {
          return {
            ok: response.status < 400,
            data: response.response.data,
            message: response.response.message,
            status: response.status,
          }
        },
      ),
      catchError((error) => {
        throw error
      }),
      finalize(() => {
        if (!silent && queued) queued.unqueueTask()
      }),
    )
  }
}

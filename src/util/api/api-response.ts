export interface HttpApiResponse<ResponseType = never> {
  ok: boolean
  data: ResponseType
  message: string
  status: number
}

export const ping = (): Promise<number> => {
  const start = Date.now()
  const req = new XMLHttpRequest()

  return new Promise((resolve) => {
    req.addEventListener('load', () => {
      resolve(Date.now() - start)
    })

    req.addEventListener('error', () => {
      resolve(9999)
    })

    req.open('GET', `${process.env.REACT_APP_BASE_URL}/ping`)
    req.send()
  })
}

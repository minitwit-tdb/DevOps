export function urlTo (target: string, params: { [key: string]: string } = {}): string {
  const queryKeys = Object.keys(params)
  // eslint-disable-next-line security/detect-object-injection
  const queryString = queryKeys.map((key) => `${key}=${params[key]}`).join('&')

  return `/${target}${queryString ? `?${queryString}` : ''}`
}

export function assertError(err: string, errorType?: ErrorConstructor) {
  return new (errorType || Error)(err);
}

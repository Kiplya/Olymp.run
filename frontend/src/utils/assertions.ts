export function assertNotNull<T>(value: T): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error("Value mustn't be null or undefined")
  }
}

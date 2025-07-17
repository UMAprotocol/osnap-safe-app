export function isDefined<T>(arg: T): arg is NonNullable<T> {
  return arg !== undefined && arg !== null;
}

/**
 * @notice Type checks if the given input is a JavaScript object (not null) with string keys and unknown values.
 * @param {unknown} input - The input to check.
 * @returns {boolean} `true` if the input is a valid Record<string, unknown>, otherwise `false`.
 */
export function isRecordStringUnknown(
  input: unknown,
): input is Record<string, unknown> {
  return (
    typeof input === "object" &&
    input !== null &&
    !Array.isArray(input) &&
    Object.keys(input).every((key) => typeof key === "string")
  );
}

/**
 * Converts a number to BigInt safely.
 * @param num The number to convert.
 * @returns A BigInt representation of the number.
 * @throws Error if the number is not a safe integer.
 */
export function numberToBigInt(num: number): bigint {
    if (!Number.isSafeInteger(num)) {
      throw new Error("Number is not a safe integer and may lose precision.");
    }
    return BigInt(num);
}

/**
 * Converts a BigInt to number safely.
 * @param bigIntValue The BigInt to convert.
 * @returns A number representation of the BigInt.
 * @throws Error if the BigInt is outside the safe number range.
 */
export function bigIntToNumber(bigIntValue: bigint): number {
    const num = Number(bigIntValue);
    if (!Number.isSafeInteger(num)) {
        throw new Error("BigInt value is out of safe integer range.");
    }
    return num;
}

/**
 * Converts a number to a string.
 * @param num The number to convert.
 * @returns The string representation of the number.
 */
export function numberToString(num: number): string {
    return num.toString();
}

/**
 * Converts a string to a number safely.
 * @param str The string to convert.
 * @returns The number representation of the string.
 * @throws Error if the conversion fails.
 */
export function stringToNumber(str: string): number {
    const num = Number(str);
    if (isNaN(num)) {
      throw new Error(`Invalid number string: ${str}`);
    }
    return num;
}

/**
 * Converts a BigInt to a string.
 * @param bigIntValue The BigInt to convert.
 * @returns The string representation of the BigInt.
 */
export function bigIntToString(bigIntValue: bigint): string {
    return bigIntValue.toString();
}

/**
 * Converts a string to a BigInt safely.
 * @param str The string to convert.
 * @returns The BigInt representation of the string.
 * @throws Error if the conversion fails.
 */
export function stringToBigInt(str: string): bigint {
    try {
      return BigInt(str);
    } catch (error) {
      throw new Error(`Invalid BigInt string: ${str}`);
    }
}
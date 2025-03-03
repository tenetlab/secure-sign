import {
    numberToBigInt,
    bigIntToNumber,
    numberToString,
    stringToNumber,
    bigIntToString,
    stringToBigInt
} from './conversionUtils';

describe('Conversion Utilities', () => {
    test('numberToBigInt converts safe integer to BigInt', () => {
        expect(numberToBigInt(10)).toBe(BigInt(10));
    });

    test('numberToBigInt throws error for unsafe integer', () => {
        expect(() => numberToBigInt(Number.MAX_SAFE_INTEGER + 1)).toThrow("Number is not a safe integer and may lose precision.");
    });

    test('bigIntToNumber converts BigInt to number', () => {
        expect(bigIntToNumber(BigInt(10))).toBe(10);
    });

    test('bigIntToNumber throws error for out of safe range', () => {
        expect(() => bigIntToNumber(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1))).toThrow("BigInt value is out of safe integer range.");
    });

    test('numberToString converts number to string', () => {
        expect(numberToString(10)).toBe("10");
    });

    test('stringToNumber converts valid string to number', () => {
        expect(stringToNumber("10")).toBe(10);
    });

    test('stringToNumber throws error for invalid string', () => {
        expect(() => stringToNumber("invalid")).toThrow("Invalid number string: invalid");
    });

    test('bigIntToString converts BigInt to string', () => {
        expect(bigIntToString(BigInt(10))).toBe("10");
    });

    test('stringToBigInt converts valid string to BigInt', () => {
        expect(stringToBigInt("10")).toBe(BigInt(10));
    });

    test('stringToBigInt throws error for invalid string', () => {
        expect(() => stringToBigInt("invalid")).toThrow("Invalid BigInt string: invalid");
    });
});
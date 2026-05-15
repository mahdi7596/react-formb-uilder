export interface RegionalValidatorRegistration {
  key: string;
  version: string;
  fieldTypes: string[];
  validate: (value: unknown) => string | null;
}

export function normalizePersianArabicDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (char) => String(char.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (char) => String(char.charCodeAt(0) - 1632));
}

export function isIranMobile(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  const normalized = normalizePersianArabicDigits(value).replace(/[\s-]/g, "");
  return /^(?:\+98|0098|0)?9\d{9}$/.test(normalized);
}

export function isIranPostalCode(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  const normalized = normalizePersianArabicDigits(value).replace(/[\s-]/g, "");
  return /^[1-9]\d{9}$/.test(normalized);
}

export function isIranNationalId(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  const normalized = normalizePersianArabicDigits(value).replace(/\D/g, "").padStart(10, "0");
  if (!/^\d{10}$/.test(normalized) || /^(\d)\1{9}$/.test(normalized)) {
    return false;
  }
  const check = Number(normalized[9]);
  const sum = normalized
    .slice(0, 9)
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * (10 - index), 0);
  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

export const iranValidatorRegistrations = [
  {
    key: "custom:ir.mobile",
    version: "1.0.0",
    fieldTypes: ["phone", "text"],
    validate: (value: unknown) => (isIranMobile(value) ? null : "invalid_iran_mobile")
  },
  {
    key: "custom:ir.nationalId",
    version: "1.0.0",
    fieldTypes: ["text"],
    validate: (value: unknown) => (isIranNationalId(value) ? null : "invalid_iran_national_id")
  },
  {
    key: "custom:ir.postalCode",
    version: "1.0.0",
    fieldTypes: ["text"],
    validate: (value: unknown) => (isIranPostalCode(value) ? null : "invalid_iran_postal_code")
  }
] as const satisfies RegionalValidatorRegistration[];

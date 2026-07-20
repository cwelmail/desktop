export const ACCOUNT_CODE_LENGTH = 24

export const PLACEHOLDER_LOGIN_KEY = "···· ···· ···· ···· ···· ····"

export function normalizeAccountCode(value: string) {
  return value.replace(/\D/g, "").slice(0, ACCOUNT_CODE_LENGTH)
}

export function formatAccountCode(digits: string) {
  const clean = normalizeAccountCode(digits)
  return clean.replace(/(\d{4})(?=\d)/g, "$1 ")
}

export function isValidAccountCode(value: string) {
  return normalizeAccountCode(value).length === ACCOUNT_CODE_LENGTH
}

export const NISAB_AMOUNT = 230000

export type ZakatInputs = {
  cash: number
  bank: number
  gold: number
  silver: number
  business: number
  receivable: number
  debt: number
}

export type ZakatResult = {
  totalAssets: number
  zakat: number
  isEligible: boolean
}

export const emptyZakatInputs: ZakatInputs = {
  cash: 0,
  bank: 0,
  gold: 0,
  silver: 0,
  business: 0,
  receivable: 0,
  debt: 0,
}

export function calculateZakat(inputs: ZakatInputs): ZakatResult {
  const totalAssets =
    inputs.cash +
    inputs.bank +
    inputs.gold +
    inputs.silver +
    inputs.business +
    inputs.receivable -
    inputs.debt

  const isEligible = totalAssets >= NISAB_AMOUNT
  const zakat = isEligible ? totalAssets * 0.025 : 0

  return { totalAssets, zakat, isEligible }
}

export function formatBanglaNumber(value: number, maximumFractionDigits = 0): string {
  if (!Number.isFinite(value)) {
    return '০'
  }

  return new Intl.NumberFormat('bn-BD', {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatBanglaCurrency(value: number): string {
  return formatBanglaNumber(value, 2)
}

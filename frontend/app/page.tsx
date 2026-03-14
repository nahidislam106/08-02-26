'use client'

import { useMemo, useState } from 'react'
import Header from '@/components/Header'
import Notice from '@/components/Notice'
import MarketUpdates from '@/components/MarketUpdates'
import HadithSection from '@/components/HadithSection'
import ZakatForm, { ZakatFormValues } from '@/components/ZakatForm'
import ResultCard from '@/components/ResultCard'
import Footer from '@/components/Footer'
import {
  calculateZakat,
  emptyZakatInputs,
  NISAB_AMOUNT,
  ZakatInputs,
} from '@/lib/zakatCalculator'

export default function Home() {
  const emptyFormValues: ZakatFormValues = {
    cash: '',
    bank: '',
    gold: '',
    silver: '',
    business: '',
    receivable: '',
    debt: '',
  }

  const [formValues, setFormValues] = useState<ZakatFormValues>(emptyFormValues)

  const numericInputs = useMemo<ZakatInputs>(() => {
    const toNumber = (value: string) => {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : 0
    }

    return {
      cash: toNumber(formValues.cash),
      bank: toNumber(formValues.bank),
      gold: toNumber(formValues.gold),
      silver: toNumber(formValues.silver),
      business: toNumber(formValues.business),
      receivable: toNumber(formValues.receivable),
      debt: toNumber(formValues.debt),
    }
  }, [formValues])

  const result = useMemo(() => calculateZakat(numericInputs), [numericInputs])

  const handleFieldChange = (field: keyof ZakatInputs, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => setFormValues(emptyFormValues)

  return (
    <main className="min-h-screen bg-emerald-50">
      <div className="relative overflow-hidden pattern-islamic">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="relative">
          <Header />
          <Notice />
          <MarketUpdates />
          <HadithSection />
          <ZakatForm
            values={formValues}
            onFieldChange={handleFieldChange}
            onReset={handleReset}
            nisab={NISAB_AMOUNT}
          />
          <ResultCard result={result} nisab={NISAB_AMOUNT} />
          <Footer />
        </div>
      </div>
    </main>
  )
}

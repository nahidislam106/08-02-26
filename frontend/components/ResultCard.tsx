import { formatBanglaCurrency, formatBanglaNumber, ZakatResult } from '@/lib/zakatCalculator'

type ResultCardProps = {
  result: ZakatResult
  nisab: number
}

export default function ResultCard({ result, nisab }: ResultCardProps) {
  const primaryText = result.isEligible
    ? 'আপনার উপর জাকাত ফরজ।'
    : 'আপনার সম্পদ নিসাবের নিচে।'

  const secondaryText = result.isEligible
    ? `মোট জাকাত: ${formatBanglaCurrency(result.zakat)} টাকা`
    : 'আপনার উপর জাকাত ফরজ নয়।'

  return (
    <section className="section-shell py-12 sm:py-16" id="result">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700">ফলাফল</p>
          <h2 className="mt-2 font-serif text-3xl text-emerald-900">আপনার জাকাত রিপোর্ট</h2>
        </div>
      </div>
      <div
        className={`card-surface mt-8 p-6 sm:p-8 motion-safe:animate-float-in ${
          result.isEligible ? 'border-amber-200/70' : 'border-emerald-100/70'
        }`}
        aria-live="polite"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-emerald-900">{primaryText}</p>
            <p className="mt-2 text-base text-emerald-700">{secondaryText}</p>
          </div>
          <div className="rounded-2xl bg-emerald-900 px-5 py-4 text-white shadow-lg">
            <p className="text-xs uppercase tracking-widest text-emerald-200">জাকাত পরিমাণ</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatBanglaCurrency(result.zakat)} টাকা
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="rounded-xl bg-emerald-50 px-4 py-3">
            <p className="text-emerald-600">মোট সম্পদ</p>
            <p className="mt-1 text-lg font-semibold text-emerald-900">
              {formatBanglaNumber(result.totalAssets)} টাকা
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 px-4 py-3">
            <p className="text-amber-700">নিসাব সীমা</p>
            <p className="mt-1 text-lg font-semibold text-amber-900">
              {formatBanglaNumber(nisab)} টাকা
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

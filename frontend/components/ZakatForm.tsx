import { formatBanglaNumber, ZakatInputs } from '@/lib/zakatCalculator'

type ZakatField = {
  key: keyof ZakatInputs
  label: string
  tone?: 'danger'
  Icon: () => JSX.Element
}

type ZakatFormProps = {
  values: ZakatFormValues
  onFieldChange: (field: keyof ZakatInputs, value: string) => void
  onReset: () => void
  nisab: number
}

export type ZakatFormValues = Record<keyof ZakatInputs, string>

const fields: ZakatField[] = [
  { key: 'cash', label: 'নগদ টাকা', Icon: CashIcon },
  { key: 'bank', label: 'ব্যাংক ব্যালেন্স', Icon: BankIcon },
  { key: 'gold', label: 'স্বর্ণের মূল্য', Icon: GoldIcon },
  { key: 'silver', label: 'রুপার মূল্য', Icon: SilverIcon },
  { key: 'business', label: 'ব্যবসার মালামাল', Icon: BriefcaseIcon },
  { key: 'receivable', label: 'পাওনা টাকা', Icon: ReceivableIcon },
  { key: 'debt', label: 'ঋণ বা দেনা', Icon: DebtIcon, tone: 'danger' },
]

export default function ZakatForm({ values, onFieldChange, onReset, nisab }: ZakatFormProps) {
  return (
    <section className="section-shell py-12 sm:py-16" id="calculator">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">জাকাত ক্যালকুলেটর</p>
          <h2 className="mt-2 font-serif text-3xl text-emerald-900">আপনার সম্পদ যোগ করুন</h2>
          <p className="mt-2 text-sm text-emerald-600">
            তথ্য পরিবর্তন করলে ফলাফল সাথে সাথে আপডেট হবে।
          </p>
        </div>
        <div className="rounded-xl border border-amber-200/70 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">নিসাব</span>: {formatBanglaNumber(nisab)} টাকা
        </div>
      </div>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="mt-8 grid gap-6 motion-safe:animate-float-in"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ key, label, Icon, tone }) => {
            const isDebt = tone === 'danger'
            const fieldTone = isDebt
              ? 'border-rose-100/80 bg-rose-50/30'
              : 'border-emerald-100/70 bg-white/80'
            const iconTone = isDebt
              ? 'bg-rose-50 text-rose-600'
              : 'bg-emerald-50 text-emerald-700'

            return (
              <div
                key={key}
                className={`group rounded-2xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-200 ${fieldTone}`}
              >
                <label htmlFor={key} className="text-sm font-medium text-emerald-900">
                  {label}
                </label>
                <div className="mt-3 flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconTone}`}>
                    <Icon />
                  </span>
                  <div className="flex-1">
                    <input
                      id={key}
                      name={key}
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      value={values[key]}
                      onChange={(event) => {
                        onFieldChange(key, event.target.value)
                      }}
                      className="w-full border-none bg-transparent text-lg font-semibold text-emerald-950 placeholder:text-emerald-300 focus:outline-none"
                      placeholder="০"
                      aria-label={label}
                    />
                    <p className="mt-1 text-xs text-emerald-500">টাকা</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-emerald-600">
            আপনি চাইলে শুধুমাত্র প্রযোজ্য ক্ষেত্রগুলোই পূরণ করুন।
          </p>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            রিসেট করুন
          </button>
        </div>
      </form>
    </section>
  )
}

function CashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function BankIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10l9-5 9 5" />
      <path d="M4 10v8h16v-8" />
      <path d="M8 10v8" />
      <path d="M12 10v8" />
      <path d="M16 10v8" />
    </svg>
  )
}

function GoldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l2.6 5.2 5.8.8-4.2 4.1 1 5.8L12 16l-5.2 2.9 1-5.8L3.6 9l5.8-.8L12 3z" />
    </svg>
  )
}

function SilverIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="8" width="16" height="10" rx="2" />
      <path d="M9 8V6a3 3 0 013-3h0a3 3 0 013 3v2" />
      <path d="M4 12h16" />
    </svg>
  )
}

function ReceivableIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v10" />
      <path d="M9 10l3 3 3-3" />
      <rect x="4" y="13" width="16" height="7" rx="2" />
    </svg>
  )
}

function DebtIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8" />
    </svg>
  )
}

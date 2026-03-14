import { formatBanglaNumber } from '@/lib/zakatCalculator'

type GoldRate = {
  karat: string
  marketPrice: number
  zakatEligiblePrice: number
}

type FitraRate = {
  item: string
  amount: string
  perKg: number
  fitra: number
}

const goldRates: GoldRate[] = [
  { karat: '২২ ক্যারেট', marketPrice: 258825, zakatEligiblePrice: 220000 },
  { karat: '২১ ক্যারেট', marketPrice: 247100, zakatEligiblePrice: 210000 },
  { karat: '১৮ ক্যারেট', marketPrice: 211760, zakatEligiblePrice: 18000 },
  { karat: 'সনাতন', marketPrice: 173330, zakatEligiblePrice: 150000 },
]

const fitraRates: FitraRate[] = [
  { item: 'কিশমিশ', amount: '৩.৩ কেজি', perKg: 850, fitra: 2800 },
  { item: 'পনির', amount: '৩.৩ কেজি', perKg: 803, fitra: 2650 },
  { item: 'খেজুর', amount: '৩.৩ কেজি', perKg: 606, fitra: 2000 },
  { item: 'যব', amount: '৩.৩ কেজি', perKg: 136, fitra: 450 },
  { item: 'গম/ আটা', amount: '১.৬৫ কেজি', perKg: 60, fitra: 100 },
]

export default function MarketUpdates() {
  return (
    <section className="section-shell py-12 sm:py-14 motion-safe:animate-fade-in">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-700">স্বর্ণালংকারের জাকাতযোগ্য মূল্য</p>
              <h2 className="mt-2 font-serif text-2xl text-emerald-900">বাজার দর (২১ ফেব্রুয়ারি ২০২৬)</h2>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              রাহমানিয়া
            </span>
          </div>
          <p className="mt-3 text-sm text-emerald-600">
            বাংলাদেশ জুয়েলার্স এসোসিয়েশনের ঘোষিত মূল্য তালিকা অনুযায়ী স্বর্ণালংকারের জাকাত আদায়ের হিসাব।
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-emerald-100">
            <table className="min-w-[520px] w-full text-left text-xs sm:text-sm">
              <thead className="bg-emerald-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-medium">স্বর্ণ</th>
                  <th className="px-4 py-3 font-medium">বাজারমূল্য (প্রতি ভরি)</th>
                  <th className="px-4 py-3 font-medium"> ১৫% বাদে জাকাতযোগ্য মূল্য</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white">
                {goldRates.map((rate) => (
                  <tr key={rate.karat} className="transition hover:bg-emerald-50/60">
                    <td className="px-4 py-3 font-medium text-emerald-900">{rate.karat}</td>
                    <td className="px-4 py-3 text-emerald-700">
                      {formatBanglaNumber(rate.marketPrice)} টাকা
                    </td>
                    <td className="px-4 py-3 text-emerald-700">
                      {formatBanglaNumber(rate.zakatEligiblePrice)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-emerald-600">
            বিজ্ঞপ্তিতে জানানো হয়েছে, উপরিউক্ত জাকাতযোগ্য মূল্যের ভিত্তিতে মোট স্বর্ণমূল্যের ওপর ২.৫% হারে জাকাত দিতে হবে।
          </p>
        </div>

        <div className="card-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-700">সদকায়ে ফিতর</p>
              <h2 className="mt-2 font-serif text-2xl text-emerald-900">ফিতরার হিসাব (রাহমানিয়া আরাবিয়া)</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              ২০২৬ তালিকা
            </span>
          </div>
          <p className="mt-3 text-sm text-emerald-600">
            ঘোষিত খাদ্যদ্রব্য, পরিমাণ এবং বাজারদর অনুযায়ী এক জনের ফিতরা নিচে দেখানো হলো।
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-emerald-100">
            <table className="min-w-[560px] w-full text-left text-xs sm:text-sm">
              <thead className="bg-emerald-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-medium">খাদ্যদ্রব্য</th>
                  <th className="px-4 py-3 font-medium">পরিমাণ</th>
                  <th className="px-4 py-3 font-medium">প্রতি কেজি দর</th>
                  <th className="px-4 py-3 font-medium">১টি ফিতরা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white">
                {fitraRates.map((rate) => (
                  <tr key={rate.item} className="transition hover:bg-emerald-50/60">
                    <td className="px-4 py-3 font-medium text-emerald-900">{rate.item}</td>
                    <td className="px-4 py-3 text-emerald-700">{rate.amount}</td>
                    <td className="px-4 py-3 text-emerald-700">
                      {formatBanglaNumber(rate.perKg)} টাকা
                    </td>
                    <td className="px-4 py-3 text-emerald-700">
                      {formatBanglaNumber(rate.fitra)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

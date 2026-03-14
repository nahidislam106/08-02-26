export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" />
      <div className="section-shell relative py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/40 bg-white/10 px-4 py-1 text-sm text-amber-100 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            ইসলামিক ফাইন্যান্স
          </div>
          <div className="text-xs sm:text-sm text-emerald-100/80 sm:text-right">
            <p className="font-semibold text-amber-100">সৌজন্যে</p>
            <p>Nahid&apos;s IoT &amp; Software Solutions</p>
          </div>
        </div>
        <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
          জাকাত ক্যালকুলেটর
        </h1>
        <p className="mt-4 max-w-2xl text-base text-emerald-100/90 sm:text-lg">
          আপনার সম্পদের উপর ভিত্তি করে সহজে জাকাত হিসাব করুন
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-emerald-100/80">
          <div className="rounded-full border border-emerald-500/30 bg-emerald-900/40 px-4 py-2">
            ২০২৬ নিসাব আপডেট
          </div>
          <div className="rounded-full border border-emerald-500/30 bg-emerald-900/40 px-4 py-2">
            তাৎক্ষণিক হিসাব
          </div>
        </div>
      </div>
    </header>
  )
}

"use client"

import { useEffect, useState } from 'react'

const hadiths = [
  {
    text: 'ইসলাম পাঁচটি বিষয়ের উপর প্রতিষ্ঠিত: আল্লাহ ছাড়া কোনো উপাস্য নেই এবং মুহাম্মদ (সা.) আল্লাহর রাসূল— এ সাক্ষ্য, সালাত কায়েম, জাকাত প্রদান, রমজানের রোজা, হজ।',
    source: '— সহিহ বুখারি ৮, সহিহ মুসলিম ১৬',
  },
  {
    text: 'উপরের হাত (দানকারী) নিচের হাত (গ্রহীতার) চেয়ে উত্তম।',
    source: '— সহিহ বুখারি ১৪২৭, সহিহ মুসলিম ১০৩৩',
  },
  {
    text: 'সদকা সম্পদ কমায় না।',
    source: '— সহিহ মুসলিম ২৫৮৮',
  },
  {
    text: 'যে ব্যক্তি মানুষের কাছে ভিক্ষা চায়, কিয়ামতের দিন সে নিজের মুখে ক্ষতচিহ্ন নিয়ে আসবে।',
    source: '— সহিহ বুখারি ১৪৭৪, সহিহ মুসলিম ১০৪০',
  },
  {
    text: 'খেজুরের অর্ধেক দিয়েও আগুন থেকে বাঁচো।',
    source: '— সহিহ বুখারি ১৪১০, সহিহ মুসলিম ১০১৬',
  },
  {
    text: 'যে ব্যক্তি হালাল সম্পদ থেকে সদকা করে, আল্লাহ তা গ্রহণ করেন এবং তা বৃদ্ধি করেন।',
    source: '— সহিহ বুখারি ১৪১০, সহিহ মুসলিম ১০১৪',
  },
  {
    text: 'আমি তাদের বিরুদ্ধে যুদ্ধ করব যারা সালাত ও জাকাতের মধ্যে পার্থক্য করবে।',
    source: '— সহিহ বুখারি ১৪০০, সহিহ মুসলিম ২০',
  },
  {
    text: 'তাদের ধনীদের থেকে জাকাত গ্রহণ করে তাদের দরিদ্রদের মধ্যে বণ্টন করবে।',
    source: '— সহিহ বুখারি ১৩৯৫, সহিহ মুসলিম ১৯',
  },
]

const ROTATION_MS = 6500

export default function HadithSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % hadiths.length)
    }, ROTATION_MS)

    return () => window.clearInterval(timer)
  }, [])

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % hadiths.length)
  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + hadiths.length) % hadiths.length)

  return (
    <section className="section-shell py-12 sm:py-14 motion-safe:animate-fade-in">
      <div>
        <p className="text-sm font-semibold text-emerald-700">হাদিস সমূহ</p>
        <h2 className="mt-2 font-serif text-3xl text-emerald-900">জাকাতের গুরুত্ব</h2>
        <p className="mt-2 max-w-2xl text-sm text-emerald-600">
          ইসলামে জাকাত আত্মশুদ্ধি, সমাজের ভারসাম্য এবং সম্পদের পবিত্রতা রক্ষার একটি গুরুত্বপূর্ণ ইবাদত।
        </p>
      </div>
      <div className="mt-8">
        <div className="relative min-h-[220px] sm:min-h-[200px]" aria-live="polite">
          {hadiths.map((hadith, index) => {
            const isActive = index === activeIndex

            return (
              <div
                key={index}
                aria-hidden={!isActive}
                className={`card-surface absolute inset-0 p-6 transition-all duration-700 ease-out ${
                  isActive
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3 pointer-events-none'
                }`}
              >
                <blockquote className="text-lg leading-relaxed text-emerald-900">
                  {hadith.text}
                </blockquote>
                <p className="mt-4 text-sm font-medium text-emerald-600">{hadith.source}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              পূর্বের
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              পরের
            </button>
          </div>
          <div className="flex items-center gap-2">
            {hadiths.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === activeIndex ? 'bg-emerald-700' : 'bg-emerald-200'
                }`}
                aria-label={`হাদিস ${index + 1}`}
                aria-pressed={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

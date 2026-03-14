export default function Notice() {
  return (
    <section className="section-shell py-10 sm:py-12">
      <div className="card-surface motion-safe:animate-fade-in p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            সরকারি তথ্য
          </span>
          <span className="text-xs text-emerald-500">নিসাব: ৫২.৫ ভরি রুপা</span>
        </div>
        <p className="mt-4 text-base leading-relaxed text-emerald-900">
          বাংলাদেশে ২০২৬ সালের জন্য জাকাতের নিসাব নির্ধারণ করা হয়েছে প্রায় ২,৩০,০০০ টাকা (৫২.৫ ভরি রুপার মূল্য অনুযায়ী)। যার মোট জাকাতযোগ্য সম্পদ এই পরিমাণের বেশি এবং এক বছর অতিক্রম করেছে, তার উপর জাকাত ফরজ।
        </p>
      </div>
    </section>
  )
}

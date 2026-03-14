import './globals.css'
import { Hind_Siliguri, Noto_Serif_Bengali } from 'next/font/google'

export const metadata = {
  title: 'Zakat Calculator Bangladesh',
  description: 'বাংলাদেশের জন্য আধুনিক জাকাত ক্যালকুলেটর',
}

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  weight: ['600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${notoSerifBengali.variable}`}>
      <body className="font-sans text-emerald-950 bg-emerald-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}

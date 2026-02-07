export const metadata = {
  title: 'Multispectral Sensor Dashboard',
  description: 'Real-time monitoring of AS7265X and AS7341 spectral sensors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#ffffff' }}>{children}</body>
    </html>
  )
}

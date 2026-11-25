import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jugador del Partido · Football Vote',
  description: 'Vota por el mejor jugador del partido en Avalanche Fuji',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

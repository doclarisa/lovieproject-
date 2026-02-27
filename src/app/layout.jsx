import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'LovieProject — Celebrating Creative Women 55+',
    template: '%s — LovieProject',
  },
  description:
    'A curated gallery and community of remarkable women 55+ — artists, travelers, healers and creators from around the world. · Галерея и сообщество замечательных женщин 55+ со всего мира.',
  openGraph: {
    siteName: 'LovieProject',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/homepagewomen.jpg',
        width: 1200,
        height: 800,
        alt: 'LovieProject — Women Who Inspire',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/homepagewomen.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAF6F0' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

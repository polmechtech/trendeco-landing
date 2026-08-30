import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import CartButton from "@/components/CartButton";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = "https://trendeco.eu";
const gaId = "G-B2Z2BZS60S";
const whatsappLink = "https://wa.me/48512077770?text=Dzień%20dobry%2C%20mam%20pytanie%20o%20ofertę%20TrendEco.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "TrendEco — maszyny i narzędzia", template: "%s | TrendEco" },
  description: "Maszyny i narzędzia dla meblarstwa, budownictwa i obróbki drewna. Aktualne ceny i dostępność z ofert TrendEco na Allegro.",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icon.svg?v=20260830-6", type: "image/svg+xml" },
      { url: "/trendeco-favicon-20260830.ico?v=20260830-6", type: "image/x-icon", sizes: "32x32" },
    ],
    shortcut: "/trendeco-favicon-20260830.ico?v=20260830-6",
  },
  openGraph: { type: "website", locale: "pl_PL", url: siteUrl, siteName: "TrendEco", title: "TrendEco — maszyny i narzędzia", description: "Aktualny katalog maszyn i narzędzi TrendEco. Zakup, płatność i dostawa realizowane przez Allegro." },
  twitter: { card: "summary_large_image", title: "TrendEco — maszyny i narzędzia", description: "Aktualny katalog ofert TrendEco dostępnych na Allegro." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  category: "commerce",
};

const organizationJsonLd = {
  "@context": "https://schema.org", "@type": "Organization", name: "TrendEco", url: siteUrl,
  email: "mail@trendeco.eu", telephone: "+48512077770",
  address: { "@type": "PostalAddress", streetAddress: "Jagielska 25/27", postalCode: "02-886", addressLocality: "Warszawa", addressCountry: "PL" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        {children}
        <CartButton />
        <CookieConsent />
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Skontaktuj się przez WhatsApp" title="WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl ring-4 ring-white/80 transition hover:scale-105 hover:bg-green-500 active:scale-95 sm:bottom-7 sm:right-7">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current"><path d="M6.62 10.79a15.5 15.5 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" /></svg>
        </a>
        <Script id="google-consent-default" strategy="beforeInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}</Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script>
      </body>
    </html>
  );
}

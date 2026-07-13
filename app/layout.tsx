import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://trendeco.eu";
const gaId = "G-B2Z2BZS60S";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TrendEco — maszyny i narzędzia",
    template: "%s | TrendEco",
  },
  description:
    "Maszyny i narzędzia dla meblarstwa, budownictwa i obróbki drewna. Aktualne ceny i dostępność z ofert TrendEco na Allegro.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: siteUrl,
    siteName: "TrendEco",
    title: "TrendEco — maszyny i narzędzia",
    description:
      "Aktualny katalog maszyn i narzędzi TrendEco. Zakup, płatność i dostawa realizowane przez Allegro.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendEco — maszyny i narzędzia",
    description: "Aktualny katalog ofert TrendEco dostępnych na Allegro.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "commerce",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TrendEco",
  url: siteUrl,
  email: "info@widia.tech",
  telephone: "+48512077770",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jagielska 25/27",
    postalCode: "02-886",
    addressLocality: "Warszawa",
    addressCountry: "PL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
        </Script>
      </body>
    </html>
  );
}

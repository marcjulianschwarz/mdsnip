import styles from "./layout.module.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import QueryProvider from "./providers";
import Link from "next/link";
import { PreferencesProvider } from "./hooks/usePreferences";
import { UserProvider } from "./hooks/useUser";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mdsnip.com - Share beautifully rendered markdown notes.",
  description:
    "Use mdsnip.com to quickly share markdown notes via unique links.",
  openGraph: {
    title: "mdsnip.com - Share beautifully rendered markdown notes.",
    description:
      "Use mdsnip.com to quickly share markdown notes via unique links.",
    url: "https://mdsnip.com",
    siteName: "MDsnip",
    images: [
      {
        url: "/og/test.png",
        width: 1200,
        height: 630,
        alt: "Image",
      },
    ],
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>
          <UserProvider>
            <PreferencesProvider>{children}</PreferencesProvider>
          </UserProvider>
        </QueryProvider>
        <div className={styles.footer}>
          <Link href={"/privacy/impressum"}>Impressum</Link>
          <p>|</p>
          <Link href={"/privacy/data"}>Datenschutzerklärung</Link>
        </div>
      </body>
    </html>
  );
}

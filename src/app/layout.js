// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Footer from "./components/Footer";
import ThemeRegistry from "./components/ThemeRegistry";
import DynamicDiv from "./components/DynamicDiv";
import { IconButton, Link } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { AuthProvider } from './components/AuthContext'; // Importe useAuth

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "BWR Bombas Hidráulicas",
  description:
    "Soluções em bombas hidráulicas para diversas aplicações. Catálogo completo com produtos de alta qualidade e desempenho.",
  keywords: [
    "bombas hidráulicas",
    "bombas centrífugas",
    "bombas submersíveis",
    "bombas de pistão",
    "bombas de engrenagem",
    "bombas de palhetas",
    "bombas axiais",
    "bombas peristálticas",
    "bombas de diafragma",
    "equipamentos hidráulicos",
    "manutenção de bombas",
    "venda de bombas",
    "BWR Bombas",
    "conserto de bombas" //Added
  ],
  metadataBase: new URL('https://www.bwr.com.br'), //Added base url to metadata
  openGraph: {
    title: 'BWR Bombas Hidráulicas',
    description: 'Especialistas em manutenção, venda e reformas de bombas hidráulicas de alta pressão.',
    url: 'https://www.bwr.com.br',
    siteName: 'BWR Bombas',
    images: [
      {
        url: 'https://www.bwr.com.br/marca.png',
        width: 80,
        height: 80,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeRegistry>
          <AuthProvider> {/* Envolve a aplicação com AuthProvider */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <DynamicDiv />
              <main
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  {children}
                </Suspense>
              </main>
              <Footer />
              <Link
                href="https://web.whatsapp.com/send?phone=+5511930064375"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 100 }}
              >
                <IconButton
                  size="large"
                  sx={{
                    backgroundColor: "#25d366",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#128C7E",
                    },
                  }}
                >
                  <WhatsAppIcon fontSize="large" />
                </IconButton>
              </Link>
            </div>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
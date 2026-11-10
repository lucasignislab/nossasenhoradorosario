import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/features/ServiceWorkerRegister";
import "../styles/globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Terreiro Senhora do Rosário | Umbanda e Espiritualidade",
  description:
    "Um espaço de fé, amor e acolhimento espiritual sob a luz da Umbanda. Conheça nossa comunidade, agenda de giras e venha nos visitar.",
  keywords: ["umbanda", "terreiro", "senhora do rosário", "espiritualidade", "gira", "axé"],
  openGraph: {
    title: "Terreiro Senhora do Rosário",
    description: "Portas abertas para a caridade e o Axé.",
    locale: "pt_BR",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "Senhora do Rosário",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1d21",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

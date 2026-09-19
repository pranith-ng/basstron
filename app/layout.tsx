import type { Metadata } from "next";
import { Geist, Geist_Mono, Josefin_Sans, Londrina_Solid, Poetsen_One } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "./context/Context";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
});

const londrina = Londrina_Solid({
  weight: "400", // Required for fixed-weight fonts
  subsets: ["latin"],
  variable: "--font-londrina",
});

const poetsen = Poetsen_One({
  weight: "400", // Required for fixed-weight fonts
  subsets: ["latin"],
  variable: "--font-poetsen",
});

export const metadata: Metadata = {
  title: "BASSTRON",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poetsen.variable} ${londrina.variable} ${josefin.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
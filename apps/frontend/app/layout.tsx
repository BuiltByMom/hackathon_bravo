import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/useAuthContext";
import { Header } from "@/components/header";
import { ContactProvider } from "@/context/useGetContacts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sophon - Send Digital Assets",
  description:
    "Send digital assets (Crypto, NFT, Access Tokens) via email using magic links",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ContactProvider>
            <Header />
            <main className="min-h-screen bg-background">{children}</main>
          </ContactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

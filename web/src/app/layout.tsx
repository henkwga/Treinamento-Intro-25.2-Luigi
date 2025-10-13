import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/auth";

export const metadata: Metadata = {
  title: "DISCOSHOP",
  description: "Clássicos, raridades e novos sons girando sem parar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0e0f11] text-white overflow-x-hidden">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

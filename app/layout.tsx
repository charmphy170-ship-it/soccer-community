import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SoccerHub - World Cup 2026 Predictions",
  description: "Join the community. Share predictions. Chat with fans.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
          {children}
        </main>
      </body>
    </html>
  );
}

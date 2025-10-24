import type { Metadata } from "next";
import { ApolloWrapper } from "@/components/ApolloWrapper";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AniList Profile Gate",
  description: "Browse anime with a profile gate",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ApolloWrapper>
          <main className="flex-1">{children}</main>
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}

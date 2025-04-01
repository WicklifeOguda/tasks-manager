"use client";
//import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";

/* export const metadata: Metadata = {
  title: "Task Management App",
  description: "Manage your tasks efficiently",
};
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-400 text-gray-900" suppressHydrationWarning>
        <ApolloProvider client={client}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ApolloProvider>
      </body>
    </html>
  );
}

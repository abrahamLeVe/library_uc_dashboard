import "./globals.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard",
    default: "UC Library Dashboard",
  },
  description: "Biblioteca de libros y autores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased overflow-x-hidden max-w-screen-2xl mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Torres Lara Dashboard",
    default: "UC Library Dashboard",
  },
  description: "Biblioteca de libros y autores",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
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

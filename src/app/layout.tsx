import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Leetpeers",
  description: "Collaborate and Conquer Coding Challenges",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 to-black text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

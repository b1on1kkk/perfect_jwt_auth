import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Test good jwt auth",
  description: "Test good jwt auth"
};

import Tanstack_provider from "@/providers/tanstack_provider/tanstack_provider";

const RootLayout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Tanstack_provider>{children}</Tanstack_provider>
      </body>
    </html>
  );
};

export default RootLayout;

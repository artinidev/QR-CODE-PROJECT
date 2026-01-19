import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use Inter for modern look
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDI Platform",
  description: "Your Professional Digital Identity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning is needed for next-themes/theme-provider handling of classes */}
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="pdi-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

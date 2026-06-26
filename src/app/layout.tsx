import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Throne of Realms — The Unlikely Hero",
  description: "A 2D action-adventure game where an unlikely hero discovers divine powers through bathroom portals, battling across Indian and Japanese mythological realms.",
  keywords: ["game", "2D", "action", "adventure", "pixel art", "mythology"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load game fonts via Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=MedievalSharp&family=VT323&family=Pixelify+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#0a0a1e] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}

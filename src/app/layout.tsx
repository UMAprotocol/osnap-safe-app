import "@rainbow-me/rainbowkit/styles.css";
import { enableMapSet } from "immer";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

enableMapSet();

const halyardDisplay = localFont({
  src: [
    { path: "./fonts/HalyardDisplayLight.woff2", weight: "300" },
    { path: "./fonts/HalyardDisplayRegular.woff2", weight: "400" },
    { path: "./fonts/HalyardDisplaySemiBold.woff2", weight: "500" },
    { path: "./fonts/HalyardDisplayBold.woff2", weight: "600" },
  ],
  display: "swap",
  variable: "--font-halyard-display",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={halyardDisplay.variable}>
      <body
        className="bg-gray-50 bg-top bg-no-repeat"
        style={{
          backgroundImage: "url('/background.svg')",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import { enableMapSet } from "immer";

enableMapSet();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="bg-gray-50 bg-no-repeat bg-top"
        style={{
          backgroundImage: "url('/background.svg')",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

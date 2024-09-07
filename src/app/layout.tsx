import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ViewTransitions } from "next-view-transitions";

import { ThemeProvider } from "@/components/theme-provider";
import { ProgressProviders } from "@/components/progress-bar";


export const metadata: Metadata = {
  metadataBase: new URL("https://zeno-muesum-companion.vercel.app"),
  title: {
    default: "Zeno - Your own mueusem companion",
    template: "%s | Zeno - Your own mueusem companion",
  },
  description: "Zeno: Your intelligent museum companion. Skip queues, book tickets effortlessly, and enhance your cultural experience with our AI-powered chatbot. Multilingual support and seamless payments for a smoother museum visit.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    description: 'Zeno: Your intelligent museum companion. Skip queues, book tickets effortlessly, and enhance your cultural experience with our AI-powered chatbot. Multilingual support and seamless payments for a smoother museum visit.',
    images: ['https://utfs.io/f/8a428f85-ae83-4ca7-9237-6f8b65411293-eun6ii.png'],
    url: 'https://zeno-muesum-companion.vercel.app/'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno - Your own mueusem companion',
    description: 'Zeno: Your intelligent museum companion. Skip queues, book tickets effortlessly, and enhance your cultural experience with our AI-powered chatbot. Multilingual support and seamless payments for a smoother museum visit.',
    siteId: "",
    creator: "@krishkalaria12",
    creatorId: "",
    images: ['https://utfs.io/f/8a428f85-ae83-4ca7-9237-6f8b65411293-eun6ii.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <ViewTransitions>
        <ProgressProviders>
          <html lang="en" className={`${GeistSans.variable}`}>
            <body>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </body>
          </html>
        </ProgressProviders>
      </ViewTransitions>
    </ClerkProvider>
  );
}

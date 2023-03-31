import "./globals.css";

export const metadata = {
  title: "Parallel",
  description: "Use GPT-3 like search engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
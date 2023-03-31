import "./globals.css";

export const metadata = {
  title: "Paralll",
  description: "Use GPT-3 like search engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="lofi">
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}

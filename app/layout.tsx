import "styles/main.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Powder Keg</title>
        <meta
          name="description"
          content="Powder Keg is a pirate battle game made with React Three Fiber."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:image"
          content="https://powderkeg.dmcb.dev/powderkeg.webp"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

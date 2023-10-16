import "styles/main.css";

export const metadata = {
  metadataBase: new URL("https://powderkeg.dmcb.dev"),
};

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Charm&family=WindSong&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

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
      </head>
      <body>{children}</body>
    </html>
  );
}

import "./styles.css";

export const metadata = {
  title: "Voice Bot Admin",
  description: "Admin-editable RAG knowledge for a prototype voice answer bot"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


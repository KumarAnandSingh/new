import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studify.in - AI Tools & Productivity for Students',
  description: 'Comprehensive platform for students with AI tools, automation resources, and productivity guides to enhance learning experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

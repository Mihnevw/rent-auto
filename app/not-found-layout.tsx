import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | AUTO Rent",
  description: "The page you are looking for could not be found. Please check the URL or return to our homepage.",
  robots: "noindex, nofollow",
};

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
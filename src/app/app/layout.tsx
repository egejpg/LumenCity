import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LumenCity — Bildirim",
  description: "Vatandaş aydınlatma bildirim uygulaması",
};

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

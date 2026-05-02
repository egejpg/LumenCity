export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
      {children}
    </main>
  );
}

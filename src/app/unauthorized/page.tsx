import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-3">Erişim Reddedildi</h1>
        <p className="text-gray-400 mb-8">
          Bu sayfaya erişim yetkiniz yok. Yalnızca belediye yetkilileri bu sayfayı görüntüleyebilir.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-lg transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </main>
  );
}

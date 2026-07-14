import type { Metadata } from "next";
import VideoAdmin from "./VideoAdmin";

export const metadata: Metadata = {
  title: "Filmy produktów — administracja",
  robots: { index: false, follow: false },
};

export default function VideosAdminPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-950">
      <div className="mx-auto mb-8 max-w-2xl">
        <h1 className="text-3xl font-black">Filmy produktów</h1>
        <p className="mt-3 text-zinc-600">
          Wpisz numer oferty Allegro oraz link YouTube lub TikTok. Film zostanie przypisany do automatycznej strony tej oferty.
        </p>
      </div>
      <VideoAdmin />
    </main>
  );
}

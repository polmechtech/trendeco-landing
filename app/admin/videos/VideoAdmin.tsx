"use client";

import { FormEvent, useState } from "react";

export default function VideoAdmin() {
  const [offerId, setOfferId] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadVideos() {
    setMessage("");
    if (!offerId.trim()) return setMessage("Wpisz numer oferty Allegro.");

    const response = await fetch(`/api/videos?offerId=${encodeURIComponent(offerId.trim())}`);
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? "Nie udało się pobrać danych.");

    setYoutube(data.youtube ?? "");
    setTiktok(data.tiktok ?? "");
    setMessage("Dane wczytane.");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offerId, youtube, tiktok }),
      });
      const data = await response.json();
      setMessage(response.ok ? "Zapisano. Film pojawi się na stronie produktu." : data.error ?? "Błąd zapisu.");
    } catch {
      setMessage("Błąd połączenia.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-2xl space-y-5 rounded-3xl bg-white p-6 shadow-sm md:p-10">
      <div>
        <label className="block text-sm font-bold">Numer oferty Allegro</label>
        <div className="mt-2 flex gap-2">
          <input value={offerId} onChange={(e) => setOfferId(e.target.value)} className="min-w-0 flex-1 rounded-xl border px-4 py-3" placeholder="np. 12345678901" />
          <button type="button" onClick={loadVideos} className="rounded-xl border px-4 font-bold">Wczytaj</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold">Link YouTube</label>
        <input value={youtube} onChange={(e) => setYoutube(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" placeholder="https://www.youtube.com/watch?v=..." />
      </div>

      <div>
        <label className="block text-sm font-bold">Link TikTok</label>
        <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" placeholder="https://www.tiktok.com/@konto/video/..." />
      </div>

      <div>
        <label className="block text-sm font-bold">Hasło administracyjne</label>
        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" />
      </div>

      <button disabled={saving} className="w-full rounded-full bg-zinc-950 px-6 py-4 font-black text-white disabled:opacity-50">
        {saving ? "Zapisywanie..." : "Zapisz filmy"}
      </button>

      {message && <p className="rounded-xl bg-zinc-100 p-4 text-sm">{message}</p>}
      <p className="text-sm text-zinc-500">Aby usunąć film, wyczyść jego pole i zapisz ponownie.</p>
    </form>
  );
}

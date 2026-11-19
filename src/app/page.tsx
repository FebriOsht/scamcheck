"use client";

import { useState } from "react";
import {
  ShieldAlert,
  ShieldQuestion,
  ShieldCheck,
  HelpCircle,
  Loader2,
  Search,
  ArrowRight,
  Share2,
  Smartphone,
  VenetianMask,
  Link2,
  KeyRound,
} from "lucide-react";
import { API_URL, type CheckResult, type Lang, t, explainSignal } from "@/lib";

type Status = "idle" | "loading" | "done";

const THEME = {
  danger: { icon: ShieldAlert, ring: "ring-red-500/40", bg: "bg-red-500/10", fg: "text-red-400", glow: "shadow-[0_0_60px_-15px] shadow-red-500/40" },
  warn: { icon: ShieldQuestion, ring: "ring-amber-500/40", bg: "bg-amber-500/10", fg: "text-amber-400", glow: "shadow-[0_0_60px_-15px] shadow-amber-500/40" },
  clear: { icon: ShieldCheck, ring: "ring-emerald-500/40", bg: "bg-emerald-500/10", fg: "text-emerald-400", glow: "shadow-[0_0_60px_-15px] shadow-emerald-500/40" },
  unknown: { icon: HelpCircle, ring: "ring-slate-500/40", bg: "bg-slate-500/10", fg: "text-slate-400", glow: "" },
} as const;

const FOX = "https://cdn.jsdelivr.net/npm/@vulpfest/icons@0.3/svg/vulpfest-mark-night.svg";

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [err, setErr] = useState("");
  const [shared, setShared] = useState(false);
  const tr = t[lang];

  const CARDS = [
    { icon: Smartphone, title: lang === "id" ? "Unduhan aplikasi" : "App downloads", desc: lang === "id" ? "File .apk atau .exe berkedok \u201cundangan\u201d atau \u201cresi\u201d." : "An .apk or .exe hidden as an \u201cinvitation\u201d or \u201creceipt\u201d." },
    { icon: VenetianMask, title: lang === "id" ? "Alamat tiruan" : "Look-alike sites", desc: lang === "id" ? "Meniru bank, dompet digital, atau toko ternama." : "Impersonating a bank, wallet, or well-known store." },
    { icon: Link2, title: lang === "id" ? "Pengalihan tersembunyi" : "Hidden redirects", desc: lang === "id" ? "Tautan pendek yang diam-diam mengarah ke tempat lain." : "A short link that quietly leads somewhere else." },
    { icon: KeyRound, title: lang === "id" ? "Pencuri data" : "Data thieves", desc: lang === "id" ? "Meminta kata sandi, PIN, atau OTP lalu mengirimnya ke pihak lain." : "Asks for a password, PIN, or OTP and sends it away." },
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = url.trim();
    if (!value) return;
    setStatus("loading");
    setErr("");
    setResult(null);
    setShared(false);
    try {
      const res = await fetch(`${API_URL}/api/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
      const data = (await res.json()) as CheckResult;
      if (data.error && !data.verdict) {
        setErr(data.message || tr.advice.unknown);
        setStatus("idle");
        return;
      }
      setResult(data);
      setStatus("done");
    } catch {
      setErr(lang === "id" ? "Gagal menghubungi server. Coba lagi." : "Could not reach the server. Try again.");
      setStatus("idle");
    }
  }

  function reset() {
    setResult(null);
    setStatus("idle");
    setUrl("");
    setErr("");
  }

  async function share() {
    if (!result) return;
    const text = `Scam Check: ${result.input}\n${tr.verdicts[verdict]}\nlab.vulpfest.com/scamcheck`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Scam Check", text });
      } else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 1500);
      }
    } catch {
      /* dibatalkan */
    }
  }

  const verdict = result?.verdict?.level ?? "unknown";
  const theme = THEME[verdict];
  const Icon = theme.icon;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOX} alt="" className="h-7 w-7" />
          <span>Scam Check</span>
        </div>
        <button
          onClick={() => setLang(lang === "id" ? "en" : "id")}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
        >
          {lang === "id" ? "English" : "Indonesia"}
        </button>
      </header>

      <main className="flex-1">
        {status !== "done" && (
          <section className="pt-8">
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl">
              {tr.title}
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/65">{tr.lead}</p>

            <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  inputMode="url"
                  autoCapitalize="off"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={tr.placeholder}
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-3 font-mono text-sm outline-none ring-emerald-400/0 transition placeholder:font-sans placeholder:text-white/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-medium text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {status === "loading" ? tr.checking : tr.check}
              </button>
            </form>

            {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
            <p className="mt-3 text-sm text-white/45">{tr.safeNote}</p>

            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CARDS.map((c) => (
                <div
                  key={c.title}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-medium">{c.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {status === "done" && result && (
          <section className="pt-6">
            <div className={`rise glow rounded-2xl ${theme.bg} p-6 ring-1 ${theme.ring} ${theme.glow}`}>
              <div className="flex items-start gap-4">
                <Icon className={`h-11 w-11 shrink-0 ${theme.fg}`} />
                <div>
                  <h2 className={`font-display text-xl font-bold tracking-tight ${theme.fg}`}>{tr.verdicts[verdict]}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{tr.advice[verdict]}</p>
                </div>
              </div>
            </div>

            <div className="rise rise-1 mt-4 break-words rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
              <div className="text-white/50">{tr.youEntered}:</div>
              <div className="font-mono text-white/90">{result.input}</div>
              {result.final_url && result.final_url !== result.input && (
                <>
                  <div className="mt-3 flex items-center gap-1 text-white/50">
                    <ArrowRight className="h-4 w-4" /> {tr.finalUrl}:
                  </div>
                  <div className="font-mono text-white/90">{result.final_url}</div>
                </>
              )}
            </div>

            {result.signals.length > 0 && (
              <ul className="rise rise-2 mt-4 space-y-2">
                {result.signals.map((s, i) => {
                  const st = THEME[(s.level === "info" ? "warn" : s.level) as keyof typeof THEME] ?? THEME.warn;
                  const SIcon = st.icon;
                  return (
                    <li key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm">
                      <SIcon className={`mt-0.5 h-5 w-5 shrink-0 ${st.fg}`} />
                      <span className="leading-relaxed text-white/85">{explainSignal(s, lang)}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="rise rise-3 mt-6 flex flex-wrap gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm transition hover:border-white/40"
              >
                <Search className="h-4 w-4" /> {tr.againBtn}
              </button>
              <button
                onClick={share}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm transition hover:border-white/40"
              >
                <Share2 className="h-4 w-4" />
                {shared ? (lang === "id" ? "Tersalin" : "Copied") : lang === "id" ? "Bagikan" : "Share"}
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="py-10 text-center text-xs text-white/40">
        <p className="mx-auto max-w-lg text-pretty leading-relaxed">{tr.disclaimer}</p>
        <p className="mt-3">
          {tr.partOf}{" "}
          <a href="https://lab.vulpfest.com" className="text-white/60 underline-offset-2 hover:underline">
            Vulpfest Lab
          </a>
        </p>
      </footer>
    </div>
  );
}

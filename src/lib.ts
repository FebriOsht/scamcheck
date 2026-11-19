// URL backend (Flask di Render). Pengguna tidak pernah melihat ini; frontend memanggilnya di latar belakang.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://scamcheck-2425.onrender.com";

export type Level = "danger" | "warn" | "info";

export interface Signal {
  level: Level;
  code: string;
  [key: string]: unknown;
}

export interface Verdict {
  level: "danger" | "warn" | "clear" | "unknown";
  counts?: { danger: number; warn: number; info: number };
  signals: Signal[];
}

export interface CheckResult {
  input: string;
  url: string | null;
  final_url: string | null;
  chain: { url: string; status: number }[];
  signals: Signal[];
  domain_age_days?: number;
  error: string | null;
  verdict: Verdict;
  message?: string;
}

export type Lang = "id" | "en";

export const t = {
  id: {
    title: "Ragu dengan sebuah tautan? Periksa dulu.",
    lead: "Tempel tautan dari SMS, WhatsApp, email, atau media sosial. Server kami yang membukanya, bukan ponsel Anda, lalu menandai tanda-tanda penipuan yang umum.",
    placeholder: "Tempel tautan di sini, misalnya hadiah-undian.xyz/klaim",
    check: "Periksa",
    checking: "Memeriksa…",
    safeNote:
      "Pemeriksaan aman: tautan dibuka di server kami, tidak ada aplikasi yang terpasang di perangkat Anda.",
    disclaimer:
      "Tidak ada alat yang bisa menjamin tautan 100% aman. Hasil terbaik berbunyi \u201ctidak ditemukan tanda bahaya\u201d, bukan \u201caman\u201d. Tetap waspada, dan jangan pernah memasukkan data pribadi di halaman yang Anda ragukan.",
    againBtn: "Periksa tautan lain",
    finalUrl: "Tujuan akhir",
    youEntered: "Anda memasukkan",
    partOf: "Bagian dari",
    verdicts: {
      danger: "Bahaya — ada tanda penipuan yang kuat",
      warn: "Hati-hati — ada beberapa hal yang mencurigakan",
      clear: "Tidak ditemukan tanda bahaya (tetap waspada)",
      unknown: "Tidak dapat diperiksa",
    },
    advice: {
      danger:
        "Jangan buka tautan ini, jangan pasang aplikasinya, dan jangan masukkan data apa pun. Kalau ini mengatasnamakan sebuah layanan, buka situs resminya langsung, jangan lewat tautan ini.",
      warn: "Berhati-hatilah. Jangan masukkan kata sandi, PIN, OTP, atau data kartu sebelum Anda yakin ini situs resmi.",
      clear:
        "Pemeriksaan otomatis tidak menemukan tanda bahaya yang umum. Ini bukan jaminan aman. Tetap periksa alamatnya dan jangan memberi data pribadi bila ragu.",
      unknown: "Tautan tidak dapat dibuka atau formatnya tidak benar. Periksa kembali tautannya.",
    },
  },
  en: {
    title: "Not sure about a link? Check it first.",
    lead: "Paste a link from SMS, WhatsApp, email, or social media. Our server opens it, not your phone, then flags common signs of a scam.",
    placeholder: "Paste a link here, e.g. prize-draw.xyz/claim",
    check: "Check",
    checking: "Checking…",
    safeNote:
      "Safe to use: the link is opened on our server; nothing is installed on your device.",
    disclaimer:
      "No tool can guarantee a link is 100% safe. The best result reads \u201cno danger found\u201d, not \u201csafe\u201d. Stay alert, and never enter personal data on a page you are unsure about.",
    againBtn: "Check another link",
    finalUrl: "Final destination",
    youEntered: "You entered",
    partOf: "Part of",
    verdicts: {
      danger: "Dangerous — strong signs of a scam",
      warn: "Caution — a few suspicious things",
      clear: "No danger found (stay alert)",
      unknown: "Could not be checked",
    },
    advice: {
      danger:
        "Do not open this link, do not install its app, and do not enter any data. If it claims to be a known service, go to its official site directly, not through this link.",
      warn: "Be careful. Do not enter passwords, PINs, OTPs, or card details until you are sure this is the official site.",
      clear:
        "The automatic check found no common danger signs. This is not a guarantee of safety. Still check the address and do not give personal data if unsure.",
      unknown: "The link could not be opened or is malformed. Check the link and try again.",
    },
  },
} as const;

// Penjelasan tiap sinyal, dua bahasa. {x} diganti nilai dari sinyal.
export function explainSignal(s: Signal, lang: Lang): string {
  const id = lang === "id";
  switch (s.code) {
    case "download-ext":
    case "download":
      return id
        ? `Tautan ini mengunduh file aplikasi (${s.ext || s.kind}). Penipu sering memakai cara ini. Jangan dipasang.`
        : `This link downloads an app file (${s.ext || s.kind}). Scammers often use this. Do not install it.`;
    case "brand-impersonation":
      return id
        ? `Alamat ini menyebut \u201c${s.brand}\u201d tetapi bukan alamat resminya (${s.official}).`
        : `This address mentions \u201c${s.brand}\u201d but is not its official address (${s.official}).`;
    case "credential-form":
      return id
        ? "Halaman ini meminta data rahasia (kata sandi/PIN/OTP)" +
            ((s.cross_domain_post as string[])?.length ? " dan mengirimnya ke domain lain." : ".")
        : "This page asks for secret data (password/PIN/OTP)" +
            ((s.cross_domain_post as string[])?.length ? " and sends it to another domain." : ".");
    case "at-symbol":
      return id
        ? "Alamat memakai tanda @ yang bisa menyembunyikan tujuan sebenarnya."
        : "The address uses an @ sign that can hide the real destination.";
    case "ip-host":
      return id
        ? "Alamat berupa angka IP, bukan nama domain. Situs resmi jarang begini."
        : "The address is a raw IP, not a domain name. Legitimate sites rarely do this.";
    case "punycode":
      return id
        ? "Alamat memakai huruf non-Latin yang bisa menyamar jadi huruf biasa."
        : "The address uses non-Latin letters that can disguise themselves as normal letters.";
    case "new-domain":
      return id
        ? `Alamat ini baru dibuat sekitar ${s.days} hari lalu. Situs resmi biasanya sudah lama ada.`
        : `This domain was registered about ${s.days} days ago. Official sites are usually older.`;
    case "shortener":
      return id
        ? "Ini tautan pendek yang menyembunyikan tujuan. Kami ikuti sampai tujuan akhirnya."
        : "This is a short link that hides its destination. We followed it to the end.";
    case "redirect-chain":
      return id
        ? `Tautan ini melewati ${s.hops} pengalihan sebelum sampai tujuan.`
        : `This link passes through ${s.hops} redirects before arriving.`;
    case "redirects-elsewhere":
      return id
        ? `Tautan berpindah ke alamat lain: ${s.to}.`
        : `The link moves to a different address: ${s.to}.`;
    case "risky-tld":
      return id
        ? `Akhiran domain ${s.tld} sering dipakai untuk penipuan.`
        : `The domain ending ${s.tld} is often used for scams.`;
    case "no-https":
      return id
        ? "Tautan tidak memakai HTTPS, jadi datanya tidak terenkripsi."
        : "The link does not use HTTPS, so its data is not encrypted.";
    default:
      return id ? "Tanda mencurigakan lain ditemukan." : "Another suspicious sign was found.";
  }
}

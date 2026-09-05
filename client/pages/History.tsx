import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Leaf,
  Moon,
  RefreshCw,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getScans } from "../lib/nutriscan-api";

type ScanRecord = {
  id: string;
  image: string;
  name: string;
  brand: string;
  date: string;
  category: string;
  score: number;
  status: string;
  tone: "good" | "average" | "attention";
};

// ===============================
// BACKEND URL
// ===============================

const API_BASE = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
).replace(/\/$/, "");

// ===============================
// IMAGE URL HELPER
// ===============================

const getImageUrl = (image: string) => {
  if (!image) return "";

  // Already a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Backend relative path
  return `${API_BASE}/${image.replace(/^\/+/, "")}`;
};

// ===============================
// DATE FORMATTER
// ===============================

const formatDate = (date: string) => {
  if (!date) return "Unknown date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ===============================
// HISTORY CARD
// ===============================

function HistoryCard({ scan }: { scan: ScanRecord }) {
  const imageUrl = getImageUrl(scan.image);

  return (
    <article className="history-card">
      {/* =========================
          PRODUCT IMAGE
      ========================= */}

      <div className="history-image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${scan.name || "Food product"} package`}
            className="h-full w-full object-contain"
            onError={(event) => {
              console.error(
                "History image failed:",
                imageUrl,
                "Original:",
                scan.image,
              );

              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Leaf className="h-8 w-8 text-[#168A4A]" />
          </div>
        )}
      </div>

      {/* =========================
          PRODUCT DETAILS
      ========================= */}

      <div className="min-w-0 flex-1">
        <span className={`history-category ${scan.tone}`}>
          {scan.category || "Food Product"}
        </span>

        <h2 className="mt-3 text-lg font-bold tracking-[-.03em] text-[#101828] dark:text-white">
          {scan.name || "Scanned Product"}
        </h2>

        <p className="mt-1 text-sm text-[#667085] dark:text-[#98A2B3]">
          {scan.brand || "NutriScan"}
        </p>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-[#98A2B3]">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(scan.date)}
        </p>
      </div>

      {/* =========================
          SCORE
      ========================= */}

      <div className="history-score">
        <div>
          <strong>{scan.score ?? 0}</strong>
          <span>/100</span>
        </div>

        <span className={`history-status ${scan.tone}`}>
          {scan.status || "Analysis Unavailable"}
        </span>

        <Link to={`/result?scan=${scan.id}`} className="history-link">
          View Analysis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

// ===============================
// HISTORY PAGE
// ===============================

export default function History() {
  const [isDark, setIsDark] = useState(
    () => window.localStorage.getItem("nutriscan-theme") !== "light",
  );

  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // THEME
  // ===============================

  const toggleTheme = () => {
    setIsDark((current) => {
      const next = !current;

      window.localStorage.setItem("nutriscan-theme", next ? "dark" : "light");

      return next;
    });
  };

  // ===============================
  // LOAD HISTORY
  // ===============================

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getScans();

      console.log("History API data:", data);

      setScans(data || []);
    } catch (err: any) {
      console.error("History loading error:", err);

      setError(err?.message || "Unable to load scan history.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // INITIAL LOAD
  // ===============================

  useEffect(() => {
    loadHistory();
  }, []);

  // ===============================
  // PAGE
  // ===============================

  return (
    <div
      className={`min-h-screen font-sans text-[#101828] ${
        isDark ? "dark-theme" : "bg-[#F7FBF7]"
      }`}
    >
      {/* =========================
          HEADER
      ========================= */}

      <header className="bg-[#001F16]">
        <div className="mx-auto flex h-[88px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          {/* LOGO */}

          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#168A4A] text-[#B6F35B]">
              <Leaf className="h-5 w-5" />
            </span>

            <span className="text-[22px] font-bold text-white">
              Nutri
              <span className="text-[#B6F35B]">Scan</span>
            </span>
          </Link>

          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-3">
            <button
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={toggleTheme}
              className="icon-button"
            >
              {isDark ? (
                <Sun className="h-[18px] w-[18px]" />
              ) : (
                <Moon className="h-[18px] w-[18px]" />
              )}
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-semibold text-[#B6F35B]"
            >
              <Clock3 className="h-4 w-4" />
              Back to scan
            </Link>
          </div>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="mx-auto max-w-[960px] px-5 py-14 lg:py-20">
        {/* PAGE HEADING */}

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Your recent scans</p>

            <h1 className="section-title mt-2">Scan History</h1>

            <p className="history-page-copy mt-3 max-w-xl text-sm leading-6 text-[#667085]">
              Review your previously scanned food products and their AI health
              analysis.
            </p>
          </div>

          {/* REFRESH */}

          {!loading && !error && (
            <button
              onClick={loadHistory}
              className="flex items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-4 py-2.5 text-sm font-semibold text-[#344054] transition hover:bg-[#F9FAFB]"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          )}
        </div>

        {/* =========================
            HISTORY LIST
        ========================= */}

        <div className="mt-9 space-y-4">
          {/* LOADING */}

          {loading && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#168A4A]" />

              <p className="mt-4 text-sm font-medium text-[#667085]">
                Loading your scan history...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-[#101828]">
                Could not load scan history
              </p>

              <p className="mt-2 text-sm text-[#667085]">{error}</p>

              <button
                onClick={loadHistory}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#168A4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY */}

          {!loading && !error && scans.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <Leaf className="mx-auto h-8 w-8 text-[#168A4A]" />

              <p className="mt-4 text-sm font-semibold text-[#101828]">
                No scans yet
              </p>

              <p className="mt-2 text-sm text-[#667085]">
                Scan a food product to see its analysis here.
              </p>

              <Link
                to="/"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#168A4A] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Scan a Product
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* HISTORY CARDS */}

          {!loading &&
            !error &&
            scans.length > 0 &&
            scans.map((scan) => (
              <HistoryCard key={`${scan.id}-${scan.date}`} scan={scan} />
            ))}
        </div>
      </main>
    </div>
  );
}

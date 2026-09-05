const API_BASE = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Scan a new food product
export async function analyzeProduct(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    body: formData,
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Unable to connect to the analysis service. Please try again.",
    );
  }

  if (!response.ok || !data.success) {
    const raw = data?.message || "";

    if (
      raw.includes("models/") ||
      raw.includes("NOT_FOUND") ||
      raw.includes("generateContent") ||
      raw.includes("v1beta") ||
      raw.includes("503") ||
      raw.includes("high demand")
    ) {
      throw new Error(
        "AI analysis is temporarily unavailable. Please try again in a few moments.",
      );
    }

    throw new Error(raw || "Unable to analyze this product.");
  }

  return data;
}

// Get scan history
export async function getScans() {
  const response = await fetch(`${API_BASE}/api/scans`);

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    throw new Error("Unable to load scan history.");
  }

  if (!response.ok || !data.success) {
    throw new Error(data?.message || "Unable to load scan history.");
  }

  return data.scans;
}

// Get one scan by ID
export async function getScanById(id: string) {
  const response = await fetch(`${API_BASE}/api/scans/${id}`);

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    throw new Error("Unable to load this scan.");
  }

  if (!response.ok || !data.success) {
    throw new Error(data?.message || "Unable to load this scan.");
  }

  return data;
}

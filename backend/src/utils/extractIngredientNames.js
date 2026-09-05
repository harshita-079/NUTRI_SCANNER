const SECTION_STOP_WORDS = [
  "nutrition",
  "nutritional",
  "allergen",
  "storage",
  "manufactured",
  "best before",
  "net weight",
  "contains",
  "customer care",
  "fssai",
];

const extractIngredientNames = (text) => {
  const lower = text.toLowerCase();
  const startIdx = lower.indexOf("ingredient");

  if (startIdx === -1) return [];

  const colonIdx = lower.indexOf(":", startIdx);

  const sliceStart =
    colonIdx !== -1 && colonIdx - startIdx < 20
      ? colonIdx + 1
      : startIdx + "ingredients".length;

  let stopIdx = text.length;

  for (const word of SECTION_STOP_WORDS) {
    const idx = lower.indexOf(word, sliceStart);

    if (idx !== -1 && idx < stopIdx) {
      stopIdx = idx;
    }
  }

  const raw = text.slice(sliceStart, stopIdx);

  return raw
    .split(",")
    .map((part) =>
      part
        .replace(/\([^)]*\)/g, "")
        .replace(/[.:;]+$/g, "")
        .trim(),
    )
    .filter((name) => name.length > 1 && name.length < 40);
};

export default extractIngredientNames;

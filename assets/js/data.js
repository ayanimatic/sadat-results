/**
 * data.js
 * All fetch/JSON access goes through here. GitHub Pages can't list
 * directories, so data/manifest.json is the single source of truth for
 * "which years and exams exist". Adding a new exam = drop a JSON file in
 * /data/<year>/ and add one entry to manifest.json. No app-logic changes.
 */
const Data = (() => {
  let manifestCache = null;

  async function getManifest() {
    if (manifestCache) return manifestCache;
    const res = await fetch(CONFIG.manifestPath, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load manifest.json");
    manifestCache = await res.json();
    return manifestCache;
  }

  // Exam years that contain at least one exam for the given academic year.
  async function getExamYears(academicYear) {
    const manifest = await getManifest();
    return Object.keys(manifest.years)
      .filter(year => manifest.years[year].exams.some(ex => ex.academicYear === academicYear))
      .sort((a, b) => b - a);
  }

  // Exams available for a given academic year + exam year.
  async function getExams(academicYear, examYear) {
    const manifest = await getManifest();
    const yearBlock = manifest.years[examYear];
    if (!yearBlock) return [];
    return yearBlock.exams.filter(ex => ex.academicYear === academicYear);
  }

  async function loadExamFile(examYear, fileName) {
    const path = `data/${examYear}/${fileName}`;
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`Could not load ${path}`);
    return res.json();
  }

  function findStudent(exam, registration) {
    const reg = String(registration).trim();
    return exam.students.find(s => String(s.registration).trim() === reg);
  }

  return { getManifest, getExamYears, getExams, loadExamFile, findStudent };
})();

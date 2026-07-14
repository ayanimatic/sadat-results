/**
 * config.js
 * Central place to configure branding + grading rules.
 * Nothing else in the app should hard-code these values.
 */
const CONFIG = {
  universityName: "Govt. Saadat College, Tangail",
  departmentName: "Department of Mathematics",
  departmentSub: "Honours Programme",
  manifestPath: "data/manifest.json",

  // Fixed academic year options shown on the homepage.
  academicYears: [
    "Honours 2nd Year"
  ],

  // Grading scale used to convert marks -> grade + grade point.
  // Edit this table to match your institution's scale.
  gradingScale: [
    { min: 80, grade: "A+", point: 4.00 },
    { min: 75, grade: "A",  point: 3.75 },
    { min: 70, grade: "A-", point: 3.50 },
    { min: 65, grade: "B+", point: 3.25 },
    { min: 60, grade: "B",  point: 3.00 },
    { min: 55, grade: "B-", point: 2.75 },
    { min: 50, grade: "C+", point: 2.50 },
    { min: 45, grade: "C",  point: 2.25 },
    { min: 40, grade: "D",  point: 2.00 },
    { min: 0,  grade: "F",  point: 0.00 }
  ],

  // An exam is treated as a "Test Examination" (SGPA calculated) if its
  // examName contains any of these words, case-insensitive. Anything else
  // (e.g. "Incourse") is treated as non-SGPA.
  sgpaExamKeywords: ["test"]
};

HOW TO ADD NEW EXAM RESULTS

There are two files to touch. No code changes needed.

1. Create the exam JSON file
2. Add it to data/manifest.json


STEP 1 - CREATE THE EXAM JSON FILE

Location: data/<year>/<exam-id>.json
Example: data/2026/incourse-3.json

If the year folder doesn't exist yet, create it.

Easiest way to start: copy an existing file from data/2026/ (like incourse-1.json)
and edit it. Don't copy data/sample.json for real use - that file is just there
as a reference, it's not linked into the app.

Here is the shape of the file:

{
  "examName": "Incourse Examination 3",
  "examYear": 2026,
  "academicYear": "Honours 2nd Year",
  "subjects": [
    { "code": "221201", "name": "Real Analysis", "credit": 4 },
    { "code": "221206", "name": "Numerical Methods Lab", "credit": 2 }
  ],
  "students": [
    {
      "registration": "2023123456",
      "name": "Ayaan Ahmed",
      "marks": { "221201": 88, "221206": 54 }
    },
    {
      "registration": "2023123457",
      "name": "Nusrat Jahan",
      "marks": { "221201": 76, "221206": 60 }
    }
  ]
}

What each field means:

examName - the title shown on the results page, e.g. "Incourse Examination 3"

examYear - the year, must match the folder this file is in (2026 if it's in data/2026/)

academicYear - groups exams together, e.g. "Honours 2nd Year". Must be spelled
exactly the same across every exam you want grouped together.

subjects - one entry per subject
  code - a unique subject code, used as the key to look up marks below, must match exactly
  name - subject name shown on the results table
  credit - credit hours, used for SGPA calculation

students - one entry per student
  registration - the number a student searches with, must be unique
  name - student's full name
  marks - an object of "subjectCode": marks. Any subject left out defaults to 0.

Note on SGPA: SGPA is only calculated automatically if examName contains the word
"test" (see sgpaExamKeywords in assets/js/config.js). Anything else, like "Incourse
Examination", shows "SGPA Not Available" instead. This is intentional.

Note on privacy: only include students whose results should be publicly searchable
by registration number. The lookup happens in the browser, so anyone with the file
can see everything in it.


STEP 2 - ADD IT TO data/manifest.json

Open data/manifest.json. Find the year block matching your exam's year (or add a
new one if it's a new year), and add one entry inside its "exams" list:

{
  "id": "incourse-3",
  "file": "incourse-3.json",
  "examName": "Incourse Examination 3",
  "academicYear": "Honours 2nd Year",
  "type": "incourse"
}

What each field means:

id - a short unique name for this exam, e.g. "incourse-3"
file - the exact filename from step 1, e.g. "incourse-3.json"
examName - should match examName inside the JSON file
academicYear - should match academicYear inside the JSON file
type - either "test" or "incourse", used to group exams on the homepage

If it's a brand new year (say 2027), the manifest needs a new top-level block:

{
  "years": {
    "2026": { "exams": [ ...existing 2026 exams... ] },
    "2027": {
      "exams": [
        {
          "id": "incourse-1",
          "file": "incourse-1.json",
          "examName": "Incourse Examination 1",
          "academicYear": "Honours 3rd Year",
          "type": "incourse"
        }
      ]
    }
  }
}


STEP 3 - DOUBLE CHECK

- Is the JSON file valid? Paste it into jsonlint.com if unsure - no missing commas,
  all brackets closed.
- Does "file" in the manifest entry match the filename exactly, including .json?
- Does every subject code used in "marks" match a code listed in "subjects"?
- Is "academicYear" spelled identically in the file and the manifest entry?
- If testing locally, hard-refresh the page after saving. The site fetches fresh
  data every time (no caching), but a hard refresh rules out any browser caching.

That's it. No HTML, CSS, or JS needs to change for a new exam. Push to GitHub and
it's live.

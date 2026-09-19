# Question Import Format Specification

This document provides guidelines for administrators to prepare and upload question sets into the **NORCET Mock Test Platform ("Next Level Nursing")**.

---

## 1. Supported File Formats

- **JSON** (`.json`) — Recommended for full fidelity, multiline text, and special symbols.
- **CSV** (`.csv`) — Supported for standard spreadsheet imports (Excel / Google Sheets).

---

## 2. JSON Format Specification

The upload file should be a JSON array of question objects:

```json
[
  {
    "id": "q001",
    "question": "Which of the following is NOT a major criterion according to the Jones Criteria for diagnosing Acute Rheumatic Fever?",
    "options": [
      "Migratory polyarthritis",
      "Erythema marginatum",
      "Sydenham chorea",
      "Polyarthralgia"
    ],
    "correctAnswer": 3,
    "explanation": "The major Jones Criteria include Carditis, Polyarthritis, Chorea, Erythema marginatum, and Subcutaneous nodules (mnemonic: J♥NES). Polyarthralgia is strictly a minor criterion.",
    "subject": "Child Health Nursing (Pediatrics)",
    "topic": "Cardiovascular Disorders",
    "difficulty": "Hard",
    "tags": ["NORCET", "Cardiology", "High-Yield"]
  }
]
```

### Field Definitions

| Field Name | Type | Required? | Description / Valid Values |
| :--- | :--- | :--- | :--- |
| `id` / `questionId` | String | Optional | Unique identifier (e.g. `"q001"`). Auto-generated if omitted. |
| `question` | String | **Required** | The full text of the question (markdown and linebreaks supported). |
| `options` | Array[String] | **Required** | Must contain **exactly 4 options** in order (Option A, B, C, D). |
| `correctAnswer` | Number or String | **Required** | The zero-based index (`0`, `1`, `2`, `3`) **OR** letter (`"A"`, `"B"`, `"C"`, `"D"` / `"0"`, `"1"`, `"2"`, `"3"`). |
| `explanation` / `rationale` | String | **Required** | Detailed explanation/rationale displayed in results and practice mode. |
| `subject` | String | Optional | Default: `"Medical Surgical Nursing"`. Options: `"Obstetrics & Gynaecological Nursing"`, `"Child Health Nursing (Pediatrics)"`, `"Mental Health Nursing (Psychiatry)"`, `"Community Health Nursing"`, `"Pharmacology in Nursing"`, `"Nursing Foundations"`, etc. |
| `topic` | String | Optional | Specific sub-topic (e.g., `"Maternal Health"`, `"Critical Care"`). |
| `difficulty` | String | Optional | `"Easy"`, `"Medium"`, `"Hard"`. Default: `"Medium"`. |
| `tags` | Array[String] | Optional | Keywords for filtering. |

---

## 3. CSV Format Specification

When uploading a CSV file, the first row must contain column headers:

```csv
question,optionA,optionB,optionC,optionD,correctAnswer,explanation,subject,topic,difficulty
"Which cranial nerve is assessed by the corneal reflex?","CN III (Oculomotor)","CN V (Trigeminal)","CN VII (Facial)","CN IX (Glossopharyngeal)","B","Sensory limb is mediated by CN V (Trigeminal V1), motor blink limb is mediated by CN VII.","Medical Surgical Nursing","Neurology","Medium"
```

- `correctAnswer` in CSV can be specified as `A`, `B`, `C`, `D` or `0`, `1`, `2`, `3`.
- Any commas or quotation marks inside question text or rationales must be properly escaped inside double quotes (`"..."`).

---

## 4. Validation Rules & Common Errors

Before importing, the platform verifies each item:

1. **Missing Question Text**:
   - Error: `Q[#]: Question text is required.`
2. **Incorrect Option Count**:
   - Error: `Q[#]: Exactly 4 options (A, B, C, D) are required.`
3. **Invalid Correct Answer**:
   - Error: `Q[#]: correctAnswer must be 0-3 or A-D.`
4. **Missing Explanation**:
   - Warning/Error: `Q[#]: Explanation is missing.`

The Admin Upload Preview highlights all errors, displays the count of valid vs invalid questions, and allows you to either fix the file or import only valid questions.

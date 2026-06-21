# ¶ Lorem Ipsum Generator

A clean, dark-themed placeholder text generator built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies — just open `index.html` in your browser.

---

## 📁 Folder Structure

```
lorem-ipsum-generator/
├── index.html          ← App entry point
├── css/
│   └── style.css       ← All styling (variables, layout, animations)
├── js/
│   └── app.js          ← Text generation logic + DOM interactions
├── assets/             ← Reserved for future icons / images
└── README.md           ← You're reading this
```

---

## ✨ Features

| Feature | Description |
|---|---|
| **Paragraph Count** | Slide to choose 1–10 paragraphs |
| **Words per Paragraph** | Slide to set 20–150 words per block |
| **"Lorem ipsum" Opener** | Toggle the classic opening sentence on/off |
| **HTML Tags** | Toggle `<p>…</p>` wrapping for direct paste into HTML |
| **Copy** | Copies all text to clipboard in one click |
| **Download** | Saves output as `lorem-ipsum.txt` |
| **Live Stats** | Shows word count, character count, and paragraph count in real time |
| **Keyboard Shortcut** | `Ctrl + Enter` / `⌘ + Enter` generates new text instantly |

---

## 🚀 How to Run

1. Download or clone this folder.
2. Open `index.html` in any modern browser — no server needed.


## 🎨 Design Tokens (CSS Variables)

All colours, fonts, and radii are defined in `css/style.css` under `:root`.

| Variable | Value | Role |
|---|---|---|
| `--bg` | `#0B0B14` | Page background |
| `--accent` | `#6B42F0` | Primary violet |
| `--accent-text` | `#A08DFF` | Muted violet for text |
| `--font-display` | Playfair Display | Logo / headings |
| `--font-ui` | Inter | Controls / labels |
| `--font-mono` | Courier Prime | Generated text output |

---

## 🧩 Word Bank

`js/app.js` contains a curated array of classical Latin-derived words (`WORDS[]`). You can extend or replace this array to customise the generated vocabulary.

---

## 🛠 Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled.

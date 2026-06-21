/* ══ Word Bank ═══════════════════════════════════════════════ */
const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit',
  'sed','eiusmod','tempor','incididunt','labore','dolore','magna','aliqua',
  'enim','minim','veniam','quis','nostrud','exercitation','ullamco','laboris',
  'nisi','aliquip','commodo','consequat','duis','aute','irure','reprehenderit',
  'voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur',
  'sint','occaecat','cupidatat','non','proident','culpa','officia','deserunt',
  'mollit','anim','laborum','perspiciatis','unde','omnis','iste','natus',
  'error','voluptatem','accusantium','doloremque','laudantium','totam','rem',
  'aperiam','eaque','ipsa','inventore','veritatis','quasi','architecto','beatae',
  'vitae','dicta','explicabo','aspernatur','odit','fugit','quia','consequuntur',
  'magni','dolores','ratione','sequi','nesciunt','neque','porro','quisquam',
  'adipisci','numquam','eius','modi','tempora','incidunt','magnam','quaerat',
  'corporis','suscipit','laboriosam','aliquid','autem','vel','eum','iure',
  'nihil','molestiae','illum','blanditiis','praesentium','voluptatum','deleniti',
  'atque','corrupti','quos','quas','excepturi','obcaecati','cupiditate',
  'provident','similique','temporibus','possimus','rerum','necessitatibus',
  'saepe','eveniet','repudiandae','recusandae','itaque','earum','hic','tenetur',
  'sapiente','delectus','reiciendis','voluptatibus','maiores','alias',
  'perferendis','doloribus','asperiores','repellat','minima','nostrum','ullam',
  'odio','dignissimos','ducimus','maxime','placeat','facere','assumenda',
  'repellendus','quibusdam','officiis','debitis','soluta','nobis','eligendi',
  'cumque','accusamus','laudantium','perspiciatis','mollitia','optio','nemo',
  'enim','ipsam','voluptas','fugit','architecto','beatae','inventore',
  'distinctio','veniam','impedit','quisquam','laboriosam','corporis'
];

const LOREM_OPENER =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
  'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

/* ══ Helpers ═════════════════════════════════════════════════ */

/** Returns a random integer between min and max (inclusive) */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Returns a random word from WORDS */
function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

/** Capitalises the first letter of a string */
function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Builds a single sentence with roughly `targetWords` words,
 * sprinkling commas at natural intervals.
 */
function buildSentence(targetWords) {
  const words = Array.from({ length: targetWords }, pickWord);

  // Add commas every 5–9 words (not at start or end)
  for (let i = rand(4, 6); i < words.length - 2; i += rand(5, 9)) {
    words[i] = words[i] + ',';
  }

  return cap(words.join(' ')) + '.';
}

/**
 * Builds a paragraph of approximately `targetWords` words.
 * @param {number}  targetWords  - Desired word count
 * @param {boolean} isFirst      - Whether this is the first paragraph
 * @param {boolean} startLorem   - Whether to begin with the classic opener
 */
function buildParagraph(targetWords, isFirst, startLorem) {
  // First paragraph + "Lorem ipsum" toggle → use classic opener
  if (isFirst && startLorem) {
    let text = LOREM_OPENER;
    let wordsFilled = LOREM_OPENER.split(' ').length;

    while (wordsFilled < targetWords) {
      const sentLen = rand(9, 20);
      text += ' ' + buildSentence(sentLen);
      wordsFilled += sentLen;
    }
    return text;
  }

  // Regular paragraph — stitch random sentences together
  let text = '';
  let wordsFilled = 0;

  while (wordsFilled < targetWords) {
    const sentLen = rand(9, 20);
    text += (text ? ' ' : '') + buildSentence(sentLen);
    wordsFilled += sentLen;
  }
  return text;
}

/* ══ State ═══════════════════════════════════════════════════ */

/** Holds the last-generated paragraphs as plain strings */
let generatedParagraphs = [];

/* ══ DOM References ══════════════════════════════════════════ */

const elRangeParas    = document.getElementById('range-paragraphs');
const elBadgeParas    = document.getElementById('badge-paragraphs');
const elRangeWords    = document.getElementById('range-words');
const elBadgeWords    = document.getElementById('badge-words');
const elOptLorem      = document.getElementById('opt-lorem');
const elOptHtml       = document.getElementById('opt-html');
const elBtnGenerate   = document.getElementById('btn-generate');
const elBtnCopy       = document.getElementById('btn-copy');
const elBtnDownload   = document.getElementById('btn-download');
const elOutputEmpty   = document.getElementById('output-empty');
const elOutputContent = document.getElementById('output-content');
const elStatWords     = document.getElementById('stat-words');
const elStatChars     = document.getElementById('stat-chars');
const elStatParas     = document.getElementById('stat-paras');
const elToast         = document.getElementById('toast');

/* ══ Range Sliders — Live Badge Updates ══════════════════════ */

elRangeParas.addEventListener('input', () => {
  elBadgeParas.textContent = elRangeParas.value;
});

elRangeWords.addEventListener('input', () => {
  elBadgeWords.textContent = elRangeWords.value;
});

/* ══ Core: Generate ══════════════════════════════════════════ */

/**
 * Generates text based on current control values and
 * renders it into the output area.
 */
function generate() {
  const paraCount   = parseInt(elRangeParas.value, 10);
  const wordsPerPara = parseInt(elRangeWords.value, 10);
  const useLorem    = elOptLorem.checked;
  const useHtml     = elOptHtml.checked;

  // Build paragraphs
  generatedParagraphs = Array.from({ length: paraCount }, (_, i) =>
    buildParagraph(wordsPerPara, i === 0, useLorem)
  );

  renderOutput(useHtml);
  updateStats();

  elBtnCopy.disabled     = false;
  elBtnDownload.disabled = false;
}

/* ══ Render ══════════════════════════════════════════════════ */

/**
 * Renders generated paragraphs into #output-content,
 * toggling empty state visibility.
 * @param {boolean} useHtml - If true, wraps each para in <p> tags for display
 */
function renderOutput(useHtml) {
  // Show content, hide empty state
  elOutputEmpty.style.display   = 'none';
  elOutputContent.hidden        = false;
  elOutputContent.innerHTML     = '';

  generatedParagraphs.forEach((para, i) => {
    // Wrapper block
    const block = document.createElement('div');
    block.className = 'para-block';
    block.style.animationDelay = `${i * 70}ms`;

    // Meta row: "¶ 01 ——————————"
    const meta = document.createElement('div');
    meta.className = 'para-meta';

    const idx = document.createElement('span');
    idx.className   = 'para-index';
    idx.textContent = `¶ ${String(i + 1).padStart(2, '0')}`;

    const line = document.createElement('div');
    line.className = 'para-line';

    meta.appendChild(idx);
    meta.appendChild(line);

    // Paragraph text
    const body = document.createElement('p');
    body.className = 'para-body';

    if (useHtml) {
      // Show the literal HTML tag text (users can copy it)
      body.textContent = `<p>${para}</p>`;
    } else {
      body.textContent = para;
    }

    block.appendChild(meta);
    block.appendChild(body);
    elOutputContent.appendChild(block);
  });
}

/* ══ Stats ═══════════════════════════════════════════════════ */

/** Calculates word/char/paragraph counts and updates the header */
function updateStats() {
  const fullText  = generatedParagraphs.join(' ');
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const charCount = fullText.length;

  elStatWords.textContent = wordCount.toLocaleString();
  elStatChars.textContent = charCount.toLocaleString();
  elStatParas.textContent = generatedParagraphs.length;
}

/* ══ Copy ════════════════════════════════════════════════════ */

function copyToClipboard() {
  if (!generatedParagraphs.length) return;

  const useHtml = elOptHtml.checked;
  const text = useHtml
    ? generatedParagraphs.map(p => `<p>${p}</p>`).join('\n\n')
    : generatedParagraphs.join('\n\n');

  navigator.clipboard.writeText(text)
    .then(() => showToast('✓  Copied to clipboard'))
    .catch(() => showToast('Copy failed — try again'));
}

/* ══ Download ════════════════════════════════════════════════ */

function downloadTxt() {
  if (!generatedParagraphs.length) return;

  const useHtml = elOptHtml.checked;
  const text = useHtml
    ? generatedParagraphs.map(p => `<p>${p}</p>`).join('\n\n')
    : generatedParagraphs.join('\n\n');

  const blob     = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url      = URL.createObjectURL(blob);
  const anchor   = document.createElement('a');
  anchor.href    = url;
  anchor.download = 'lorem-ipsum.txt';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  showToast('✓  Download started');
}

/* ══ Toast ═══════════════════════════════════════════════════ */

let toastTimer = null;

/**
 * Shows a brief toast notification.
 * @param {string} message - Text to display
 * @param {number} [duration=2400] - Visibility duration in ms
 */
function showToast(message, duration = 2400) {
  if (toastTimer) clearTimeout(toastTimer);
  elToast.textContent = message;
  elToast.classList.add('visible');
  toastTimer = setTimeout(() => elToast.classList.remove('visible'), duration);
}

/* ══ Event Listeners ════════════════════════════════════════ */

elBtnGenerate.addEventListener('click', generate);
elBtnCopy.addEventListener('click', copyToClipboard);
elBtnDownload.addEventListener('click', downloadTxt);

// Re-render in-place when HTML toggle changes (no full regeneration needed)
elOptHtml.addEventListener('change', () => {
  if (generatedParagraphs.length) renderOutput(elOptHtml.checked);
});

/* ══ Keyboard shortcut: Ctrl/Cmd + Enter → Generate ════════ */
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    generate();
  }
});

/* ══ Init ════════════════════════════════════════════════════ */
// Generate a default batch on first load so the tool feels alive immediately
generate();

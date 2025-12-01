/**
 * BibTeX to Bibitem Converter - JavaScript Implementation
 * Ported from the Python script for web usage
 */

// DOM Elements
const bibtexInput = document.getElementById('bibtex-input');
const bibitemOutput = document.getElementById('bibitem-output');
const fileUpload = document.getElementById('file-upload');
const convertBtn = document.getElementById('convert-btn');
const clearInputBtn = document.getElementById('clear-input');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const statusMessage = document.getElementById('status-message');

// Event Listeners
fileUpload.addEventListener('change', handleFileUpload);
convertBtn.addEventListener('click', handleConvert);
clearInputBtn.addEventListener('click', handleClear);
copyBtn.addEventListener('click', handleCopy);
downloadBtn.addEventListener('click', handleDownload);
bibtexInput.addEventListener('input', () => {
  if (bibtexInput.value.trim()) {
    convertBtn.disabled = false;
  } else {
    convertBtn.disabled = true;
  }
});

// Auto-convert on input (with debounce)
let convertTimeout;
bibtexInput.addEventListener('input', () => {
  clearTimeout(convertTimeout);
  convertTimeout = setTimeout(() => {
    if (bibtexInput.value.trim()) {
      handleConvert();
    }
  }, 500);
});

/**
 * Handle file upload
 */
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    bibtexInput.value = e.target.result;
    handleConvert();
  };
  reader.readAsText(file);
}

/**
 * Handle clear input
 */
function handleClear() {
  bibtexInput.value = '';
  bibitemOutput.value = '';
  copyBtn.disabled = true;
  downloadBtn.disabled = true;
  hideStatus();
}

/**
 * Handle conversion
 */
function handleConvert() {
  const bibtexText = bibtexInput.value.trim();

  if (!bibtexText) {
    showStatus('Please enter or upload BibTeX entries', 'error');
    return;
  }

  try {
    const entries = parseBibTeX(bibtexText);
    if (entries.length === 0) {
      showStatus('No valid BibTeX entries found', 'error');
      bibitemOutput.value = '';
      copyBtn.disabled = true;
      downloadBtn.disabled = true;
      return;
    }

    const bibitems = convertToBibitem(entries);
    bibitemOutput.value = bibitems.join('\n\n');

    // Enable output buttons
    copyBtn.disabled = false;
    downloadBtn.disabled = false;

    showStatus(`Successfully converted ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`, 'success');
  } catch (error) {
    showStatus(`Error: ${error.message}`, 'error');
    bibitemOutput.value = '';
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
  }
}

/**
 * Parse BibTeX text into entries
 */
function parseBibTeX(text) {
  const entries = [];
  const entryPattern = /@(\w+)\s*\{\s*([^,\s]+)\s*,\s*([\s\S]*?)\n\}/g;

  let match;
  while ((match = entryPattern.exec(text)) !== null) {
    const [, type, id, fieldsText] = match;
    const fields = parseFields(fieldsText);

    entries.push({
      type: type.toLowerCase(),
      id: id,
      ...fields
    });
  }

  return entries;
}

/**
 * Parse individual fields from BibTeX entry
 */
function parseFields(fieldsText) {
  const fields = {};
  const fieldPattern = /(\w+)\s*=\s*\{([^}]*)\}|(\w+)\s*=\s*"([^"]*)"/g;

  let match;
  while ((match = fieldPattern.exec(fieldsText)) !== null) {
    const fieldName = match[1] || match[3];
    const fieldValue = match[2] || match[4];
    fields[fieldName.toLowerCase()] = cleanLatexString(fieldValue);
  }

  return fields;
}

/**
 * Clean LaTeX special characters and formatting
 */
function cleanLatexString(str) {
  if (!str) return '';

  // Handle common LaTeX accents and special characters
  const replacements = {
    '{\\"a}': 'ä', '{\\"o}': 'ö', '{\\"u}': 'ü',
    '{\\"A}': 'Ä', '{\\"O}': 'Ö', '{\\"U}': 'Ü',
    "{\\'a}": 'á', "{\\'e}": 'é', "{\\'i}": 'í', "{\\'o}": 'ó', "{\\'u}": 'ú',
    "{\\'A}": 'Á', "{\\'E}": 'É', "{\\'I}": 'Í', "{\\'O}": 'Ó', "{\\'U}": 'Ú',
    '{\\`a}': 'à', '{\\`e}': 'è', '{\\`i}': 'ì', '{\\`o}': 'ò', '{\\`u}': 'ù',
    '{\\^a}': 'â', '{\\^e}': 'ê', '{\\^i}': 'î', '{\\^o}': 'ô', '{\\^u}': 'û',
    '{\\~a}': 'ã', '{\\~n}': 'ñ', '{\\~o}': 'õ',
    '{\\c{c}}': 'ç', '{\\c{C}}': 'Ç'
  };

  let result = str;
  for (const [latex, char] of Object.entries(replacements)) {
    result = result.replace(new RegExp(latex.replace(/[{}\\]/g, '\\$&'), 'g'), char);
  }

  // Remove curly braces used for grouping
  result = result.replace(/\{([^}]*)\}/g, '$1');

  return result.trim();
}

/**
 * Convert parsed entries to bibitem format
 */
function convertToBibitem(entries) {
  const bibitems = [];
  const seenIds = new Set();

  for (const entry of entries) {
    // Skip duplicates
    if (!entry.id || seenIds.has(entry.id)) {
      continue;
    }
    seenIds.add(entry.id);

    const authors = entry.author ? entry.author.replace(/ and /g, ', ') : 'Unknown author';
    const title = entry.title || 'No title';
    const journal = entry.journal || '';
    const booktitle = entry.booktitle || '';
    const volume = entry.volume || '';
    const number = entry.number || '';
    const pages = entry.pages || '';
    const year = entry.year || '';
    const publisher = entry.publisher || '';

    let bibitem = `\\bibitem{${entry.id}}\n`;
    bibitem += `${authors}.\n`;
    bibitem += `\\newblock ${title}.\n`;

    if (journal) {
      bibitem += `\\newblock \\emph{${journal}}`;
      if (volume || number || pages || year) {
        bibitem += ', ';
        if (volume) bibitem += `${volume}`;
        if (number) bibitem += `(${number})`;
        if (volume || number) bibitem += ':';
        if (pages) bibitem += `${pages}`;
        if (year) bibitem += `, ${year}`;
      }
      bibitem += '.';
    } else if (booktitle) {
      bibitem += `\\newblock In \\emph{${booktitle}}`;
      if (pages) bibitem += `, ${pages}`;
      if (year) bibitem += `, ${year}`;
      bibitem += '.';
    } else if (publisher) {
      bibitem += `\\newblock ${publisher}`;
      if (year) bibitem += `, ${year}`;
      bibitem += '.';
    }

    bibitems.push(bibitem);
  }

  return bibitems;
}

/**
 * Handle copy to clipboard
 */
async function handleCopy() {
  const text = bibitemOutput.value;

  try {
    await navigator.clipboard.writeText(text);
    showStatus('Copied to clipboard!', 'success');
  } catch (error) {
    // Fallback for older browsers
    bibitemOutput.select();
    document.execCommand('copy');
    showStatus('Copied to clipboard!', 'success');
  }
}

/**
 * Handle download as file
 */
function handleDownload() {
  const text = bibitemOutput.value;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'bibitems.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showStatus('Downloaded bibitems.txt', 'success');
}

/**
 * Show status message
 */
function showStatus(message, type = 'success') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type} show`;

  setTimeout(() => {
    hideStatus();
  }, 3000);
}

/**
 * Hide status message
 */
function hideStatus() {
  statusMessage.classList.remove('show');
}

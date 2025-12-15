/**
 * BibTeX to Bibitem Converter - JavaScript Implementation
 * Ported from the Python script for web usage
 */

// DOM Elements
const bibtexInput = document.getElementById('bibtex-input');
const bibitemOutput = document.getElementById('bibitem-output');
const inputInfo = document.getElementById('input-info');
const outputInfo = document.getElementById('output-info');
const fileUpload = document.getElementById('file-upload');
const convertBtn = document.getElementById('convert-btn');
const clearInputBtn = document.getElementById('clear-input');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');

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
  inputInfo.textContent = '';
  outputInfo.textContent = '';
  copyBtn.disabled = true;
  downloadBtn.disabled = true;
}

/**
 * Handle conversion
 */
function handleConvert() {
  const bibtexText = bibtexInput.value.trim();

  if (!bibtexText) {
    inputInfo.textContent = '';
    outputInfo.textContent = '';
    return;
  }

  try {
    const inputCount = countBibTeXEntries(bibtexText);
    inputInfo.textContent = `Total entries: ${inputCount}`;
    inputInfo.className = 'entry-info';

    const entries = parseBibTeX(bibtexText);

    if (entries.length === 0) {
      outputInfo.textContent = `Converted: 0 entries (${inputCount} failed)`;
      outputInfo.className = 'entry-info error';
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

    const failed = inputCount - entries.length;
    if (failed > 0) {
      outputInfo.textContent = `Converted: ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} (${failed} failed)`;
      outputInfo.className = 'entry-info error';
    } else {
      outputInfo.textContent = `Converted: ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`;
      outputInfo.className = 'entry-info success';
    }
  } catch (error) {
    outputInfo.textContent = `Error: ${error.message}`;
    outputInfo.className = 'entry-info error';
    bibitemOutput.value = '';
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
  }
}

/**
 * Count BibTeX entries in text
 */
function countBibTeXEntries(text) {
  const matches = text.match(/@\w+\s*\{/g);
  return matches ? matches.length : 0;
}

/**
 * Parse BibTeX text into entries
 * Uses brace counting for robust parsing of both compact and multi-line entries
 */
function parseBibTeX(text) {
  const entries = [];
  let i = 0;

  while (i < text.length) {
    // Find the start of an entry
    const atIndex = text.indexOf('@', i);
    if (atIndex === -1) break;

    // Extract entry type
    const typeMatch = text.slice(atIndex).match(/@(\w+)\s*\{/);
    if (!typeMatch) {
      i = atIndex + 1;
      continue;
    }

    const type = typeMatch[1];
    const braceStart = atIndex + typeMatch[0].length - 1; // Position of opening {

    // Find matching closing brace by counting
    let braceCount = 1;
    let pos = braceStart + 1;
    while (pos < text.length && braceCount > 0) {
      if (text[pos] === '{') braceCount++;
      else if (text[pos] === '}') braceCount--;
      pos++;
    }

    if (braceCount !== 0) {
      // Malformed entry, skip it
      i = atIndex + 1;
      continue;
    }

    // Extract the content between braces
    const content = text.slice(braceStart + 1, pos - 1);

    // Extract citation key (first item before comma)
    const commaIndex = content.indexOf(',');
    if (commaIndex === -1) {
      i = pos;
      continue;
    }

    const id = content.slice(0, commaIndex).trim();
    const fieldsText = content.slice(commaIndex + 1);

    // Parse fields
    const fields = parseFields(fieldsText);

    entries.push({
      type: type.toLowerCase(),
      id: id,
      ...fields
    });

    i = pos;
  }

  return entries;
}

/**
 * Parse individual fields from BibTeX entry
 * Handles both {value} and "value" formats
 */
function parseFields(fieldsText) {
  const fields = {};
  let i = 0;

  while (i < fieldsText.length) {
    // Skip whitespace and commas
    while (i < fieldsText.length && /[\s,]/.test(fieldsText[i])) {
      i++;
    }

    if (i >= fieldsText.length) break;

    // Extract field name
    const fieldNameMatch = fieldsText.slice(i).match(/^(\w+)\s*=/);
    if (!fieldNameMatch) break;

    const fieldName = fieldNameMatch[1];
    i += fieldNameMatch[0].length;

    // Skip whitespace after =
    while (i < fieldsText.length && /\s/.test(fieldsText[i])) {
      i++;
    }

    if (i >= fieldsText.length) break;

    let fieldValue = '';

    // Check if value is in quotes or braces
    if (fieldsText[i] === '{') {
      // Handle braced value
      let braceCount = 1;
      i++; // Skip opening brace
      const start = i;

      while (i < fieldsText.length && braceCount > 0) {
        if (fieldsText[i] === '{') braceCount++;
        else if (fieldsText[i] === '}') braceCount--;
        if (braceCount > 0) i++;
      }

      fieldValue = fieldsText.slice(start, i);
      i++; // Skip closing brace

    } else if (fieldsText[i] === '"') {
      // Handle quoted value
      i++; // Skip opening quote
      const start = i;

      while (i < fieldsText.length && fieldsText[i] !== '"') {
        i++;
      }

      fieldValue = fieldsText.slice(start, i);
      i++; // Skip closing quote

    } else {
      // Handle unquoted value (numbers, etc.)
      const start = i;
      while (i < fieldsText.length && !/[,}]/.test(fieldsText[i])) {
        i++;
      }
      fieldValue = fieldsText.slice(start, i).trim();
    }

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
      bibitem += `\\newblock ${journal}`;
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
      bibitem += `\\newblock In ${booktitle}`;
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
    outputInfo.textContent = outputInfo.textContent + ' | Copied!';
    setTimeout(() => {
      handleConvert(); // Reset the message
    }, 2000);
  } catch (error) {
    // Fallback for older browsers
    bibitemOutput.select();
    document.execCommand('copy');
    outputInfo.textContent = outputInfo.textContent + ' | Copied!';
    setTimeout(() => {
      handleConvert();
    }, 2000);
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

  outputInfo.textContent = outputInfo.textContent + ' | Downloaded!';
  setTimeout(() => {
    handleConvert();
  }, 2000);
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

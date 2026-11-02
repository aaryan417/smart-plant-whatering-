// src/utils/speechPreprocessor.js
/**
 * Text-to-Speech Preprocessing Utility for Farmer AI Assistant
 * 
 * Converts structured Markdown, lists, symbols, and agricultural indicators
 * into clean, natural spoken sentences for Web Speech API (hi-IN and en-IN).
 * 
 * Preserves all meaningful farm telemetry, scientific reasoning, and safety warnings.
 * Strips UI artifacts, markdown markers, and decorative emojis.
 */

/**
 * Preprocess bot response text for speech synthesis.
 * @param {string} rawText - Markdown text from bot message
 * @param {string} disclaimer - Optional safety disclaimer text
 * @param {string} lang - 'hi' | 'en'
 * @returns {string} Clean, natural speech string
 */
export function preprocessTextForSpeech(rawText = '', disclaimer = '', lang = 'hi') {
  if (!rawText && !disclaimer) return '';

  let fullContent = rawText || '';
  if (disclaimer) {
    fullContent += `\n\n${disclaimer}`;
  }

  const isHindi = lang === 'hi' || /[\u0900-\u097F]/.test(fullContent);

  let text = fullContent;

  // 1. Remove SVG placeholders, HTML tags, comments, and UI artifacts
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
  text = text.replace(/<!--[\s\S]*?-->/g, ' ');
  text = text.replace(/<[^>]*>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');

  // Remove internal UI badges such as DEMO / (डेमो)
  text = text.replace(/\((?:डेमो|demo)\)/gi, '');
  text = text.replace(/\bDEMO\b/g, '');

  // 2. Specific percentage comparisons (e.g. >=60%, <=30%)
  if (isHindi) {
    text = text.replace(/(?:>=|≥)\s*(\d+)\s*%/g, '$1 प्रतिशत या उससे अधिक');
    text = text.replace(/(?:<=|≤)\s*(\d+)\s*%/g, '$1 प्रतिशत या उससे कम');
    text = text.replace(/>\s*(\d+)\s*%/g, '$1 प्रतिशत से अधिक');
    text = text.replace(/<\s*(\d+)\s*%/g, '$1 प्रतिशत से कम');

    // General symbol replacements
    text = text.replace(/(?:>=|≥)\s*(\d+)/g, '$1 या उससे अधिक');
    text = text.replace(/(?:<=|≤)\s*(\d+)/g, '$1 या उससे कम');
    text = text.replace(/>\s*(\d+)/g, '$1 से अधिक');
    text = text.replace(/<\s*(\d+)/g, '$1 से कम');

    text = text.replace(/(\d+)\s*%/g, '$1 प्रतिशत');
    text = text.replace(/%/g, ' प्रतिशत ');

    // Metric units
    text = text.replace(/(\d+)\s*मिमी/g, '$1 मिलीमीटर');
    text = text.replace(/(\d+)\s*mm/gi, '$1 मिलीमीटर');
    text = text.replace(/(\d+)\s*km\/h/gi, '$1 किलोमीटर प्रति घंटा');

    // Irrigation decisions in Hindi context
    text = text.replace(/\bWATER\b/g, 'पानी दें');
    text = text.replace(/\bSKIP\b/g, 'पानी न दें');
    text = text.replace(/\bDELAY\b/g, 'प्रतीक्षा करें');
    text = text.replace(/\bMONITOR\b/g, 'निगरानी रखें');
  } else {
    // English expansions
    text = text.replace(/(?:>=|≥)\s*(\d+)\s*%/g, '$1 percent or more');
    text = text.replace(/(?:<=|≤)\s*(\d+)\s*%/g, '$1 percent or less');
    text = text.replace(/>\s*(\d+)\s*%/g, 'more than $1 percent');
    text = text.replace(/<\s*(\d+)\s*%/g, 'less than $1 percent');

    text = text.replace(/(?:>=|≥)\s*(\d+)/g, '$1 or more');
    text = text.replace(/(?:<=|≤)\s*(\d+)/g, '$1 or less');
    text = text.replace(/>\s*(\d+)/g, 'more than $1');
    text = text.replace(/<\s*(\d+)/g, 'less than $1');

    text = text.replace(/(\d+)\s*%/g, '$1 percent');
    text = text.replace(/%/g, ' percent ');
    text = text.replace(/(\d+)\s*mm/gi, '$1 millimeters');
    text = text.replace(/(\d+)\s*km\/h/gi, '$1 kilometers per hour');
  }

  // 3. Handle warning symbols: avoid duplicate "चेतावनी: कृषि सुरक्षा चेतावनी:"
  if (isHindi) {
    text = text.replace(/⚠️\s*(?:कृषि\s*सुरक्षा\s*चेतावनी\s*:\s*)?/g, 'कृषि सुरक्षा चेतावनी: ');
  } else {
    text = text.replace(/⚠️\s*(?:Agronomic\s*Safety\s*Notice\s*:\s*)?/gi, 'Agronomic Safety Notice: ');
  }

  // 4. Clean Markdown Bold, Italics, Code, and Headers
  text = text.replace(/#{1,6}\s+/g, ''); // Headers
  text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // **bold**
  text = text.replace(/\*(.*?)\*/g, '$1'); // *italic*
  text = text.replace(/__(.*?)__/g, '$1'); // __bold__
  text = text.replace(/_(.*?)_/g, '$1'); // _italic_
  text = text.replace(/`([^`]+)`/g, '$1'); // inline `code`
  text = text.replace(/```[\s\S]*?```/g, ''); // code blocks

  // 5. Convert bullet points and list indicators into natural spoken flow
  // Bullet points
  text = text.replace(/^\s*[•\-\*]\s+/gm, isHindi ? 'बिंदु: ' : 'Point: ');
  text = text.replace(/(\n\s*[•\-\*]\s+)/g, isHindi ? '। बिंदु: ' : '. Point: ');

  // Numbered lists: 1. Item -> 1: Item
  text = text.replace(/^\s*(\d+)\.\s+/gm, '$1: ');
  text = text.replace(/(\n\s*(\d+)\.\s+)/g, isHindi ? '। $2: ' : '. $2: ');

  // 6. Remove decorative symbols and unwanted emojis while keeping letters and numbers
  text = text.replace(/[🙏✨🌱🌧️💧⏱️📊🔍👍🚜🌾🌿❌✅🛑📌]/gu, '');

  // 7. Clean multiple newlines and spaces
  text = text.replace(/\n+/g, isHindi ? '। ' : '. ');
  text = text.replace(/\s{2,}/g, ' ');
  text = text.replace(/([।\.\?!])\s*([।\.\?!])+/g, '$1'); // avoid duplicate punctuation
  text = text.trim();

  // Ensure ends with punctuation
  if (text && !/[।\.\?!]$/.test(text)) {
    text += isHindi ? '।' : '.';
  }

  return text;
}

/**
 * Split text into sentence-based chunks to prevent browser SpeechSynthesis
 * audio cut-offs (the ~15-second Chromium SpeechSynthesis timeout issue).
 * @param {string} text - Clean preprocessed speech text
 * @param {number} maxChunkLen - Max characters per chunk (default ~180)
 * @returns {string[]} Array of spoken sentence chunks
 */
export function chunkSpeechText(text, maxChunkLen = 180) {
  if (!text) return [];
  if (text.length <= maxChunkLen) return [text];

  // Split on sentence terminators: ।, ., ?, ! or newlines
  const regex = /([^।\.\?!]+[।\.\?!]+)/g;
  const rawSentences = text.match(regex) || [text];

  const chunks = [];
  let currentChunk = '';

  for (const sentence of rawSentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if ((currentChunk + ' ' + trimmed).trim().length <= maxChunkLen) {
      currentChunk = (currentChunk + ' ' + trimmed).trim();
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (trimmed.length > maxChunkLen) {
        // If single sentence is unusually long, split by comma or spaces
        const subParts = trimmed.split(/([,;:]\s*)/);
        let subChunk = '';
        for (const sub of subParts) {
          if ((subChunk + sub).length <= maxChunkLen) {
            subChunk += sub;
          } else {
            if (subChunk.trim()) chunks.push(subChunk.trim());
            subChunk = sub;
          }
        }
        if (subChunk.trim()) currentChunk = subChunk.trim();
        else currentChunk = '';
      } else {
        currentChunk = trimmed;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

#!/usr/bin/env node
/**
 * Anagram Solver - Find all anagrams of a word
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORDS_FILE = 'words.txt';

function sortLetters(word) {
  return word.toLowerCase().split('').sort().join('');
}

function buildDictionary() {
  const words = fs.readFileSync(WORDS_FILE, 'utf-8')
    .split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length > 1);
  
  const dict = new Map();
  for (const word of words) {
    const sig = sortLetters(word);
    if (!dict.has(sig)) dict.set(sig, []);
    dict.get(sig).push(word);
  }
  return dict;
}

function findAnagrams(input, dict) {
  const sig = sortLetters(input);
  return (dict.get(sig) || []).filter(w => w !== input.toLowerCase());
}

const word = process.argv[2];

if (!word) {
  console.log('Usage: node anagram.js <word>');
  console.log('Example: node anagram.js listen');
  process.exit(1);
}

const dict = buildDictionary();
const results = findAnagrams(word, dict);

console.log(`\nAnagrams of "${word}":\n`);

if (results.length === 0) {
  console.log('None found.\n');
} else {
  const byLength = {};
  results.forEach(w => {
    if (!byLength[w.length]) byLength[w.length] = [];
    byLength[w.length].push(w);
  });
  
  Object.keys(byLength).sort((a,b) => a-b).forEach(len => {
    console.log(`  ${len}-letter: ${byLength[len].join(', ')}`);
  });
  console.log(`\nTotal: ${results.length}\n`);
}

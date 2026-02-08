#!/usr/bin/env node
/**
 * Crossword Clue Matcher
 * Find words matching crossword-style clues and patterns
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORDS_FILE = 'words.txt';

// Load word list
function loadWords() {
  return fs.readFileSync(WORDS_FILE, 'utf-8')
    .split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
}

// Find words by length
function byLength(words, length) {
  return words.filter(w => w.length === length);
}

// Find words matching a pattern (dots = unknown letters)
function matchPattern(words, pattern) {
  const regex = new RegExp('^' + pattern.replace(/\./g, '.') + '$');
  return words.filter(w => regex.test(w));
}

// Find words starting with prefix
function startsWith(words, prefix) {
  return words.filter(w => w.startsWith(prefix));
}

// Find words ending with suffix
function endsWith(words, suffix) {
  return words.filter(w => w.endsWith(suffix));
}

// Find words containing substring
function contains(words, substring) {
  return words.filter(w => w.includes(substring));
}

// Find words with letter at position
function letterAt(words, letter, position) {
  return words.filter(w => w[position] === letter);
}

// Find anagrams of letters
function anagramsOf(words, letters) {
  const sig = letters.toLowerCase().split('').sort().join('');
  return words.filter(w => {
    const wSig = w.split('').sort().join('');
    return wSig === sig;
  });
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

const words = loadWords();

if (command === 'length') {
  const length = parseInt(args[1]);
  if (!length) {
    console.log('Usage: crossword.js length <number>');
    process.exit(1);
  }
  const results = byLength(words, length);
  console.log(`\n${length}-letter words (${results.length}):`);
  console.log(results.slice(0, 50).join(', '));
  if (results.length > 50) console.log(`... and ${results.length - 50} more`);
  
} else if (command === 'pattern') {
  const pattern = args[1];
  if (!pattern) {
    console.log('Usage: crossword.js pattern <pattern>');
    process.exit(1);
  }
  const results = matchPattern(words, pattern);
  console.log(`\nWords matching "${pattern}" (${results.length}):`);
  if (results.length === 0) {
    console.log('No matches found');
  } else if (results.length > 30) {
    console.log(results.slice(0, 30).join(', '));
    console.log(`... and ${results.length - 30} more`);
  } else {
    console.log(results.join(', '));
  }
  
} else if (command === 'contains') {
  const substring = args[1];
  if (!substring) {
    console.log('Usage: crossword.js contains <letters>');
    process.exit(1);
  }
  const results = contains(words, substring.toLowerCase());
  console.log(`\nWords containing "${substring}" (${results.length}):`);
  console.log(results.slice(0, 30).join(', '));
  if (results.length > 30) console.log(`... and ${results.length - 30} more`);
  
} else if (command === 'starts') {
  const prefix = args[1];
  if (!prefix) {
    console.log('Usage: crossword.js starts <prefix>');
    process.exit(1);
  }
  const results = startsWith(words, prefix.toLowerCase());
  console.log(`\nWords starting with "${prefix}" (${results.length}):`);
  console.log(results.slice(0, 30).join(', '));
  if (results.length > 30) console.log(`... and ${results.length - 30} more`);
  
} else if (command === 'ends') {
  const suffix = args[1];
  if (!suffix) {
    console.log('Usage: crossword.js ends <suffix>');
    process.exit(1);
  }
  const results = endsWith(words, suffix.toLowerCase());
  console.log(`\nWords ending with "${suffix}" (${results.length}):`);
  console.log(results.slice(0, 30).join(', '));
  if (results.length > 30) console.log(`... and ${results.length - 30} more`);
  
} else if (command === 'anagram') {
  const letters = args[1];
  if (!letters) {
    console.log('Usage: crossword.js anagram <letters>');
    process.exit(1);
  }
  const results = anagramsOf(words, letters);
  console.log(`\nAnagrams of "${letters}" (${results.length}):`);
  console.log(results.join(', '));
  
} else if (command === 'letter') {
  const letter = args[1];
  const pos = parseInt(args[2]);
  if (!letter || isNaN(pos)) {
    console.log('Usage: crossword.js letter <letter> <position>');
    process.exit(1);
  }
  const results = letterAt(words, letter.toLowerCase(), pos);
  console.log(`\nWords with "${letter}" at position ${pos} (${results.length}):`);
  console.log(results.slice(0, 30).join(', '));
  if (results.length > 30) console.log(`... and ${results.length - 30} more`);
  
} else {
  console.log(`
Crossword Clue Matcher

Commands:
  length <n>          Words with exactly n letters
  pattern <p>         Words matching pattern (dots = unknown)
  contains <letters>   Words containing substring
  starts <prefix>      Words starting with prefix
  ends <suffix>       Words ending with suffix
  anagram <letters>   Anagrams of letters
  letter <c> <pos>    Words with letter at position

Examples:
  crossword.js length 5
  crossword.js pattern s..e..
  crossword.js contains tion
  crossword.js starts un
  crossword.js ends ing
  crossword.js anagram silent
  crossword.js letter s 3
`);
}

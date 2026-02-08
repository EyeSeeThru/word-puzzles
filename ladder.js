#!/usr/bin/env node
/**
 * Word Ladder - Find shortest path between words
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORDS_FILE = 'words.txt';

function buildWordSet() {
  return new Set(fs.readFileSync(WORDS_FILE, 'utf-8')
    .split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length > 1));
}

function neighbors(word, wordSet) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const results = [];
  
  for (let i = 0; i < word.length; i++) {
    for (const c of chars) {
      if (c === word[i]) continue;
      const candidate = word.slice(0, i) + c + word.slice(i + 1);
      if (wordSet.has(candidate) && candidate !== word) {
        results.push(candidate);
      }
    }
  }
  return results;
}

function findPath(start, end, wordSet) {
  if (start.length !== end.length) return null;
  
  const queue = [[start]];
  const visited = new Set([start]);
  const maxDepth = 6;
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (current === end) return path;
    if (path.length >= maxDepth) continue;
    
    for (const n of neighbors(current, wordSet)) {
      if (!visited.has(n)) {
        visited.add(n);
        queue.push([...path, n]);
      }
    }
  }
  return null;
}

const start = process.argv[2];
const end = process.argv[3];

if (!start || !end) {
  console.log('Usage: node ladder.js <start-word> <end-word>');
  console.log('Example: node ladder.js love hate');
  process.exit(1);
}

const wordSet = buildWordSet();
const path = findPath(start.toLowerCase(), end.toLowerCase(), wordSet);

console.log(`\nWord Ladder: "${start}" → "${end}"\n`);

if (path) {
  console.log('  ' + path.join(' → '));
  console.log(`\nSteps: ${path.length - 1}\n`);
} else {
  console.log('No path found within 6 steps.\n');
}

#!/usr/bin/env node
/**
 * Word Search Puzzle Generator
 * Generate crossword-style puzzles from word lists
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORDS_FILE = 'words.txt';

// Load words from file
function loadWords(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8')
      .split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
  }
  return null;
}

// Create empty grid
function createGrid(size) {
  return Array(size).fill(null).map(() => Array(size).fill(''));
}

// Place word in grid
function placeWord(grid, word, size) {
  const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
  
  for (let i = directions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [directions[i], directions[j]] = [directions[j], directions[i]];
  }
  
  for (const [dx, dy] of directions) {
    const positions = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const nx = x + dx * i;
          const ny = y + dy * i;
          if (nx < 0 || nx >= size || ny < 0 || ny >= size) {
            canPlace = false;
            break;
          }
          const cell = grid[nx][ny];
          if (cell !== '' && cell !== word[i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) positions.push([x, y]);
      }
    }
    
    if (positions.length > 0) {
      const [x, y] = positions[Math.floor(Math.random() * positions.length)];
      for (let i = 0; i < word.length; i++) {
        grid[x + dx * i][y + dy * i] = word[i];
      }
      return true;
    }
  }
  return false;
}

// Fill empty cells
function fillGrid(grid, letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

// Generate puzzle
function generate(words, size = 15) {
  const grid = createGrid(size);
  const placed = [];
  const failed = [];
  const sorted = [...words].sort((a, b) => b.length - a.length);
  
  for (const word of sorted) {
    if (placeWord(grid, word, size)) {
      placed.push(word);
    } else {
      failed.push(word);
    }
  }
  
  fillGrid(grid);
  return { grid, placed, failed, size };
}

// Format grid
function formatGrid(grid) {
  let output = '\n   ' + grid[0].map((_, i) => String.fromCharCode(65 + i)).join(' ') + '\n';
  output += '  +' + '---+'.repeat(grid.length) + '\n';
  for (let i = 0; i < grid.length; i++) {
    output += String.fromCharCode(65 + i) + ' | ';
    output += grid[i].map(c => c + '  ').join('') + '\n';
  }
  return output;
}

// CLI
const args = process.argv.slice(2);
let words = [];
let size = 15;
let outputFile = null;
let showSolution = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--size' || arg === '-s') {
    size = parseInt(args[++i]) || 15;
  } else if (arg === '--file' || arg === '-f') {
    const fileWords = loadWords(args[++i]);
    if (fileWords) words = fileWords;
  } else if (arg === '--output' || arg === '-o') {
    outputFile = args[++i];
  } else if (arg === '--solution' || arg === '-a') {
    showSolution = true;
  } else if (!arg.startsWith('--')) {
    words.push(arg.toUpperCase());
  }
}

if (words.length === 0) {
  console.log(`
Word Search Puzzle Generator

Usage: wordsearch.js <words...> [options]
       wordsearch.js --file <wordlist.txt> [options]

Options:
  --size, -s <n>      Grid size (default: 15x15)
  --file, -f <file>   Read words from file
  --output, -o <file>  Save puzzle to file
  --solution, -a       Show answer key

Examples:
  wordsearch.js APPLE BANANA CHERRY --size 12
  wordsearch.js --file words.txt --output puzzle.txt
  wordsearch.js HELLO WORLD PYTHON --solution
`);
  process.exit(1);
}

const { grid, placed, failed, size: gridSize } = generate(words, size);

let output = '\n═══════════════════════════════════════\n';
output += '        WORD SEARCH PUZZLE\n';
output += '═══════════════════════════════════════\n';

if (failed.length > 0) {
  output += '\nCould not place: ' + failed.join(', ') + '\n';
}

output += formatGrid(grid);
output += '\n───────────────────────────────────────\n';
output += 'WORDS TO FIND:\n';
output += placed.sort().join('  |  ');

if (showSolution) {
  output += '\n───────────────────────────────────────\n';
  output += 'SOLUTION KEY\n';
  output += placed.sort().join(', ') + '\n';
}

output += '\n═══════════════════════════════════════\n';

console.log(output);

if (outputFile) {
  fs.writeFileSync(outputFile, output);
  console.log('\nSaved to: ' + outputFile);
}

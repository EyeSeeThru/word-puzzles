# Word Puzzles

Anagram solver and word ladder game CLI.

## Commands

```bash
# Find anagrams of a word
node anagram.js listen

# Find shortest word ladder
node ladder.js love hate
```

## Install

```bash
npm install
```

## How It Works

**Anagram Solver:** Sorts letters to find matching words from dictionary.

**Word Ladder:** Uses BFS to find shortest path between words, changing one letter at a time.

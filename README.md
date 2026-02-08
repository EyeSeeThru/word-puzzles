# Word Puzzles Collection

A CLI tool for word puzzles, games, and wordplay.

## What This Is

A collection of word utilities for puzzle enthusiasts, writers, and word game players.

## Tools

### Anagram Solver
Find all words that can be made from a set of letters.

```bash
node anagram.js <letters>
```

**Examples:**
```bash
$ node anagram.js listen
5-letter: inlet, listen, silent, tinsel
6-letter: enlists, listen, tensil
```

### Word Ladder
Find the shortest path between two words, changing one letter at a time.

```bash
node ladder.js <start-word> <end-word>
```

**Examples:**
```bash
$ node ladder.js love hate
love -> hate (1 step)

$ node ladder.js cold warm
cold -> cord -> card -> ward -> warm (4 steps)
```

### Crossword Clue Matcher
Find words matching crossword-style clues.

```bash
node crossword.js <command> <arguments>
```

**Commands:**
| Command | Description | Example |
|---------|-------------|---------|
| `length <n>` | Words with n letters | `crossword.js length 5` |
| `pattern <p>` | Match pattern (dots=unknown) | `crossword.js pattern s..e..` |
| `contains <text>` | Words containing text | `crossword.js contains tion` |
| `starts <prefix>` | Words starting with | `crossword.js starts un` |
| `ends <suffix>` | Words ending with | `crossword.js ends ing` |
| `anagram <letters>` | Anagrams of letters | `crossword.js anagram silent` |
| `letter <c> <pos>` | Letter at position | `crossword.js letter s 3` |

### Word Search Generator
Generate crossword-style puzzles from word lists.

```bash
node wordsearch.js <words...> [options]
```

**Options:**
| Option | Description |
|--------|-------------|
| `--size <n>` | Grid size (default: 15) |
| `--file <file>` | Read words from file |
| `--output <file>` | Save puzzle to file |
| `--solution` | Show answer key |

**Examples:**
```bash
$ node wordsearch.js APPLE BANANA CHERRY --size 12

$ node wordsearch.js --file mywords.txt --output puzzle.txt

$ node wordsearch.js HELLO WORLD PYTHON --solution
```

## Setup

```bash
npm install
```

## Requirements

- Node.js 18+
- ~20k word dictionary included

## Word List

Uses a comprehensive English word list from `words.txt` for accurate results.

## License

MIT

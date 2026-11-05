# dicti: graphs and trees in a Python dict

Many interview questions come down to the same two moves: **build a dict that describes a graph or tree, then walk it.** You can already spot the pattern. What costs you time is the setup: which `defaultdict` to use, `deque` vs a stack, where the `visited` set goes, how to turn the input into edges. This course drills those pieces until you can write them without stopping to think.

It follows the same plan as `../claude_leetcode_help` (see it before you start, then show, then type, then write from blank, then solve on LeetCode cold), with one difference: **you type and run every piece of code in the browser**, with no autocomplete, the way a CoderPad or HackerRank interview works.

## How to open it

```
cd ~/Projects/L/leetcode/dicti
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Double-clicking `index.html` also works in most browsers, but the server avoids browser rules about `file://` pages. The first load downloads Python (Pyodide, about 10 MB) from a CDN, and after that the browser caches it. Unlike the linked-list course, this needs the network once, because real Python has to come from somewhere.

## How each lesson works

Each lesson is one page with five kinds of exercise.

1. **Read.** A short explanation of the one new tool, plus the traps it sets.
2. **Reps.** Small functions (3–10 lines), each in two modes:
   - **Copy.** The solution is beside the editor and you type it. This is the worked example.
   - **Recall.** The solution is hidden, so you write it from the prompt alone.
   The timer starts on your first keystroke and stops when every test passes. Times are saved so you can watch them drop. A rep can also require a particular technique (for example "use `.get`"). Passing the tests with some other technique doesn't count.
3. **Predict.** Read a snippet, type exactly what it prints (or the error it raises), then check. Each snippet targets one trap.
4. **Problems.** Interview-style questions with a function signature and tests, and a solution you can reveal.
5. **From blank + On LeetCode.** Redo the listed reps and problems in Recall mode today and again 2–3 days later. Then solve the LeetCode list on leetcode.com, cold. If one stumps you, write down in `QA.md` which skill was missing.

The editor: Tab indents 4 spaces, Shift+Tab dedents, Enter keeps the indent (and adds one after a `:`), and ⌘/Ctrl+Enter runs. Code that runs longer than 4 seconds gets stopped and Python restarts. In graph lessons, that usually means a missing `visited` check.

## The 12 lessons

| # | Lesson | The new tool | Problems inside / On LeetCode |
|---|---|---|---|
| 01 | **Dict tools for speed** | `.get`, `setdefault`, `defaultdict(int/list/set)`, `Counter`, the "reading creates the key" trap | 49, 347, 387, 383, 290 · 1, 205, 1207 |
| 02 | **Edges → adjacency list** | directed vs undirected, `list` vs `set` neighbours, making sure every node is a key, in-degree / out-degree dicts | 997, 1791, 1971 (build only) |
| 03 | **DFS on the dict** | recursive DFS, iterative with a stack, `visited` as a set, counting components | 1971, 547, 323, 841 |
| 04 | **BFS with `deque`** | `deque`, `popleft`, distance dict, level-by-level loops, shortest path in unweighted graphs | 1971, 433, 1129, 815 |
| 05 | **Grids as graphs** | `(r, c)` as a node, the 4-direction list, bounds checks, marking visited in place | 200, 695, 994, 542 |
| 06 | **Trees as dicts** | child→parent and parent→children maps, finding the root, depth, lowest common ancestor via a parent map | 1443, 863, 236, 1110 |
| 07 | **Implicit graphs** | neighbours computed instead of stored, wildcard buckets (`h*t`), states as tuples | 127, 752, 433, 1091 |
| 08 | **Topological sort** | in-degree dict + queue (Kahn), DFS with three colours, detecting cycles | 207, 210, 269, 2115 |
| 09 | **Weighted graphs** | `graph[u].append((v, w))`, `heapq`, Dijkstra with a `dist` dict, early exit | 743, 1514, 787, 1631 |
| 10 | **Union-find in a dict** | `parent` dict, `find` with path compression, union by size, components | 547, 684, 721, 990 |
| 11 | **Tries as nested dicts** | `node.setdefault(ch, {})`, an end marker, walking a prefix, DFS over a trie | 208, 211, 212, 1268 |
| 12 | **Mixed** | nothing new: problems from 1–11 without the lesson label, so choosing the tool is part of the test | 399, 133, 1192, 310, 1557, 886 |

Each lesson adds one tool and reuses the earlier ones. Lessons 3–11 start by typing the earlier building blocks again from memory (a build + a traversal) before teaching anything new.

## Files

```
dicti/
  index.html          the app (home + lessons)
  app.js              router, editor, timer, Python runner (Pyodide in a Web Worker)
  style.css
  lessons/NN-*.js     one data file per lesson: intro, reps, predicts, problems, tests
  QA.md               questions and answers, LeetCode misses
```

Progress, drafts and times are stored in your browser's `localStorage`, so they stay in this browser on this machine.

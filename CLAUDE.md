# dicti: graphs and trees in a Python dict

The user is getting faster at interview problems that build a graph or tree in a Python dict and then traverse it. They can already recognise the pattern. The goal is **speed and fluency** with the setup (`defaultdict`, `deque`, `visited`, edge building). `README.md` is the approved spec and lists the 12 lessons. The sibling course `../claude_leetcode_help` (linked lists) is the model for tone and the read → copy → recall → LeetCode cold structure.

- **Python only**, typed in the browser with no autocomplete. Every exercise runs real Python via Pyodide in a Web Worker (`app.js`). Tests are Python literals in the lesson data file.
- **One lesson = one file** in `lessons/`, registered with `DICTI.lesson({...})` and added as a `<script>` in `index.html`. `lessons/01-dict-tools.js` is the reference for format and tone. Build one lesson at a time, only when asked.
- **Verify every exercise:** each rep's and problem's `solution` must pass its own `cases`, and each predict snippet's real output must match its explanation. Run `node tools/check.mjs` after any lesson change (it uses the same `harness.js` the browser uses, with local python3).
- Everything stays on the computer: computing names (`node`, `graph`, `edges`), no real-world lenses.
- **Questions go in `QA.md`**, following the rules at its top, updated in the same turn.

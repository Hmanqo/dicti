DICTI.lesson({
  id: "01",
  title: "Dict tools for speed",
  tagline: "get, setdefault, defaultdict, Counter: the four ways to fill a dict, and which one to grab.",

  intro: `
<p>Every graph problem starts by filling a dict. There are four ways to do it, and the time you lose in interviews is
spent choosing between them. The goal of this lesson is to make that choice automatic.</p>

<p>Type this line from memory at the top of every solution, since you'll use these all course long:</p>
<pre><code>from collections import defaultdict, Counter, deque</code></pre>

<h3>Which tool, by job</h3>
<table>
<thead><tr><th>You need to…</th><th>Write</th><th>Reading a missing key…</th></tr></thead>
<tbody>
<tr><td>count things</td><td><code>d[k] = d.get(k, 0) + 1</code><br><code>d = defaultdict(int); d[k] += 1</code><br><code>Counter(items)</code></td><td><code>.get</code>: returns the default, adds nothing<br><code>defaultdict</code>: <b>adds</b> <code>k: 0</code><br><code>Counter</code>: returns 0, adds nothing</td></tr>
<tr><td>group into lists<br>(adjacency lists!)</td><td><code>g = defaultdict(list)</code><br><code>g[k].append(v)</code></td><td>adds <code>k: []</code></td></tr>
<tr><td>unique neighbours</td><td><code>g = defaultdict(set)</code><br><code>g[k].add(v)</code></td><td>adds <code>k: set()</code></td></tr>
<tr><td>group, plain dict</td><td><code>d.setdefault(k, []).append(v)</code></td><td>adds <code>k: []</code></td></tr>
</tbody>
</table>

<p><b>Default choice in interviews:</b> <code>defaultdict(list)</code> for building, <code>Counter</code> for counting.
Use <code>.get</code> when you only need to <em>read</em> without changing the dict.</p>

<h3>Three traps</h3>
<ol>
<li><b><code>defaultdict(list)</code>, not <code>defaultdict([])</code>.</b> You pass a function that <em>makes</em> the
default, and Python calls it again for each new key. <code>list</code>, <code>set</code>, <code>int</code> and
<code>lambda: float("inf")</code> all work.</li>
<li><b>Reading <code>g[k]</code> on a defaultdict adds <code>k</code>.</b> <code>k in g</code> and <code>g.get(k)</code>
don't. This matters in graph walks: <code>for nb in graph[node]</code> inside <code>for node in graph</code> can add a key
mid-loop, and Python raises <code>RuntimeError: dictionary changed size during iteration</code>.</li>
<li><b>An undirected edge is two appends.</b> <code>g[a].append(b)</code> <em>and</em> <code>g[b].append(a)</code>.
Forgetting the second one is the most common graph bug.</li>
</ol>

<p>Then work down the list on the left. For each rep, do <b>Copy</b> once, then <b>Recall</b> until it takes under a minute.</p>
`,

  exercises: [
    // ── Reps ────────────────────────────────────────────────────────────
    {
      id: "r1", kind: "rep", title: "Count with .get",
      fn: "count_get", sig: "count_get(s: str) -> dict",
      prompt: `Return a dict mapping each character of <code>s</code> to how many times it appears. Use a plain <code>{}</code> and <code>.get</code>.`,
      cases: `[
        (("banana",), {"b": 1, "a": 3, "n": 2}),
        (("",), {}),
        (("aaa",), {"a": 3}),
      ]`,
      mustUse: [{ re: "\\.get\\(", msg: "Use d.get(key, 0) for this rep." }],
      mustNot: [{ re: "defaultdict|Counter", msg: "No defaultdict or Counter here: plain dict + .get." }],
      solution: `def count_get(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    return counts`,
      note: `<code>.get(k, 0)</code> never changes the dict, so it's also the safe way to <em>read</em> a dict you're looping over.`,
    },
    {
      id: "r2", kind: "rep", title: "Count with defaultdict(int)",
      fn: "count_dd", sig: "count_dd(s: str) -> dict",
      prompt: `Same job: character → count. This time use <code>defaultdict(int)</code> and <code>+= 1</code>.`,
      cases: `[
        (("banana",), {"b": 1, "a": 3, "n": 2}),
        (("",), {}),
        (("abcabc",), {"a": 2, "b": 2, "c": 2}),
      ]`,
      mustUse: [{ re: "defaultdict\\(\\s*int\\s*\\)", msg: "Use defaultdict(int)." }],
      solution: `from collections import defaultdict

def count_dd(s):
    counts = defaultdict(int)
    for ch in s:
        counts[ch] += 1
    return counts`,
      note: `<code>int()</code> returns 0, which is why <code>defaultdict(int)</code> counts. You can return the defaultdict as is: it <em>is</em> a dict.`,
    },
    {
      id: "r3", kind: "rep", title: "Count with Counter",
      fn: "count_counter", sig: "count_counter(s: str) -> dict",
      prompt: `Same job, one line of body. Don't forget the import.`,
      cases: `[
        (("banana",), {"b": 1, "a": 3, "n": 2}),
        (("",), {}),
        (("mississippi",), {"m": 1, "i": 4, "s": 4, "p": 2}),
      ]`,
      mustUse: [{ re: "Counter\\(", msg: "Use Counter(s)." }],
      solution: `from collections import Counter

def count_counter(s):
    return Counter(s)`,
      note: `Also useful: <code>c.most_common(k)</code> → list of <code>(item, count)</code>, and <code>Counter(a) - Counter(b)</code> keeps only positive counts.`,
    },
    {
      id: "r4", kind: "rep", title: "Group with defaultdict(list)",
      fn: "group_by_len", sig: "group_by_len(words: list[str]) -> dict",
      prompt: `Return a dict mapping each word length to the list of words with that length, in input order. This exact shape (<code>key → list</code>) is an adjacency list.`,
      cases: `[
        ((["hi", "yo", "cat", "a"],), {2: ["hi", "yo"], 3: ["cat"], 1: ["a"]}),
        (([],), {}),
        ((["ab", "cd", "ef"],), {2: ["ab", "cd", "ef"]}),
      ]`,
      mustUse: [{ re: "defaultdict\\(\\s*list\\s*\\)", msg: "Use defaultdict(list)." }],
      solution: `from collections import defaultdict

def group_by_len(words):
    groups = defaultdict(list)
    for w in words:
        groups[len(w)].append(w)
    return groups`,
      note: `Swap <code>len(w)</code> for any key function and this is the body of half the "group" problems.`,
    },
    {
      id: "r5", kind: "rep", title: "Group with setdefault",
      fn: "group_setdefault", sig: "group_setdefault(words: list[str]) -> dict",
      prompt: `Same output as the last rep, with a plain <code>{}</code> and <code>setdefault</code>. Sometimes you get a plain dict and can't swap in a defaultdict.`,
      cases: `[
        ((["hi", "yo", "cat", "a"],), {2: ["hi", "yo"], 3: ["cat"], 1: ["a"]}),
        (([],), {}),
      ]`,
      mustUse: [{ re: "setdefault\\(", msg: "Use d.setdefault(key, [])." }],
      mustNot: [{ re: "defaultdict", msg: "No defaultdict here: plain dict + setdefault." }],
      solution: `def group_setdefault(words):
    groups = {}
    for w in words:
        groups.setdefault(len(w), []).append(w)
    return groups`,
      note: `<code>setdefault</code> builds the <code>[]</code> on every call, even when the key exists. Fine here, but it's why <code>defaultdict</code> is the default.`,
    },
    {
      id: "r6", kind: "rep", title: "Undirected neighbours (preview of 02)",
      fn: "neighbours", sig: "neighbours(pairs: list[tuple]) -> dict[str, set]",
      prompt: `Each pair <code>(a, b)</code> is an undirected edge. Return a dict mapping each node to the <b>set</b> of its neighbours. Pairs may repeat.`,
      cases: `[
        (([("a", "b"), ("b", "c"), ("a", "b")],), {"a": {"b"}, "b": {"a", "c"}, "c": {"b"}}),
        (([],), {}),
        (([("x", "y")],), {"x": {"y"}, "y": {"x"}}),
      ]`,
      mustUse: [{ re: "defaultdict\\(\\s*set\\s*\\)", msg: "Use defaultdict(set)." }],
      solution: `from collections import defaultdict

def neighbours(pairs):
    graph = defaultdict(set)
    for a, b in pairs:
        graph[a].add(b)
        graph[b].add(a)
    return graph`,
      note: `Two lines per edge for undirected graphs. <code>set</code> removes the repeated pair for free.`,
    },
    {
      id: "r7", kind: "rep", title: "Invert a dict",
      fn: "invert", sig: "invert(d: dict) -> dict",
      prompt: `Return a dict mapping each <em>value</em> of <code>d</code> to the list of keys that had it, in <code>d</code>'s order. (Child→parent becomes parent→children in lesson 06.)`,
      cases: `[
        (({"x": 1, "y": 2, "z": 1},), {1: ["x", "z"], 2: ["y"]}),
        (({},), {}),
        (({"a": "root", "b": "a", "c": "a"},), {"root": ["a"], "a": ["b", "c"]}),
      ]`,
      solution: `from collections import defaultdict

def invert(d):
    out = defaultdict(list)
    for k, v in d.items():
        out[v].append(k)
    return out`,
      note: `<code>for k, v in d.items()</code>: type it until it's one motion.`,
    },

    // ── Predict ─────────────────────────────────────────────────────────
    {
      id: "d1", kind: "predict", title: "Does reading add a key?",
      code: `from collections import defaultdict
d = defaultdict(list)
if d["x"]:
    print("has x")
print(len(d))`,
      explain: `<code>d["x"]</code> on a defaultdict creates <code>"x": []</code>. The empty list is falsy, so nothing prints from the <code>if</code>, but the key now exists.`,
    },
    {
      id: "d2", kind: "predict", title: "in and .get",
      code: `from collections import defaultdict
d = defaultdict(list)
if "x" in d:
    print("has x")
print(d.get("y"), len(d))`,
      explain: `<code>in</code> and <code>.get</code> only look. They never call the factory. <code>.get</code> without a default returns <code>None</code>.`,
    },
    {
      id: "d3", kind: "predict", title: "Counter's missing keys",
      code: `from collections import Counter
c = Counter("hello")
print(c["z"], "z" in c, c.most_common(1))`,
      explain: `Counter returns 0 for a missing key <em>without</em> adding it. <code>most_common(1)</code> is a list holding one <code>(item, count)</code> tuple.`,
    },
    {
      id: "d4", kind: "predict", title: "Walking a defaultdict",
      code: `from collections import defaultdict
graph = defaultdict(list)
graph["a"].append("b")
for node in graph:
    for nb in graph[node]:
        print(node, "->", nb, len(graph[nb]))`,
      explain: `<code>"b"</code> was only ever a neighbour, never a key. <code>graph[nb]</code> adds it in the middle of <code>for node in graph</code>, so the line prints and then the outer loop raises. Fixes: <code>graph.get(nb, [])</code>, or add both ends of every edge as keys when you build the graph.`,
    },
    {
      id: "d5", kind: "predict", title: "defaultdict([])",
      code: `from collections import defaultdict
d = defaultdict([])
d["a"].append(1)
print(d)`,
      explain: `The argument must be <em>callable</em>, a thing that makes a new default each time. Pass <code>list</code>, not <code>[]</code>.`,
    },

    // ── Problems ────────────────────────────────────────────────────────
    {
      id: "p1", kind: "problem", title: "Group anagrams", leetcode: 49,
      fn: "group_anagrams", mode: "groups",
      prompt: `Given a list of words, group together the words that are anagrams of each other (same letters, any order). Return a list of groups. The order of groups and of words inside a group doesn't matter.`,
      stub: `def group_anagrams(words):
    `,
      cases: `[
        ((["eat", "tea", "tan", "ate", "nat", "bat"],), [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]),
        (([""],), [[""]]),
        ((["a"],), [["a"]]),
        ((["ab", "ba", "abc", "cab", "x"],), [["ab", "ba"], ["abc", "cab"], ["x"]]),
      ]`,
      solution: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())`,
      note: `The whole trick is the key: every anagram sorts to the same string. <code>tuple(sorted(w))</code> also works, since lists can't be keys but tuples can.`,
    },
    {
      id: "p2", kind: "problem", title: "Top k frequent", leetcode: 347,
      fn: "top_k_frequent", mode: "sorted",
      prompt: `Return the <code>k</code> most frequent numbers in <code>nums</code>, in any order. The answer is unique.`,
      stub: `def top_k_frequent(nums, k):
    `,
      cases: `[
        (([1, 1, 1, 2, 2, 3], 2), [1, 2]),
        (([1], 1), [1]),
        (([4, 4, 5, 5, 5, 6], 1), [5]),
        (([7, 7, 8, 9, 9, 9, 8, 8, 8], 2), [8, 9]),
      ]`,
      solution: `from collections import Counter

def top_k_frequent(nums, k):
    return [x for x, _ in Counter(nums).most_common(k)]`,
      note: `<code>most_common</code> is O(n log n). If they ask for better, bucket by count: <code>buckets[count].append(x)</code> and read from the high end.`,
    },
    {
      id: "p3", kind: "problem", title: "First unique character", leetcode: 387,
      fn: "first_unique", mode: "exact",
      prompt: `Return the index of the first character in <code>s</code> that appears exactly once, or <code>-1</code> if none does.`,
      stub: `def first_unique(s):
    `,
      cases: `[
        (("leetcode",), 0),
        (("loveleetcode",), 2),
        (("aabb",), -1),
        (("",), -1),
      ]`,
      solution: `from collections import Counter

def first_unique(s):
    counts = Counter(s)
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1`,
      note: `Two passes: count everything, then scan in order. This "build the dict first, then use it" shape is the same one graph problems use.`,
    },
    {
      id: "p4", kind: "problem", title: "Can you build the note?", leetcode: 383,
      fn: "can_construct", mode: "exact",
      prompt: `Can <code>note</code> be built from the letters of <code>magazine</code>, using each magazine letter at most once?`,
      stub: `def can_construct(note, magazine):
    `,
      cases: `[
        (("a", "b"), False),
        (("aa", "ab"), False),
        (("aa", "aab"), True),
        (("", "x"), True),
      ]`,
      solution: `from collections import Counter

def can_construct(note, magazine):
    return not (Counter(note) - Counter(magazine))`,
      note: `Counter subtraction drops zero and negative counts, so anything left over is a letter the magazine is short of.`,
    },
    {
      id: "p5", kind: "problem", title: "Word pattern", leetcode: 290,
      fn: "word_pattern", mode: "exact",
      prompt: `<code>pattern</code> is letters, <code>s</code> is space-separated words. Return <code>True</code> if each letter maps to exactly one word <em>and</em> each word to exactly one letter.`,
      stub: `def word_pattern(pattern, s):
    `,
      cases: `[
        (("abba", "dog cat cat dog"), True),
        (("abba", "dog cat cat fish"), False),
        (("aaaa", "dog cat cat dog"), False),
        (("abba", "dog dog dog dog"), False),
        (("abc", "dog cat"), False),
      ]`,
      solution: `def word_pattern(pattern, s):
    words = s.split()
    if len(words) != len(pattern):
        return False
    to_word, to_letter = {}, {}
    for p, w in zip(pattern, words):
        if to_word.get(p, w) != w or to_letter.get(w, p) != p:
            return False
        to_word[p] = w
        to_letter[w] = p
    return True`,
      note: `A one-to-one mapping needs <b>two</b> dicts. <code>.get(p, w) != w</code> reads as "if p is already mapped, it must be to w".`,
    },
  ],

  fromBlank: ["r4", "r6", "p1", "p5"],

  leetcode: [
    { n: 1, title: "Two Sum", slug: "two-sum" },
    { n: 49, title: "Group Anagrams", slug: "group-anagrams" },
    { n: 347, title: "Top K Frequent Elements", slug: "top-k-frequent-elements" },
    { n: 387, title: "First Unique Character in a String", slug: "first-unique-character-in-a-string" },
    { n: 383, title: "Ransom Note", slug: "ransom-note" },
    { n: 290, title: "Word Pattern", slug: "word-pattern" },
    { n: 205, title: "Isomorphic Strings", slug: "isomorphic-strings" },
    { n: 1207, title: "Unique Number of Occurrences", slug: "unique-number-of-occurrences" },
  ],
});

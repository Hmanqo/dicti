// The Python side of the runner. Loaded into Pyodide inside the worker, and
// by tools/check.mjs to verify lesson solutions with local python3.
window.DICTI_HARNESS = String.raw`
import ast, io, json, copy, traceback, contextlib

def _fmt(x):
    if isinstance(x, dict):
        if not x:
            return "{}"
        return "{" + ", ".join(_fmt(k) + ": " + _fmt(v) for k, v in x.items()) + "}"
    if isinstance(x, list):
        return "[" + ", ".join(_fmt(v) for v in x) + "]"
    if isinstance(x, tuple):
        if len(x) == 1:
            return "(" + _fmt(x[0]) + ",)"
        return "(" + ", ".join(_fmt(v) for v in x) + ")"
    if isinstance(x, (set, frozenset)):
        if not x:
            return "set()"
        try:
            items = sorted(x)
        except TypeError:
            items = list(x)
        return "{" + ", ".join(_fmt(v) for v in items) + "}"
    return repr(x)

def _norm(x, mode):
    if mode == "sorted":
        return sorted(x)
    if mode == "groups":
        return sorted(sorted(g) for g in x)
    if mode == "set":
        return set(x)
    return x

def _err(e):
    line = None
    for fr in traceback.extract_tb(e.__traceback__):
        if fr.filename == "<your code>":
            line = fr.lineno
    if isinstance(e, SyntaxError):
        if e.filename == "<your code>":
            line = e.lineno
        return {"line": line, "msg": type(e).__name__ + ": " + str(e.msg)}
    text = str(e)
    return {"line": line, "msg": type(e).__name__ + (": " + text if text else "")}

def _run_tests(code, fname, cases_src, mode):
    buf = io.StringIO()
    res = {"stdout": "", "error": None, "cases": []}
    ns = {"__name__": "__main__"}
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, "<your code>", "exec"), ns)
    except BaseException as e:
        res["error"] = _err(e)
    if res["error"] is None:
        fn = ns.get(fname)
        if not callable(fn):
            res["error"] = {"line": None, "msg": "No function named " + fname + "() was defined."}
        else:
            for args, exp in ast.literal_eval(cases_src):
                c = {"call": fname + "(" + ", ".join(_fmt(a) for a in args) + ")", "expected": _fmt(exp)}
                try:
                    with contextlib.redirect_stdout(buf):
                        got = fn(*copy.deepcopy(args))
                    c["got"] = _fmt(got)
                    try:
                        c["ok"] = _norm(got, mode) == _norm(exp, mode)
                    except Exception as e:
                        c["ok"] = False
                        c["got"] += "   (couldn't compare: " + _err(e)["msg"] + ")"
                except BaseException as e:
                    er = _err(e)
                    c["got"] = er["msg"]
                    c["line"] = er["line"]
                    c["ok"] = False
                res["cases"].append(c)
    res["stdout"] = buf.getvalue()[-4000:]
    return json.dumps(res)

def _run_snippet(code):
    buf = io.StringIO()
    err = None
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, "<snippet>", "exec"), {"__name__": "__main__"})
    except BaseException as e:
        text = str(e)
        err = type(e).__name__ + (": " + text if text else "")
    return json.dumps({"stdout": buf.getvalue(), "error": err})
`;

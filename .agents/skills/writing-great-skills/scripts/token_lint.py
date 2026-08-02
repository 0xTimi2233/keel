# /// script
# requires-python = ">=3.10"
# ///

"""uv run token_lint.py <file>..."""

import argparse
import re
import sys
from pathlib import Path


FULLWIDTH = "，。；：！？、（）“”‘’"
FORBIDDEN = "\u300a\u300b\u3010\u3011\u300c\u300d\u300e\u300f"
CJK = r"\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"

FENCE_RE = re.compile(r"^\s*(`{3,}|~{3,})")
INLINE_CODE_RE = re.compile(r"`+[^`\n]*?`+")
PREFIX_RE = re.compile(r"^\s*(?:>\s*)*(?:(?:#{1,6}|[-+*]|\d+[.)])\s+)?")
PUNCT_SPACE_RE = re.compile(
    rf"(?<=\S)[ \t]+(?=[{re.escape(FULLWIDTH)}])|"
    rf"(?<=[{re.escape(FULLWIDTH)}])[ \t]+(?=\S)"
)
CJK_SPACE_RE = re.compile(rf"(?<=[{CJK}]) +(?=[{CJK}])")
INVISIBLE_RE = re.compile("[\u00a0\u200b\u2060\ufeff\u3000]")
FORBIDDEN_RE = re.compile(f"[{FORBIDDEN}]")


def emit(path, line, message):
    print(f"{path}:{line}: {message}")


def mask_prose(line):
    line = INLINE_CODE_RE.sub("X", line)
    prefix = PREFIX_RE.match(line)
    return "X" * prefix.end() + line[prefix.end() :]


def scan_code_blocks(lines, path):
    code_lines = set()
    start = None
    fence_char = ""
    fence_width = 0
    found = False

    for index, line in enumerate(lines):
        if start is None:
            opening = FENCE_RE.match(line)
            if not opening:
                continue
            marker = opening.group(1)
            start = index
            fence_char = marker[0]
            fence_width = len(marker)
            code_lines.add(index)
            continue

        code_lines.add(index)
        closing = re.match(
            rf"^\s*{re.escape(fence_char)}{{{fence_width},}}\s*$",
            line,
        )
        if not closing:
            continue

        content = lines[start + 1 : index]
        if content and not content[0].strip():
            emit(path, start + 2, "代码块开头存在空行")
            found = True

        last_content = len(content) - 1
        while last_content >= 0 and not content[last_content].strip():
            last_content -= 1
        if last_content < len(content) - 1:
            emit(path, start + last_content + 3, "代码块末尾存在空行")
            found = True

        start = None
        fence_char = ""
        fence_width = 0

    return code_lines, found


def lint_text(text, path):
    lines = text.splitlines()
    found = False

    if lines and not lines[0].strip():
        emit(path, 1, "文件开头存在换行")
        found = True

    code_lines, block_found = scan_code_blocks(lines, path)
    found |= block_found
    blank_lines = 0

    for index, line in enumerate(lines):
        if index in code_lines:
            blank_lines = 0
            continue

        line_number = index + 1
        if not line.strip():
            blank_lines += 1
            if blank_lines == 2:
                emit(path, line_number, "连续空行超过 1 个")
                found = True
            continue

        blank_lines = 0
        prose = mask_prose(line)
        trailing = re.search(r"[ \t]+$", line)
        checks = (
            (prose.rstrip(" \t").endswith("。"), "行尾句号"),
            (bool(trailing and trailing.group() != "  "), "行尾空白"),
            (bool(PUNCT_SPACE_RE.search(prose)), "全角标点旁存在空格"),
            (bool(CJK_SPACE_RE.search(prose)), "中文字符之间存在空格"),
            (bool(INVISIBLE_RE.search(line)), "不可见字符或非常规空格"),
            (bool(FORBIDDEN_RE.search(line)), "使用了禁止的全角括号"),
        )
        for matched, message in checks:
            if matched:
                emit(path, line_number, message)
                found = True

    if text.endswith(("\n", "\r")):
        emit(path, max(1, len(lines)), "文件末尾存在换行")
        found = True

    return found


def lint_file(path):
    try:
        return lint_text(path.read_text(encoding="utf-8"), str(path))
    except (OSError, UnicodeError) as error:
        print(f"{path}: {error}", file=sys.stderr)
        return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("files", nargs="+")
    paths = [Path(file) for file in parser.parse_args().files]

    missing = [path for path in paths if not path.is_file()]
    if missing:
        for path in missing:
            print(f"{path}: 文件不存在", file=sys.stderr)
        return 2

    found = False
    for path in paths:
        found |= lint_file(path)
    return 1 if found else 0


if __name__ == "__main__":
    raise SystemExit(main())

# /// script
# dependencies = ["tiktoken", "transformers"]
# ///

"""
uv run token_analyze.py <file|text>... [--show-text]

# Example
uv run token_analyze.py "你好"
uv run token_analyze.py "如" "例如"
"""

import os
os.environ["TRANSFORMERS_NO_ADVISORY_WARNINGS"] = "1"

import sys
import argparse
import tiktoken
from transformers import AutoTokenizer

def get_tokenizer(model_id):
    try:
        return AutoTokenizer.from_pretrained(model_id, trust_remote_code=True, local_files_only=True)
    except Exception:
        return AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)

TOKENIZERS = {
    "cl100k": tiktoken.get_encoding("cl100k_base"),
    "o200k": tiktoken.get_encoding("o200k_base"),
    "Qwen2.5": get_tokenizer("Qwen/Qwen2.5-7B-Instruct"),
    "DeepSeek-V3": get_tokenizer("deepseek-ai/DeepSeek-V3"),
}

def calc_tokens(text):
    return {
        name: len(t.encode(text)) if hasattr(t, "encode") else len(t(text)["input_ids"])
        for name, t in TOKENIZERS.items()
    }

def format_table(headers, rows):
    h = "| " + " | ".join(headers) + " |"
    sep = "| " + " | ".join("---" for _ in headers) + " |"
    return "\n".join([h, sep] + ["| " + " | ".join(row) + " |" for row in rows])

def main():
    parser = argparse.ArgumentParser(
        prog="uv run token_analyze.py",
        usage="%(prog)s <file|text>... [--show-text]",
        description="Token 分析工具",
    )
    parser.add_argument("inputs", nargs="*", help="分析目标 (文件路径或文本)")
    parser.add_argument("--show-text", "-t", action="store_true", help="显示文本原文或完整文件路径")

    args = parser.parse_args()
    if not args.inputs:
        parser.print_help()
        return

    cols = list(TOKENIZERS.keys())
    headers = ["分析对象 / 详细内容" if args.show_text else "分析对象"] + cols
    rows = []

    for idx, target in enumerate(args.inputs, 1):
        if os.path.isfile(target):
            with open(target, "r", encoding="utf-8") as f:
                content = f.read()
            label = f"`{target}`" if args.show_text else f"`${idx}`"
        else:
            content = target
            if args.show_text:
                clean_text = content.replace("\n", "\\n").replace("|", "\\|")
                label = f"`{clean_text}`"
            else:
                label = f"`${idx}`"

        stats = calc_tokens(content)
        rows.append([label] + [str(stats[c]) for c in cols])

    print(format_table(headers, rows))

if __name__ == "__main__":
    main()

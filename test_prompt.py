#!/usr/bin/env python3
"""
Test the FileMaker AI record analysis prompt against sample data.
Calls the Anthropic API with system_prompt.txt + sample_data.json.

Usage:
    export ANTHROPIC_API_KEY=sk-ant-...
    python test_prompt.py
"""

import json
import sys
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("Install the Anthropic SDK: pip install anthropic")
    sys.exit(1)

BASE_DIR = Path(__file__).parent

system_prompt = (BASE_DIR / "system_prompt.txt").read_text()
sample_data = (BASE_DIR / "sample_data.json").read_text()

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=300,
    system=system_prompt,
    messages=[
        {
            "role": "user",
            "content": f"Analyze this organization record. Return the top issues as a JSON array.\n\n{sample_data}",
        }
    ],
)

result_text = response.content[0].text
print("Raw response:")
print(result_text)
print()

# Validate it's parseable JSON
try:
    issues = json.loads(result_text)
    print(f"Valid JSON — {len(issues)} issue(s) returned:")
    for i, issue in enumerate(issues):
        print(f"  [{i}] {issue}")
except json.JSONDecodeError as e:
    print(f"WARNING: Response is not valid JSON: {e}")
    sys.exit(1)

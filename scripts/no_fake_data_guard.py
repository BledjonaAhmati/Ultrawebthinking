#!/usr/bin/env python3
"""Fail build when runtime code contains fake/mock/placeholder data patterns."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CODE_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".rs",
    ".cs",
    ".go",
    ".java",
    ".kt",
    ".yaml",
    ".yml",
}

EXCLUDED_DIRS = {
    ".git",
    ".github",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "venv",
    ".venv",
    "obj",
    "bin",
    "docs",
}

EXCLUDED_FILES = {
    "README.md",
    "CHANGELOG.md",
    "NO_FAKE_DATA_POLICY.md",
    "no_fake_data_guard.py",
}

ALLOWED_PATH_KEYWORDS = {
    "test",
    "tests",
    "spec",
    "fixture",
    "fixtures",
    "example",
    "examples",
    "demo",
}

RULES = [
    (
        re.compile(r"\breturn\b[^\n]*(fake|mock|placeholder|dummy|synthetic)", re.IGNORECASE),
        "Suspicious return with fake/mock/placeholder content",
    ),
    (
        re.compile(r"\b(placeholder\s+for\s+actual|todo\s*[:\-]?\s*mock|fake\s+response)\b", re.IGNORECASE),
        "Explicit fake/mock placeholder marker in runtime code",
    ),
    (
        re.compile(
            r"\b(prediction|result|value|score|status|data)\b\s*[:=]\s*['\"](result|fake|mock|placeholder|dummy)['\"]",
            re.IGNORECASE,
        ),
        "Hardcoded synthetic runtime value",
    ),
]

ALLOW_MARKER = "NO_FAKE_GUARD:ALLOW"


def should_skip(path: Path) -> bool:
    if path.name in EXCLUDED_FILES:
        return True

    rel = path.relative_to(ROOT)
    parts_lower = {p.lower() for p in rel.parts}

    if any(part in EXCLUDED_DIRS for part in parts_lower):
        return True

    if any(keyword in parts_lower for keyword in ALLOWED_PATH_KEYWORDS):
        return True

    return path.suffix.lower() not in CODE_EXTENSIONS


def scan_file(path: Path) -> list[tuple[int, str, str]]:
    findings: list[tuple[int, str, str]] = []

    try:
        content = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return findings

    lines = content.splitlines()
    for line_no, line in enumerate(lines, start=1):
        if ALLOW_MARKER in line:
            continue

        for regex, reason in RULES:
            if regex.search(line):
                findings.append((line_no, reason, line.strip()))
                break

    return findings


def main() -> int:
    findings_by_file: list[tuple[Path, list[tuple[int, str, str]]]] = []

    for path in ROOT.rglob("*"):
        if not path.is_file() or should_skip(path):
            continue
        findings = scan_file(path)
        if findings:
            findings_by_file.append((path, findings))

    if not findings_by_file:
        print("NO_FAKE_DATA_GUARD: PASS")
        return 0

    print("NO_FAKE_DATA_GUARD: FAIL")
    print("Detected potential fake/mock/placeholder runtime patterns:")

    for file_path, findings in findings_by_file:
        rel = file_path.relative_to(ROOT).as_posix()
        for line_no, reason, snippet in findings:
            print(f"- {rel}:{line_no} | {reason}")
            print(f"  -> {snippet}")

    print("\nFix findings or add explicit allow marker for intentional test/demo lines.")
    print(f"Allow marker: {ALLOW_MARKER}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

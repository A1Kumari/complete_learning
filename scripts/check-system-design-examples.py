"""Execute the actual standalone Python examples in the System Design lessons."""

from pathlib import Path
import re
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "content" / "subjects" / "sys"
PYTHON_FENCE = re.compile(r"^```python\n(.*?)^```\s*$", re.MULTILINE | re.DOTALL)


def main():
    checked = 0
    for path in sorted(LESSONS.glob("*/lessons/*.md")):
        for index, source in enumerate(PYTHON_FENCE.findall(path.read_text()), start=1):
            name = f"{path.relative_to(ROOT)}:Python example {index}"
            result = subprocess.run(
                [sys.executable, "-I", "-c", source],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
            if result.returncode:
                raise SystemExit(f"FAIL {name}\n{result.stdout}{result.stderr}")
            print(f"PASS {name}")
            checked += 1
    if not checked:
        raise SystemExit("No System Design Python examples found.")
    print(f"Verified {checked} standalone Python examples without external services.")


if __name__ == "__main__":
    main()

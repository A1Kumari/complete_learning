"""Run the actual published Python fences, independently, without model services.

Usage: python scripts/check-deep-learning-examples.py
Requires NumPy. No generated copies of the teaching examples are maintained.
"""

from pathlib import Path
import re
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "content/subjects/ai-engineering/deep-learning/lessons"
EXPECTED = {
    "convolutional-networks.md": ["[[0. 6.]\n [0. 6.]]"],
    "recurrent-networks.md": ["1 0.7616\n2 0.3634\n3 0.828", "1.9 0.765"],
    "encoder-decoder.md": [
        "latent: [2. 1.]\nreconstructed: [2.  1.  0.5]\nMSE: 0.08333"
    ],
    "architecture-selection.md": ["tokens: 1500\nKV MiB: 8.79\nLSTM KiB: 6.0"],
}


def main():
    total = 0
    for filename, expected_outputs in EXPECTED.items():
        source = (LESSONS / filename).read_text()
        blocks = re.findall(r"^```python\n(.*?)^```", source, flags=re.M | re.S)
        assert len(blocks) == len(expected_outputs), f"Review example inventory: {filename}"
        for index, (block, expected) in enumerate(zip(blocks, expected_outputs), 1):
            result = subprocess.run(
                [sys.executable, "-I", "-c", block],
                text=True, capture_output=True, timeout=15, check=True,
            )
            assert result.stdout.strip() == expected, (
                f"{filename} block {index}: expected {expected!r}; got {result.stdout!r}"
            )
            print(f"PASS {filename} Python block {index}")
            total += 1
    print(f"Verified {total} independently executed Python examples.")


if __name__ == "__main__":
    main()

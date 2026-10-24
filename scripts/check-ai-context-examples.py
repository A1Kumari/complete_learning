"""Run actual Context Engineering / Structured Output / Embeddings Python fences.

Python 3 + NumPy + Pydantic v2. No network, model downloads, or provider calls.
Each block runs in an independent isolated-mode Python subprocess.
"""

from pathlib import Path
import re
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "content/subjects/ai-engineering"
EXPECTED = {
    "context/lessons/context-selection.md":
        "current-policy; historical request uses old-policy; other tenant sees nothing",
    "context/lessons/context-packing.md":
        "task + policy + exception: 25 input units; mandatory overflow rejected",
    "context/lessons/context-memory.md":
        "latest preference en; expiry does not revive es; deletion respected",
    "context/lessons/context-evaluation.md":
        "2/4 correct; one evidence-use failure and one omission",
    "structured-output/lessons/schema-contracts.md":
        "policy-v1: four required keys; days and source_id allow null",
    "structured-output/lessons/typed-validation.md":
        "strict types and version checked; unsupported policy claim rejected",
    "structured-output/lessons/output-recovery.md":
        "repair accepted at attempt 2; exhaustion, mismatch, refusal, incomplete handled",
    "structured-output/lessons/streamed-output-acceptance.md":
        "accepted only after item and response completion; failed prefixes rejected",
    "embeddings/lessons/embedding-objectives.md": "0.1429 0.0206",
    "embeddings/lessons/embedding-metrics.md":
        "raw dot: B; cosine: A; raw L2: C; unit-vector equivalence checked",
    "embeddings/lessons/embedding-input-contracts.md":
        "roles preserved; French text retained; long and invalid inputs rejected",
    "embeddings/lessons/embedding-evaluation-migration.md":
        "(0.5, 0.6667) (1.0, 0.75)",
}


def main():
    for filename, expected in EXPECTED.items():
        blocks = re.findall(r"^```python\n(.*?)^```", (BASE / filename).read_text(),
                            flags=re.M | re.S)
        assert len(blocks) == 1, f"Review executable example inventory: {filename}"
        result = subprocess.run(
            [sys.executable, "-I", "-c", blocks[0]],
            capture_output=True, text=True, timeout=15, check=False,
        )
        assert result.returncode == 0, f"{filename}:\n{result.stderr}"
        assert result.stdout.strip() == expected, (
            f"{filename}: expected {expected!r}; got {result.stdout!r}"
        )
        print(f"PASS {filename}")
    print(f"Verified {len(EXPECTED)} independent Python examples and expected outputs.")


if __name__ == "__main__":
    main()

"""Execute the four requested Part 1 topics' actual Python fences offline.

Run with Python 3 + NumPy. Live provider calls are explicitly disabled; no SDK,
credentials, model downloads, or network calls are needed for the fixtures.
"""

import os
from pathlib import Path
import re
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "content/subjects/ai-engineering"
EXPECTED = {
    "tokenization/lessons/text-tokenization.md": ["['low', 'er']"],
    "tokenization/lessons/token-representations.md": [
        "[[1.0, 2.0], [3.0, 4.0], [1.0, 2.0], [0.0, 0.0]]\n[1.6667, 2.6667]"
    ],
    "tokenization/lessons/sentence-embeddings.md": [
        "[('A', 0.9487), ('B', 0.0), ('C', -1.0)]"
    ],
    "llm-fundamentals/lessons/language-model-pretraining.md": ["0.7675 2.1544"],
    "llm-fundamentals/lessons/instruction-tuning-alignment.md": ["0.6931 0.3133"],
    "llm-fundamentals/lessons/llm-inference.md": [
        "[0.6652, 0.2447, 0.09]\n[(0, 0.7311), (1, 0.2689)]"
    ],
    "llm-fundamentals/lessons/llm-capabilities-limitations.md": ["['A']"],
    "llm-api/lessons/request-lifecycle.md": [
        "offline request contract passed", "live request skipped"
    ],
    "llm-api/lessons/structured-responses.md": ["invoice contract passed"],
    "llm-api/lessons/tool-calling.md": [
        "tool result correlated; cross-tenant request denied"
    ],
    "llm-api/lessons/streaming-responses.md": ["Hello; interrupted streams rejected"],
    "prompting/lessons/instruction-design.md": [
        "instruction and evidence channels separated"
    ],
    "prompting/lessons/examples-reasoning-patterns.md": [
        "3 demonstrations; 1 unlabelled task"
    ],
    "prompting/lessons/templates-dynamic-context.md": [
        "data serialized; configuration allowlisted"
    ],
    "prompting/lessons/evaluation-failure-analysis.md": [
        "baseline 1/3; candidate 3/3; all baseline outputs were structurally valid"
    ],
}


def main():
    total = 0
    environment = {**os.environ, "RUN_LIVE_LLM": "0"}
    for key in ("OPENAI_API_KEY", "OPENAI_MODEL"):
        environment.pop(key, None)
    for filename, expected_outputs in EXPECTED.items():
        blocks = re.findall(r"^```python\n(.*?)^```", (BASE / filename).read_text(),
                            flags=re.M | re.S)
        assert len(blocks) == len(expected_outputs), f"Review inventory: {filename}"
        for index, (block, expected) in enumerate(zip(blocks, expected_outputs), 1):
            result = subprocess.run(
                [sys.executable, "-I", "-c", block], env=environment,
                capture_output=True, text=True, timeout=15, check=True,
            )
            assert result.stdout.strip() == expected, (
                f"{filename} block {index}: expected {expected!r}, got {result.stdout!r}"
            )
            print(f"PASS {filename} block {index}")
            total += 1
    print(f"Verified {total} Python blocks from {len(EXPECTED)} lessons; live calls disabled.")


if __name__ == "__main__":
    main()

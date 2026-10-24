"""Run actual Transformers / Vector Databases / Retrieval Systems lesson fences.

Python 3 + NumPy; no model downloads, external services, or provider calls.
Every example runs in an independent isolated-mode subprocess with assertions.
"""

from pathlib import Path
import re
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'content/subjects/ai-engineering'
EXPECTED = {
    'transformers/lessons/scaled-attention.md':
        'rows sum to 1; future weights zero; earlier outputs unchanged',
    'transformers/lessons/transformer-blocks.md':
        '2 heads of width 4; transpose and merge preserve token channels',
    'transformers/lessons/transformer-variants.md':
        'cross-attention: 2 target queries x 4 source keys; padding excluded',
    'transformers/lessons/cached-decoding.md':
        'cached token matches full pass; offset-free triangle fails',
    'vector-databases/lessons/exact-vector-search.md':
        'exact cosine top-2: policy, guide; invalid vectors rejected',
    'vector-databases/lessons/approximate-indexes.md':
        'probe-1 recall=0.0, distances=1; probe-2 recall=1.0, distances=3',
    'vector-databases/lessons/filtered-search.md':
        'global top-2 then filter: empty; eligible top-2: current, guide',
    'vector-databases/lessons/vector-lifecycle.md':
        'stale update rejected; delete retained; late retry cannot resurrect policy',
    'retrieval-systems/lessons/lexical-retrieval.md':
        'password: D, A; ZX-42: C; unseen: no lexical matches',
    'retrieval-systems/lessons/hybrid-retrieval.md':
        'lexical: C; dense: B, A, D, C; fused: C, B, A, D',
    'retrieval-systems/lessons/reranking.md':
        'reranked: A, B; missing candidate A cannot be recovered',
    'retrieval-systems/lessons/retrieval-evaluation.md':
        'before: 0.5000, 0.5000, 0.0827; after: 1.0000, 1.0000, 1.0000',
}


def main():
    actual_files = {
        str(path.relative_to(BASE))
        for topic in ['transformers', 'vector-databases', 'retrieval-systems']
        for path in (BASE / topic / 'lessons').glob('*.md')
    }
    assert actual_files == set(EXPECTED), 'Review lesson example inventory'
    for filename, expected in EXPECTED.items():
        blocks = re.findall(r'^```python\n(.*?)^```', (BASE / filename).read_text(),
                            flags=re.M | re.S)
        assert len(blocks) == 1, f'Review executable fences: {filename}'
        result = subprocess.run(
            [sys.executable, '-I', '-c', blocks[0]], capture_output=True,
            text=True, timeout=15, check=False,
        )
        assert result.returncode == 0, f'{filename}:\n{result.stderr}'
        assert result.stdout.strip() == expected, (
            f'{filename}: expected {expected!r}, got {result.stdout!r}'
        )
        print(f'PASS {filename}')
    print(f'Verified {len(EXPECTED)} independent Python examples and outputs.')


if __name__ == '__main__':
    main()

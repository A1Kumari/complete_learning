"""Execute actual RAG / AI Agents / Agent Frameworks lesson Python fences.

Use Python 3 with scripts/requirements-ai-rag-agents.txt installed for the two
real framework integrations. No model providers, databases, or paid calls.
"""

import os
from pathlib import Path
import re
import subprocess
import sys


BASE = Path(__file__).resolve().parents[1] / 'content/subjects/ai-engineering'
EXPECTED = {
    'rag/lessons/ingestion-and-chunking.md':
        '2 reproducible chunks; source pages retained; revisions have distinct IDs',
    'rag/lessons/retrieval-to-answer.md':
        '30-day answer cites returns-v2; missing, unauthorized, and unfit evidence abstain',
    'rag/lessons/grounding-and-citations.md':
        'supported 30-day field accepted; false claim, irrelevant quote, wrong ID/scope rejected',
    'rag/lessons/advanced-rag-patterns.md':
        '2 searches cover window and exception; duplicates, other tenant, stale parent excluded',
    'agents/lessons/agent-loop.md':
        'read then finish; repeats, unknown tools, unsupported finish, and step exhaustion stop',
    'agents/lessons/tool-contracts.md':
        'one authorized read; identity injection, wrong types, cross-tenant reads, and writes rejected',
    'agents/lessons/scoped-approvals.md':
        'exact approved action ready; modification, expiry, stale version, revocation, rejection stop',
    'agents/lessons/state-memory-recovery.md':
        'lost acknowledgment reconciled with one effect; changed-payload key reuse rejected',
    'agent-frameworks/lessons/workflow-abstractions.md':
        'plain workflow: answered, no_evidence, no_evidence',
    'agent-frameworks/lessons/langchain-composition.md':
        'LangChain matches plain workflow on supported, missing, and wrong-tenant requests',
    'agent-frameworks/lessons/langgraph-checkpoints.md':
        'LangGraph pauses, resumes, rejects, and abstains; review node replays on resume',
    'agent-frameworks/lessons/framework-selection-portability.md':
        'two fixture adapters agree; truncated output stays incomplete; duplicate receipt IDs dedupe',
}


def main():
    files = {str(path.relative_to(BASE))
             for folder in ['rag', 'agents', 'agent-frameworks']
             for path in (BASE / folder / 'lessons').glob('*.md')}
    assert files == set(EXPECTED), 'Review executable lesson inventory'
    # Remove inherited provider/tracing configuration from local verification.
    environment = {key: value for key, value in os.environ.items()
                   if not key.startswith(('OPENAI_', 'ANTHROPIC_', 'LANGCHAIN_', 'LANGSMITH_'))}
    environment.update(LANGSMITH_TRACING='false', LANGCHAIN_TRACING_V2='false')
    for filename, expected in EXPECTED.items():
        blocks = re.findall(r'^```python\n(.*?)^```', (BASE / filename).read_text(),
                            flags=re.M | re.S)
        assert len(blocks) == 1, f'Review executable fences: {filename}'
        # Block accidental network calls, including a future framework tracing change.
        guard = (
            'import socket\n'
            'def no_network(*args, **kwargs):\n'
            '    raise RuntimeError("Network disabled during lesson verification")\n'
            'socket.socket.connect = no_network\n'
            'socket.socket.connect_ex = no_network\n'
            'socket.create_connection = no_network\n'
        )
        result = subprocess.run(
            [sys.executable, '-I', '-c', guard + blocks[0]], env=environment,
            capture_output=True, text=True, timeout=30, check=False,
        )
        assert result.returncode == 0, f'{filename}:\n{result.stderr}'
        assert result.stdout.strip() == expected, (
            f'{filename}: expected {expected!r}; got {result.stdout!r}'
        )
        print(f'PASS {filename}')
    print(f'Verified {len(EXPECTED)} independent examples and outputs with network disabled.')


if __name__ == '__main__':
    main()

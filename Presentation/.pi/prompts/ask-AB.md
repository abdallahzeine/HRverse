---
description: Ask a question and get a direct answer using repo context or official docs when needed
argument-hint: "<question>"
---
Answer this question:

$ARGUMENTS

Rules:
- Do not edit files unless explicitly asked.
- If the answer depends on this repo, inspect the relevant files before answering and cite paths.
- If the answer depends on a library/framework/tool/cloud API, use Context7/find-docs for current official docs. Do not rely on internal memory for API details.
- If docs are unavailable, say so; use installed/source code only when needed and cite file paths.
- Ask clarifying questions only when a safe answer is impossible; otherwise state assumptions.

Return a concise answer with references for factual/library claims.

---
description: Work on LangChain, LangGraph, or Deep Agents tasks with current docs, skills, and minimal code
argument-hint: "[task/question]"
---
LangChain / LangGraph / Deep Agents task:

$ARGUMENTS

Rules:
- First load/use the ecosystem-primer skill, then the narrow relevant skills: langchain-dependencies, langchain-fundamentals, langchain-middleware, langchain-rag, langgraph-cli, langgraph-fundamentals, langgraph-human-in-the-loop, langgraph-persistence, deep-agents-core, deep-agents-memory, deep-agents-orchestration, or managed-deep-agents.
- Use Context7/find-docs for current official LangChain, LangGraph, and Deep Agents docs before API/config/version advice or code. Do not rely on internal memory for signatures.
- Inspect this repo before changing code; follow existing architecture, package manager, and lockfiles.
- For dependency/setup work, check existing pyproject/package.json/lockfiles first; do not add packages unless required.
- Implement the smallest correct change, or give the direct answer if no code was asked.
- For non-trivial code, add/run one focused check.

Return:
- docs/skills consulted
- changed files or direct answer
- validation/evidence
- unanswered questions or version assumptions

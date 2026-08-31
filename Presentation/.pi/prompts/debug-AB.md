---
description: Diagnose and fix a bug from root cause with focused validation
argument-hint: "<symptom or failing command>"
---
Debug this.

Symptom / request: $ARGUMENTS

Use the diagnosing-bugs skill if available.

Process:
- Reproduce or identify the failing path first; capture exact error/output.
- Trace the real flow end to end. Grep every caller before changing a shared function.
- Fix the root cause in the shared/narrowest correct place, not only the reported symptom.
- Use Context7/find-docs for library-specific behavior or errors; cite docs/source when relevant.
- Make the smallest safe change. Do not add logging, retries, wrappers, or dependencies unless they prove the root cause/fix.
- Add or update one focused regression check for non-trivial bugs, then run the smallest relevant validation.

Return:
- root cause
- fix made
- validation evidence
- any remaining risk

# Development Workflow

Follow this structured development lifecycle for all non-trivial changes:

1. **Brainstorm** — Explore approaches and trade-offs before committing to a solution
2. **Plan** — Create a detailed implementation plan with clear steps and acceptance criteria
3. **Implement** — Write code following the plan, keeping changes focused and incremental
4. **Test** — Verify changes with appropriate tests (unit, integration, e2e as needed)
5. **Review** — Review code for correctness, security, performance, and maintainability

## Principles

- Prefer simple, focused changes over large refactors
- Keep PRs small and reviewable (under 400 lines when possible)
- Write tests alongside implementation, not after
- Fix bugs at the root cause, not with workarounds
- Leave the codebase better than you found it, but don't gold-plate

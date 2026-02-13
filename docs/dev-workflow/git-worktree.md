# Git Worktree

## Bare Clone

A bare clone keeps things clean — there's no default working directory, and every branch lives in its own worktree.

```bash
# Clone as bare repo
git clone --bare https://github.com/<user>/<repo>.git <repo>.git
cd <repo>.git

# Fix remote fetch config (bare clones don't set this by default)
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git fetch origin

# Create worktrees
git worktree add ../main main
git worktree add ../develop develop
git worktree add ../feature/my-feature -b feature/my-feature
```

**Resulting directory structure:**

```
<repo>.git/              # bare repo (metadata only)
main/                    # worktree → main branch
develop/                 # worktree → develop branch
feature/
  my-feature/            # worktree → feature/my-feature branch
```

## Daily Workflow

1. Creating a new feature branch

```bash
cd <repo>.git  # or your main repo directory
git worktree add ../feature/my-feature -b feature/my-feature
cd ../feature/my-feature
```

2. Working across branches in parallel

```bash
# Hotfix on main — no need to stash or switch
cd ../main
git add . && git commit -m "hotfix: fix critical bug"
git push origin main

# Resume feature work — just cd
cd ../feature/my-feature
# ... continue working ...
```

3. Cleaning up

```bash
# When done with a feature branch
cd <repo>.git
git worktree remove ../feature/my-feature

# If you already deleted the directory manually, clean up references
git worktree prune

# Or remove and delete the branch in one go
git worktree remove ../feature/my-feature
git branch -d feature/my-feature  # or -D to force delete
```

## Best Practices

1. **Use a bare clone for worktree-heavy workflows.** It avoids confusion about which directory is the "main" checkout and keeps the repo metadata separate from all working directories.

2. **Adopt a consistent directory naming convention.** Mirror branch names in your folder structure (e.g., `feature/`, `bugfix/`, `release/`) so it's easy to find the right worktree.

3. **Never manually delete a worktree directory.** Always use `git worktree remove` so Git can clean up its internal references. If you do accidentally delete a folder, run `git worktree prune`.

4. **One branch per worktree.** Git enforces this — you cannot check out the same branch in two worktrees. If you need a copy, create a new branch.

5. **Keep long-lived worktrees for `main` and `develop`.** Create and destroy feature worktrees as needed, but keep stable branches always available.

6. **Run builds and tests in isolated worktrees.** You can run a full test suite in one worktree while continuing to code in another — no interference.

7. **Set up shared tooling per worktree.** Remember that each worktree has its own working directory, so dependencies (e.g., `node_modules`, virtual environments) need to be installed per worktree. Consider using symlinks or scripts to reduce duplication.

8. **Use `git worktree lock`** to prevent accidental removal of worktrees stored on external or network drives:

   ```bash
   git worktree lock ../feature/my-feature --reason "work in progress"
   git worktree unlock ../feature/my-feature
   ```

## Common Commands Reference

| Command                                   | Description                                  |
| ----------------------------------------- | -------------------------------------------- |
| `git worktree add <path> <branch>`        | Create a new worktree for an existing branch |
| `git worktree add <path> -b <new-branch>` | Create a new worktree with a new branch      |
| `git worktree list`                       | List all worktrees                           |
| `git worktree remove <path>`              | Remove a worktree                            |
| `git worktree prune`                      | Clean up stale worktree references           |
| `git worktree lock <path>`                | Prevent a worktree from being pruned         |
| `git worktree unlock <path>`              | Unlock a previously locked worktree          |
| `git worktree move <path> <new-path>`     | Move a worktree to a new location            |

## When to Use Git Worktree

- **Parallel development:** Working on a feature while reviewing a PR on another branch.
- **Hotfixes:** Quickly patch `main` without disrupting your feature branch state.
- **Long-running tasks:** Run tests or builds in one worktree while coding in another.
- **Code reviews:** Check out a colleague's branch in a separate directory without touching your work.

## When NOT to Use Git Worktree

- **Simple, linear workflows:** If you rarely switch branches, `git switch` is simpler.
- **Disk-constrained environments:** Each worktree is a full copy of the working directory.
- **Monorepos with heavy dependencies:** Installing dependencies per worktree can be costly.

#!/bin/sh
# Claude Code statusLine command - robbyrussell theme aesthetic

input=$(cat)
cwd=$(echo "$input" | jq -r '.workspace.current_dir // .cwd // empty')

# Extract JSON fields
model=$(echo "$input"        | jq -r '.model.display_name // empty')
used_pct=$(echo "$input"     | jq -r '.context_window.used_percentage // empty')
lines_added=$(echo "$input"  | jq -r '.cost.total_lines_added // empty')
lines_removed=$(echo "$input"| jq -r '.cost.total_lines_removed // empty')

# Directory basename
[ -z "$cwd" ] && cwd="$PWD"
dir_name=$(basename "$cwd")

# Git info — single porcelain call covers branch + file counts
git_branch=""
git_staged=0
git_modified=0
git_ahead=0
git_behind=0
git_protected=0
if git -C "$cwd" rev-parse --is-inside-work-tree --no-optional-locks >/dev/null 2>&1; then
  git_branch=$(git -C "$cwd" symbolic-ref --short HEAD 2>/dev/null \
               || git -C "$cwd" rev-parse --short HEAD 2>/dev/null)
  # Protected branch check
  case "$git_branch" in main|master|production|release) git_protected=1 ;; esac
  # Ahead/behind remote
  upstream=$(git -C "$cwd" rev-parse --abbrev-ref '@{upstream}' 2>/dev/null)
  if [ -n "$upstream" ]; then
    lr=$(git -C "$cwd" rev-list --left-right --count HEAD..."$upstream" 2>/dev/null)
    git_ahead=$(echo "$lr" | cut -f1)
    git_behind=$(echo "$lr" | cut -f2)
  fi
  while IFS= read -r line; do
    xy="${line%% *}"
    x="${xy%?}"   # index (staged)
    y="${xy#?}"   # worktree (unstaged)
    case "$x" in [MADRC]) git_staged=$((git_staged + 1)) ;; esac
    case "$y" in [MD])    git_modified=$((git_modified + 1)) ;; esac
  done <<EOF
$(git -C "$cwd" --no-optional-locks status --porcelain 2>/dev/null)
EOF
fi


# Remaining seconds from ISO 8601 resets_at timestamp
remaining_secs() {
  reset_at="$1"
  [ -z "$reset_at" ] || [ "$reset_at" = "null" ] && printf '0' && return
  echo "\"$reset_at\"" | jq -r '
    split("+")[0] | split(".")[0] | . + "Z" |
    fromdateiso8601 as $reset |
    ($reset - now) | if . < 0 then 0 else . end | floor
  ' 2>/dev/null || printf '0'
}


# Render usage bar: usage_bar <util_pct> <time_pct> <fill_color>
# 10-char bar with ◼ for fill, ◻ for empty, ▾ as time-position caret
usage_bar() {
  u="${1:-0}"; t="${2:-0}"; fc="$3"
  w=10
  fill=$((u * w / 100)); [ "$fill" -gt "$w" ] && fill="$w"
  caret=$((t * w / 100)); [ "$caret" -ge "$w" ] && caret=$((w - 1))
  [ "$caret" -lt 0 ] && caret=0
  i=0; bar=""
  while [ "$i" -lt "$w" ]; do
    if [ "$i" -eq "$caret" ] && [ "$t" -gt 0 ]; then
      bar="${bar}▾"
    elif [ "$i" -lt "$fill" ]; then
      bar="${bar}◼"
    else
      bar="${bar}◻"
    fi
    i=$((i + 1))
  done
  printf '%b' "${fc}${bar}${RESET}"
}

# ── Pro/Max usage (cached, refreshes every 5 min) ────────────────────────────
USAGE_CACHE="/tmp/claude-usage-cache.json"
USAGE_MAX_AGE=300  # seconds
usage_5h=""
usage_7d=""
reset_5h=""
reset_7d=""
sub_tier=""

_creds_json=$(security find-generic-password -s "Claude Code-credentials" -w 2>/dev/null)

# Parse subscription tier from keychain (e.g., "default_claude_max_5x" → "Max 5x")
_raw_tier=$(echo "$_creds_json" | jq -r '.claudeAiOauth.rateLimitTier // empty' 2>/dev/null)
case "$_raw_tier" in
  *max_20x*) sub_tier="Max 20x" ;;
  *max_5x*)  sub_tier="Max 5x" ;;
  *max*)     sub_tier="Max" ;;
  *pro*)     sub_tier="Pro" ;;
  *)         # fallback to subscriptionType
    _sub_type=$(echo "$_creds_json" | jq -r '.claudeAiOauth.subscriptionType // empty' 2>/dev/null)
    case "$_sub_type" in
      team)       sub_tier="Team" ;;
      enterprise) sub_tier="Enterprise" ;;
      *)          [ -n "$_sub_type" ] && sub_tier="$_sub_type" ;;
    esac
    ;;
esac

_fetch_usage() {
  token=$(echo "$_creds_json" \
    | jq -r '.claudeAiOauth.accessToken // empty' 2>/dev/null)
  [ -z "$token" ] && return 1
  curl -sf --max-time 3 https://api.anthropic.com/api/oauth/usage \
    -H "Authorization: Bearer $token" \
    -H "anthropic-beta: oauth-2025-04-20" > "$USAGE_CACHE.tmp" 2>/dev/null \
    && mv "$USAGE_CACHE.tmp" "$USAGE_CACHE"
}

# Refresh cache if stale or missing
if [ -f "$USAGE_CACHE" ]; then
  case "$(uname)" in
    Darwin) age=$(( $(date +%s) - $(stat -f %m "$USAGE_CACHE") )) ;;
    *)      age=$(( $(date +%s) - $(stat -c %Y "$USAGE_CACHE") )) ;;
  esac
  [ "$age" -ge "$USAGE_MAX_AGE" ] && _fetch_usage &
else
  _fetch_usage &
fi

if [ -f "$USAGE_CACHE" ]; then
  usage_5h=$(jq -r '.five_hour.utilization // empty' "$USAGE_CACHE" 2>/dev/null)
  usage_7d=$(jq -r '.seven_day.utilization // empty' "$USAGE_CACHE" 2>/dev/null)
  reset_5h=$(jq -r '.five_hour.resets_at // empty' "$USAGE_CACHE" 2>/dev/null)
  reset_7d=$(jq -r '.seven_day.resets_at // empty' "$USAGE_CACHE" 2>/dev/null)
fi

# ANSI colors (robbyrussell palette)
CYAN='\033[0;36m'
BLUE='\033[1;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
ORANGE='\033[38;5;208m'
GREEN='\033[0;32m'
MAGENTA='\033[0;35m'
DIM='\033[2m'
RESET='\033[0m'

# ── Line 1: dir  git:(branch)  +staged ~modified ─────────────────────────────
line1="${CYAN}${dir_name}${RESET}"

if [ -n "$git_branch" ]; then
  if [ "$git_protected" -eq 1 ]; then
    line1="${line1} ${RED}⚠ git:(${git_branch})${RESET}"
  else
    line1="${line1} ${BLUE}git:(${RED}${git_branch}${BLUE})${RESET}"
  fi
  git_info=""
  [ "$git_staged" -gt 0 ] || [ "$git_modified" -gt 0 ] && git_info="${YELLOW}+${git_staged} ~${git_modified}${RESET}"
  [ "$git_ahead" -gt 0 ] && git_info="${git_info:+${git_info} }${GREEN}↑${git_ahead}${RESET}"
  [ "$git_behind" -gt 0 ] && git_info="${git_info:+${git_info} }${RED}↓${git_behind}${RESET}"
  [ -n "$git_info" ] && line1="${line1} ${git_info}"
fi

# ── Line 2: model  ctx  usage  lines  session ────────────────────────────────
line2=""

# Model + tier
if [ -n "$model" ]; then
  line2="🤖 ${MAGENTA}${model}${RESET}"
  [ -n "$sub_tier" ] && line2="${line2} ${DIM}(${sub_tier})${RESET}"
fi

# Context usage
if [ -n "$used_pct" ]; then
  used_int="${used_pct%%.*}"
  [ -n "$line2" ] && line2="${line2}  "
  if [ "${used_int:-0}" -ge 75 ]; then
    line2="${line2}🪟 ${RED}${used_int}%${RESET}"
  else
    line2="${line2}🪟 ${DIM}${used_int}%${RESET}"
  fi
fi

# Pro/Max usage (5h and 7d bars with time-position caret)
if [ -n "$usage_5h" ] || [ -n "$usage_7d" ]; then
  [ -n "$line2" ] && line2="${line2}  "
  u5="${usage_5h:-0}"; u5_int="${u5%%.*}"
  u7="${usage_7d:-0}"; u7_int="${u7%%.*}"
  rem5=$(remaining_secs "$reset_5h")
  rem7=$(remaining_secs "$reset_7d")
  # time_pct = how far through the window (elapsed / total * 100)
  if [ "$rem5" -gt 0 ] 2>/dev/null; then
    t5_pct=$(( (18000 - rem5) * 100 / 18000 ))
  else t5_pct=0; fi
  if [ "$rem7" -gt 0 ] 2>/dev/null; then
    t7_pct=$(( (604800 - rem7) * 100 / 604800 ))
  else t7_pct=0; fi
  if [ "${u5_int}" -ge 75 ]; then c5="$RED"; elif [ "${u5_int}" -gt 0 ] && [ "${u5_int}" -ge "${t5_pct}" ]; then c5="$ORANGE"; else c5="$DIM"; fi
  if [ "${u7_int}" -ge 75 ]; then c7="$RED"; elif [ "${u7_int}" -gt 0 ] && [ "${u7_int}" -ge "${t7_pct}" ]; then c7="$ORANGE"; else c7="$DIM"; fi
  bar5=$(usage_bar "$u5_int" "$t5_pct" "$c5")
  bar7=$(usage_bar "$u7_int" "$t7_pct" "$c7")
  line2="${line2}⚡ 5h ${bar5}  7d ${bar7}"
fi

# Lines added/removed
if [ -n "$lines_added" ] || [ -n "$lines_removed" ]; then
  la="${lines_added:-0}"
  lr="${lines_removed:-0}"
  [ -n "$line2" ] && line2="${line2}  "
  line2="${line2}✏️ ${GREEN}+${la}${RESET}/${RED}-${lr}${RESET}"
fi


# ── Output ─────────────────────────────────────────────────────────────────────
if [ -n "$line2" ]; then
  printf '%b' "${line1}  ${line2}"
else
  printf '%b' "${line1}"
fi
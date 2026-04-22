#!/usr/bin/env bash
# ============================================================
#  EduAsset CMS — 统一测试入口脚本
#
#  用法：
#    ./scripts/run-tests.sh              # 全部测试（冒烟 + UAT Playwright）
#    ./scripts/run-tests.sh smoke        # 仅冒烟测试
#    ./scripts/run-tests.sh uat          # 仅 Playwright UAT
#    ./scripts/run-tests.sh uat --headed # Playwright 有头模式
#
#  环境变量：
#    BASE_URL    测试目标地址（默认 http://localhost:8081）
#    PUBLIC_HOST presigned URL 断言用公网主机名（未设置时跳过主机名匹配）
#    CMS_HOST    start-uat.sh 启动信息中显示的主机名
#
#  依赖：curl、Node.js v18+、pnpm（UAT 需 Playwright 已安装）
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

BASE_URL="${BASE_URL:-http://localhost:8081}"
MODE="${1:-all}"
shift || true   # 剩余参数透传给 playwright

GREEN="\033[32m"; RED="\033[31m"; CYAN="\033[36m"; RESET="\033[0m"
info()  { echo -e "${CYAN}[INFO]${RESET}  $*"; }
ok()    { echo -e "${GREEN}[OK]${RESET}    $*"; }
fail()  { echo -e "${RED}[FAIL]${RESET}  $*" >&2; }

SMOKE_FAILED=0
UAT_FAILED=0

# ── 冒烟测试 ──────────────────────────────────────────────────
run_smoke() {
  info "冒烟测试 → ${BASE_URL}"
  if BASE_URL="$BASE_URL" bash "$ROOT_DIR/uat/smoke-test.sh"; then
    ok "冒烟测试通过"
  else
    SMOKE_FAILED=1
    fail "冒烟测试失败"
  fi
}

# ── Playwright UAT ────────────────────────────────────────────
run_uat() {
  info "Playwright UAT → ${BASE_URL}"
  cd "$ROOT_DIR/uat"
  if BASE_URL="$BASE_URL" ${PNPM:-pnpm} exec playwright test "$@"; then
    ok "Playwright UAT 通过"
  else
    UAT_FAILED=1
    fail "Playwright UAT 失败"
  fi
  cd "$ROOT_DIR"
}

# ── 主流程 ───────────────────────────────────────────────────
case "$MODE" in
  smoke)    run_smoke ;;
  uat)      run_uat "$@" ;;
  all|*)
    run_smoke
    run_uat "$@"
    ;;
esac

# ── 汇总 ─────────────────────────────────────────────────────
echo ""
if [[ $SMOKE_FAILED -eq 0 && $UAT_FAILED -eq 0 ]]; then
  ok "所有测试通过 ✅"
  exit 0
else
  fail "部分测试失败（smoke=$SMOKE_FAILED, uat=$UAT_FAILED）❌"
  exit 1
fi

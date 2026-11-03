# ハウスのようす（family-house）

母と妻向けの、見るだけのハウス画面。今のハウスの状態・今月の収穫箱数・病気と害虫が出ている場所（マップの印をタップで名前と日付）。

- 1 ファイル（`index.html`）・外部ライブラリなし・ログインなし（Supabase の公開用キーだけ）
- デザインは Codex が仕上げる → `DESIGN_BRIEF.md`
- ローカル: `python3 -m http.server 8790 --directory family-house`（`.claude/launch.json` の `family-house`）

## 使うデータ
- ① `get_environment_recent`（環境モニターと同じ）
- ① `get_harvest_month_summary` — **pepper-advisor の `supabase/migrations/0040_family_harvest_month.sql` を ① に流すまで「準備中」**
- ② `croppings` / `pest_observations`（病害虫マップと同じ。読むだけ）

## 公開について
- 公開ページなので、URL を知っている人は 今のハウスの値・今月の箱数・病害虫の場所 を見られる（日誌の中身・記録者名・メモは出ない）
- `noindex` を付けている

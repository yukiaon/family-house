# ハウスのようす（family-house）

公開: https://yukiaon.github.io/family-house/

母と妻向けの、見るだけのハウス画面。今のハウスの状態・今月の収穫箱数・病気と害虫が出ている場所（マップの印をタップで名前と日付）。

- 1 ファイル（`index.html`）・外部ライブラリなし・ログインなし（Supabase の公開用キーだけ）
- **引き継ぎ書 → `HANDOFF.md`**（今の状態・触ってよい所・守ること）
- デザインは Codex が仕上げる → `DESIGN_BRIEF.md`
- ローカル: `python3 -m http.server 8790 --directory family-house`（`.claude/launch.json` の `family-house`）

## ホーム画面に追加（アプリのように使う）
- Android（Chrome）: ページを開く → 右上の「︙」→「ホーム画面に追加」（または「アプリをインストール」）
- iPhone（Safari）: ページを開く → 下の共有ボタン →「ホーム画面に追加」
- アイコンは `icons/icon.svg` が元。PNG は macOS の `qlmanage -t -s <大きさ>` + `sips` で作った

## 使うデータ
- ① `get_environment_recent`（環境モニターと同じ）
- ① `get_harvest_month_summary`（pepper-advisor の 0040。2026-11-03 適用済み）
- ② `croppings` / `pest_observations`（病害虫マップと同じ。読むだけ）

## 公開について
- 公開ページなので、URL を知っている人は 今のハウスの値・今月の箱数・病害虫の場所 を見られる（日誌の中身・記録者名・メモは出ない）
- `noindex` を付けている

# 引き継ぎ書 — ハウスのようす（family-house）

> 作成: 2026-11-03 by Claude Code ／ 次の担当: **Codex（デザインの仕上げ）**
> デザインの細かい依頼は [`DESIGN_BRIEF.md`](DESIGN_BRIEF.md)。このファイルは「今どうなっているか・どう触るか」をまとめたもの。

---

## 1. ひとことで

母と妻が **スマホで見るだけ** のハウス画面。開いて数秒で次の 3 つが分かる。

1. **今のハウス** — 一言（「ちょうどいい状態です」「湿気が多い」など）＋ 気温・湿度・土の水分
2. **今月の収穫** — 今月の箱数（と去年の同じ月の箱数）
3. **病気・害虫の場所** — 5 棟の全体マップに印。**タップで名前・見つけた日・場所・量**

ログインなし・入力なし。**母が見るので文字は大きめ（これより小さくしない）**。

## 2. 今の状態

| 項目 | 状態 |
|---|---|
| 公開 URL | https://yukiaon.github.io/family-house/ （GitHub Pages・main の `/`。push すると 1〜2 分で反映） |
| リポジトリ | `yukiaon/family-house`（**公開リポジトリ**）・ローカル `~/Documents/ai-workspace/agri-apps/family-house` |
| 最新の変更 | 2026-11-03 Codex: 家族向けデザイン仕上げ（実際のコミットは `git log -1` を参照） |
| 機能 | 3 つとも本番データで動作確認済み（375px・横スクロールなし・コンソールエラーなし） |
| デザイン | **完了**: 環境モニターと共通の淡い背景・白いカード、丸ゴシック・ミント/桃色・かごの SVG |
| 実機確認 | **未**（母・妻のスマホ） |
| ホーム画面追加（PWA） | 済（2026-11-03）。`manifest.webmanifest`・`icons/`・`sw.js`。画面だけ端末に置き、データは置かない |

## 3. ファイル

```
family-house/
├── index.html       ★全部入り（CSS + HTML + JS、約 440 行、外部ライブラリなし）
├── DESIGN_BRIEF.md  Codex へのデザイン依頼（変えてよい所・変えない所）
├── HANDOFF.md       このファイル
├── README.md
├── manifest.webmanifest  PWA（名前「ハウスのようす」・ホーム画面では「ハウス」）
├── sw.js            service worker。画面だけ端末に置く（Supabase のデータは置かない）。**画面のファイルを増やしたら SHELL に足し、CACHE の版を上げる**
└── icons/           icon.svg（元）→ icon-192 / icon-512（maskable 兼用）/ apple-touch-icon（180）
```

ローカル確認:

```bash
python3 -m http.server 8790 --directory ~/Documents/ai-workspace/agri-apps/family-house
```

→ http://localhost:8790 （`agri-apps/.claude/launch.json` の `family-house` でも起動できる）。ビルドは不要。

## 4. index.html の中身（どこを触ればよいか）

| 場所 | 役割 | デザインで触ってよいか |
|---|---|---|
| `<style>` の `:root` | 色（ライト／ダーク）。`--ok` 緑・`--warn` 橙・`--bad` 赤 | ◯ 自由に。ただしコントラストは高めに |
| `<style>` のフォントサイズ | 本文 21px・数字 28px・一言 27px・箱数 56px・補足 18px | ◯ **大きくするのは可・小さくしない** |
| `<main>` の 3 つの `section.card` | 画面の構成。id（`envHeadline` `envRows` `harvestBoxes` `mapWrap` `pestList` など）を JS が使う | ◯ 見た目・並びは自由。**id は残す** |
| `ENV_URL` / `FARM_URL` / `*_KEY` | Supabase ①②の接続先と**公開用キー** | ✕ |
| `TARGETS` / `tempWord` / `humWord` / `soilWord` / `SOUTH_HUM_OFFSET_UNTIL` | 判定の基準。**環境モニター（house-monitor）と同じ値** | ✕ 言葉の言い回しは相談の上で可、**数値は変えない** |
| `PESTS` | 病害虫の名前と色（pest-map と同じ） | △ 色の微調整は可 |
| `MAP` / `houseRect` / `drawMapBase` | マップの枠・棟名・方位などの描画（SVG、viewBox 500×600） | ◯ 見た目は自由 |
| `aisleX` / `pinPos` | 記録を地図上の位置にする計算（**pest-map と同じ比率**） | ✕ |
| `renderPests` / `openPin` | 印の作成（同じ場所はまとめて件数表示）とタップ時のポップアップ（`<dialog>`） | ◯ 見た目は自由。中身は名前・日付・場所・量 |
| `loadAll` | 3 つを並行で読む。5 分ごと＋画面に戻った時に読み直し | △ |

## 5. データ（読むだけ）

| 表示 | Supabase | 取り方 | 返る中身 |
|---|---|---|---|
| 今のハウス | ① `gjagzyexefnxnkbgueza` | `rpc/get_environment_recent`（`p_hours: 1`、新しい順） | esp32_01=北の気温湿度 / 02=南 / 03=土 |
| 今月の収穫 | ① | `rpc/get_harvest_month_summary`（**0040・2026-11-03 適用済み**） | `month` `this_boxes` `last_year_boxes` `last_year_source`(ja/diary) `last_recorded` |
| 病害虫 | ② `jckjdfvoqsgqvhornnjs` | `croppings?is_active=eq.true` → `pest_observations?resolved_at=is.null` | 日時・棟・通路・前後・番目・種類・量 |

- 0040 の SQL は `pepper-advisor/supabase/migrations/0040_family_harvest_month.sql`（PR #51 マージ済み）。計算は参謀の `getMonthVsLastYear` と同じ（午前+午後の箱数、去年は JA の kg ÷ 1箱あたり kg を優先）
- 去年の数字は **1 か月分の合計**。月の途中で少なく見えるのは普通なので、「負けている」ように見せない

## 6. 守ること（安全）

- **読むだけ**。書き込み・削除の処理を足さない
- API の値は **`textContent`** で出す（`innerHTML` に入れない）
- CSP（`<meta http-equiv="Content-Security-Policy">`）の `connect-src` は Supabase 2 つだけ。**外部 CDN・Web フォント・解析タグは足さない**（足すなら CSP も直して、オーナーに確認）
- 個人情報は出さない。記録者名・メモは取得していない（取得も表示も足さない）
- 公開リポジトリなので、**秘密のキーを絶対に入れない**（今あるのは公開用の publishable key だけ）
- `noindex` を外さない

## 7. 同じ基準が他にもある（片方だけ変えない）

- 気温・湿度・土壌水分の判定 → `house-monitor/index.html`（`PEPPER_TARGETS` / `getSoilStatus`）
  - 土壌水分 65〜90% はオーナーが灌水の基準に使っている。変えない
- 南側の湿度補正 `SOUTH_HUM_OFFSET_UNTIL` → house-monitor / pest-map / 参謀 `env-targets.ts` / 0023 SQL / kishaku-calc
- マップの位置・病害虫の色 → `pest-map/index.html`（`drawSingleHouseMini` / `PESTS`）

## 8. 次にやること

1. **Codex**: デザイン仕上げ・320/375/430px のライト/ダーク表示を確認済み。main に反映し、公開ページも確認する
2. **オーナー**: 母・妻のスマホで開いてもらい、文字の大きさ・分かりやすさを聞く
3. ~~ホーム画面に追加できるように manifest とアイコン~~ 済（PWA）
4. （気になる点）日誌の持ち主は「最後に日誌を書いた人」で決めている。日誌を書く人が増えたら 0040 を見直す

## 9. 作業を終えたら

- `~/.ai-sync/projects/agri-apps/SESSION_STATE.md` を更新し、`~/.ai-sync/sync.sh` で push
- 公開ページを 375px 幅で開き、3 つの表示・印のタップ・横スクロールなしを確認

## 10. Codex デザイン仕上げ（2026-11-03）

- 環境モニターのグレー背景・白い角丸カード・緑のアクセントを継承。丸ゴシックは端末内の Hiragino Maru / BIZ UD / Yu Gothic 等で表示し、外部配信フォント・依存ライブラリは追加しない。Android 等で丸ゴシックがない場合は端末の日本語フォントにフォールバック。
- 本文 21px・見出し 24px・一言 27px を維持。環境の数字は 34px、箱数は 64px に拡大。カード間 20px・カード内 22px を基本に、北/南の補足を独立行にした。
- 収穫は今月と去年を別行にし、小さなかごの SVG を追加。比較の優劣は出さない。
- 地図は位置計算を維持し、暗い表示にも対応する配色。印はタップ領域 44px を維持。一覧は折りたたみ、各記録からも同じ詳細を開ける。
- 確認: JavaScript 構文・git diff --check。320/375/430px、ライト/ダークとも横スクロールなし、見出し1行、印9か所・44px以上。実データの環境/収穫/病害虫・印の詳細表示をブラウザ確認。実機は未確認。
- 安全: 判定値・pinPos/aisleX・接続先・CSP・noindex は維持。API値は textContent、読むだけ。新しい秘密情報・個人情報・保存先・権限変更なし。

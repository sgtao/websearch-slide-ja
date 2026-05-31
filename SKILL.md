---
name: slide-generator
description: >
  GitHubやX（Twitter）などのネット上の公開情報（人気Skill、使い方Tips、技術トレンド等）を
  Web検索で収集し、スライド形式のHTMLページとして生成するスキル。
  「スライドを作って」「プレゼン資料にして」「HTMLスライドで説明して」「〇〇についてスライドにまとめて」
  「GitHubのトレンドをスライドで」「Xで話題の〇〇をスライドに」などのフレーズが含まれる場合は必ずこのスキルを使う。
  ネット情報の収集 → 構造化 → HTMLスライド生成まで一気通貫で行う。
---

# Slide Generator Skill

GitHubやX（Twitter）等のネット上の情報を調査・収集し、スライド形式のHTMLページを生成するスキル。

---

## ワークフロー概要

```
1. テーマ確認・情報収集計画
2. Web検索（GitHub / X / 技術ブログ等）
3. 情報の構造化・スライド構成の設計
4. HTMLスライド生成
5. ファイル出力・提示
```

---

## Step 1: テーマ確認

ユーザーから以下を把握する（会話から読み取れる場合はスキップ）。

| 項目 | 内容 |
|------|------|
| テーマ | 何についてのスライドか |
| 対象読者 | エンジニア向け／ビジネス向け／汎用 |
| スライド枚数 | 指定がなければ 6〜10枚を目安 |
| 情報源の優先度 | GitHub優先 / X優先 / 両方 |

---

## Step 2: Web検索・情報収集

### 検索戦略

テーマに応じて以下の検索クエリを組み合わせる。

**GitHub情報の収集**
- `{テーマ} github stars trending`
- `{テーマ} awesome list github`
- `{テーマ} skill prompt example github`

**X（Twitter）情報の収集**
- `{テーマ} site:twitter.com OR site:x.com`
- `{テーマ} tips tricks popular 2024 2025`

**技術ブログ・解説記事**
- `{テーマ} best practices tutorial`
- `{テーマ} 使い方 まとめ`

### 収集する情報の種類

- 人気リポジトリ・スター数・用途
- 好評を得ているTips・テクニック
- よくある使い方パターン・ユースケース
- トレンドや最新動向
- 実例・スクリーンショット情報

### 注意事項

- **最低3〜5回の検索**でデータを集める
- 情報の新鮮度を確認（できるだけ2024〜2025年の情報を優先）
- GitHubのスター数・フォーク数は信頼性の指標として活用
- X上の情報は「引用数・いいね数」が多いものを優先

---

## Step 3: スライド構成の設計

収集した情報を以下の構成に整理する。

### 標準構成テンプレート（6〜10枚）

```
Slide 1: タイトルスライド
  - タイトル、サブタイトル、出典（GitHub/X等）

Slide 2: 概要・背景
  - なぜこのテーマが重要か（数字・トレンドで裏付け）

Slide 3〜N-2: メインコンテンツ（テーマごとに柔軟に設計）
  例）
  - トップリポジトリ / 人気Skill紹介
  - 使い方パターン / Tips集
  - ユースケース事例
  - 比較・対比

Slide N-1: まとめ・ポイント整理
  - 3〜5つのキーポイント

Slide N: 参考リンク・出典
  - 収集したURL一覧
```

---

## Step 4: HTMLスライド生成

### デザイン原則（シンプル・ミニマル）

- **フォント**: Noto Sans JP（Google Fonts）+ JetBrains Mono（コード）
- **アクセントカラー**: 1色のみ（例: `#2563EB` ブルー）
- **文字中心**: 箇条書き・番号リストを主体。図表は最小限
- **余白**: 広めに取り、読みやすさ優先

### スライドサイズ（固定 16:9）

各スライドは **960px × 540px の固定サイズ（16:9比率）** で生成する。
ページ全体はスライドを中央に配置し、ブラウザ幅に応じて `transform: scale()` でフィットさせる。

```css
/* 16:9固定サイズの実装パターン */
.slide-viewport {
  width: 960px;
  height: 540px;
  position: relative;
  /* JS で transform: scale(ratio) を動的適用 */
}
.slide-scaler {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  /* JS: transform: translate(-50%, -50%) scale(ratio) */
}
```

スケーリングJS（window.resizeで再計算）:
```js
function fitSlide() {
  const scaler = document.querySelector('.slide-scaler');
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const ratio = Math.min(vw / 960, vh / 540) * 0.92;
  scaler.style.transform = `translate(-50%, -50%) scale(${ratio})`;
}
window.addEventListener('resize', fitSlide);
fitSlide();
```

### ライト／ダークテーマ切り替え

HTML生成時に **ライト・ダーク両テーマのCSS変数** を定義し、右上のトグルボタンで切り替えられるようにする。
デフォルトはライトテーマ。OSのカラースキームに追従させる必要はない（手動切り替えのみ）。

```css
/* ライトテーマ（デフォルト） */
:root {
  --bg-body:    #F0F2F5;
  --bg-slide:   #FFFFFF;
  --bg-surface: #F8F9FA;
  --text-primary:   #1A1A1A;
  --text-secondary: #6B7280;
  --accent:         #2563EB;
  --accent-light:   #EFF6FF;
  --accent-dim:     #DBEAFE;
  --border:         #E5E7EB;
  --nav-bg:         rgba(0,0,0,0.6);
  --nav-text:       #FFFFFF;
  --progress-track: rgba(255,255,255,0.2);
}

/* ダークテーマ */
[data-theme="dark"] {
  --bg-body:    #0D1117;
  --bg-slide:   #161B22;
  --bg-surface: #21262D;
  --text-primary:   #E6EDF3;
  --text-secondary: #8B949E;
  --accent:         #58A6FF;
  --accent-light:   #1C2D3F;
  --accent-dim:     #1F3A57;
  --border:         #30363D;
  --nav-bg:         rgba(255,255,255,0.1);
  --nav-text:       #E6EDF3;
  --progress-track: rgba(255,255,255,0.1);
}
```

テーマトグルボタン（右上固定）:
```html
<button id="theme-toggle" onclick="toggleTheme()" title="テーマ切り替え">
  <span id="theme-icon">🌙</span>
</button>
```

```js
function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
  document.getElementById('theme-icon').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('slide-theme', isDark ? 'light' : 'dark');
}
// 初期化：保存済みテーマを復元
const saved = localStorage.getItem('slide-theme');
if (saved) {
  document.documentElement.dataset.theme = saved;
  document.getElementById('theme-icon').textContent = saved === 'dark' ? '☀️' : '🌙';
}
```

### 表示モード切り替え（ヒーロー ⇄ 一覧）

スライドを**「ヒーロースライダーモード」と「一覧表示モード」**で切り替えられるようにする。
テーマトグルの**右隣**にビューモードトグルを配置する。

| モード | 内容 |
|-------|------|
| **hero**（デフォルト） | 1スライドずつ中央に表示。左右矢印で遷移 |
| **list** | 全スライドを縦スクロールで順に表示。クリックで hero に戻りそのスライドへ |

`body[data-view="list"]` でCSSを切り替える方式が最もシンプル。
JS では `currentView` 変数で状態を管理し、`localStorage` に保存する。

```html
<!-- テーマトグルの右隣 -->
<div class="control-cluster">
  <button id="theme-toggle" onclick="toggleTheme()" title="テーマ切替">🌙</button>
  <button id="view-toggle"  onclick="toggleView()"  title="表示切替">☰</button>
</div>
```

```css
/* デフォルト = hero モード（既存スタイル） */
/* hero時は html, body に overflow: hidden を設定（既存のまま） */

/* 一覧モード：縦スクロールを有効化 */
html[data-view="list"], body[data-view="list"] {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  height: auto !important;
  min-height: 100vh;
}
body[data-view="list"] .slide-scaler {
  position: relative;
  top: auto; left: auto;
  width: 100%;
  height: auto;
  transform: none !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 72px 5vw 64px;  /* 上下＋左右5vwの余白 */
}

/* 一覧モードのスライド：レスポンシブ幅 + 16:9比率維持 */
body[data-view="list"] .slide {
  position: relative;
  inset: auto;
  /* 幅はウィンドウの90%を上限960pxまで */
  width: min(90vw, 960px);
  /* 16:9比率を維持（aspect-ratioで自動計算） */
  height: auto;
  aspect-ratio: 16 / 9;
  /* 重要：list時はpaddingをリセット（content-wrapが内部に持つ） */
  padding: 0 !important;
  /* はみ出しを必ず隠す */
  overflow: hidden;
  opacity: 1;
  transform: none;
  pointer-events: auto;
  cursor: pointer;
  flex-shrink: 0;
  transition: box-shadow 0.2s, transform 0.2s;
}

/* 内部コンテンツのラッパ：元のサイズ（960×540）を保ち、transform scale で縮小 */
body[data-view="list"] .slide-content-wrap {
  position: absolute;
  top: 0; left: 0;
  width: 960px;
  height: 540px;
  /* オリジナルの .slide が持っていた padding と flex 配置を引き継ぐ */
  padding: 52px 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform-origin: top left;
  box-sizing: border-box;
  /* JS: transform: scale(slide.clientWidth / 960) */
}

body[data-view="list"] .slide:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 70px rgba(0,0,0,0.4);
}
body[data-view="list"] .slide::after {
  /* スライド番号バッジ */
  content: attr(data-num);
  position: absolute;
  top: 12px; right: 16px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-secondary);
  background: var(--bg-surface);
  padding: 3px 8px;
  border-radius: 10px;
  border: 1px solid var(--border);
  z-index: 5;
}
body[data-view="list"] .nav-arrow,
body[data-view="list"] #slide-counter,
body[data-view="list"] #progress-bar {
  display: none;
}
```

**重要な実装ポイント**

1. **html・body 両方の overflow を上書き** — hero時は `overflow:hidden` が指定されているため、list時は両方に `!important` で `overflow-y: auto` を強制する
2. **`aspect-ratio: 16/9` + `width: min(90vw, 960px)`** — スライド枠は常にウィンドウ幅90%以下＆16:9比率を維持
3. **内部コンテンツは960px固定 + scale変換** — スライド内の文字サイズ・余白は960px基準で設計されているため、`.slide-inner` ラッパで scale して縮小する
4. 既存のスライドHTMLには `<section class="slide">` の中身を `<div class="slide-inner">...</div>` で囲む構造に変更が必要

```js
let currentView = 'hero';  // 'hero' | 'list'

function toggleView() {
  currentView = (currentView === 'hero') ? 'list' : 'hero';
  applyView();
  try { localStorage.setItem('slide-view', currentView); } catch(e) {}
}

function applyView() {
  /* html と body の両方に data-view を設定（overflow制御のため） */
  document.documentElement.dataset.view = currentView;
  document.body.dataset.view = currentView;
  document.getElementById('view-toggle').textContent =
    (currentView === 'hero') ? '☰' : '▭';

  if (currentView === 'hero') {
    fitSlide();
  } else {
    /* 一覧モード：各 .slide-inner を枠幅に合わせて scale */
    scaleListSlides();
  }
}

/* 一覧モード時の内部コンテンツのスケーリング */
function scaleListSlides() {
  /* DOMレイアウト確定後に clientWidth を取得（aspect-ratio計算待ち） */
  requestAnimationFrame(() => {
    document.querySelectorAll('.slide').forEach(slide => {
      /* 初回のみ：中身を .slide-content-wrap でラップ */
      if (!slide.querySelector(':scope > .slide-content-wrap')) {
        const wrap = document.createElement('div');
        wrap.className = 'slide-content-wrap';
        while (slide.firstChild) wrap.appendChild(slide.firstChild);
        slide.appendChild(wrap);
      }
      const wrap = slide.querySelector(':scope > .slide-content-wrap');
      const ratio = slide.clientWidth / 960;
      wrap.style.transform = `scale(${ratio})`;
    });
  });
}
window.addEventListener('resize', () => {
  if (currentView === 'list') scaleListSlides();
});

// 一覧 → クリックでヒーローに戻り、そのスライドを表示
slides.forEach((slide, i) => {
  slide.dataset.num = `${i + 1} / ${total}`;
  slide.addEventListener('click', () => {
    if (currentView !== 'list') return;
    cur = i;
    currentView = 'hero';
    applyView();
    update();
  });
});

// 初期化：保存済みビューを復元
try {
  const savedView = localStorage.getItem('slide-view');
  if (savedView === 'list') { currentView = 'list'; applyView(); }
} catch(e) {}
```

#### キーボードショートカット追加
| キー | 動作 |
|------|------|
| `V` | hero ⇄ list 切り替え |

### ナビゲーション（左右ヘルパー矢印）

スライドの**左端・右端に半透明の矢印ナビ**を配置する（ヒーロースライド風）。
ホバー時に明るくなり、最初・最後のスライドでは対応する矢印を非表示にする。

```html
<!-- スライドビューポートの内側に配置 -->
<button class="nav-arrow nav-prev" id="btn-prev" onclick="navigate(-1)">&#8249;</button>
<button class="nav-arrow nav-next" id="btn-next" onclick="navigate(1)">&#8250;</button>
```

```css
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 80px;
  background: var(--nav-bg);
  color: var(--nav-text);
  border: none;
  border-radius: 4px;
  font-size: 32px;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.2s;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-arrow:hover { opacity: 0.85; }
.nav-arrow.nav-prev { left: 8px; }
.nav-arrow.nav-next { right: 8px; }
.nav-arrow[hidden] { display: none; }
```

```js
function updateArrows() {
  document.getElementById('btn-prev').hidden = (cur === 0);
  document.getElementById('btn-next').hidden = (cur === total - 1);
}
```

### プログレスバー・スライド番号

- 上部に細いプログレスバー（アクセントカラー）
- スライド下部中央にスライド番号（例: `3 / 8`）

### キーボードショートカット

| キー | 動作 |
|------|------|
| `→` / `Space` | 次のスライド |
| `←` | 前のスライド |
| `F` | フルスクリーン切り替え |

```js
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') navigate(1);
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'f' || e.key === 'F') toggleFullscreen();
});
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}
```

### HTML全体構造テンプレート

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{タイトル} | Slides</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    /* CSS変数（ライト/ダーク） + hero/list ビュースタイル + 全スタイル */
  </style>
</head>
<body>
  <!-- 右上コントロール（テーマ + ビュー切替） -->
  <div class="control-cluster">
    <button id="theme-toggle" onclick="toggleTheme()" title="テーマ切替">🌙</button>
    <button id="view-toggle"  onclick="toggleView()"  title="表示切替">☰</button>
  </div>

  <!-- プログレスバー（最上部） -->
  <div id="progress-bar"></div>

  <!-- スケーラー（hero時は16:9固定、list時は縦並び） -->
  <div class="slide-scaler">
    <!-- 左右ナビ矢印（hero時のみ表示） -->
    <button class="nav-arrow nav-prev" id="btn-prev">&#8249;</button>
    <button class="nav-arrow nav-next" id="btn-next">&#8250;</button>

    <!-- スライド本体（各 960×540px） -->
    <!-- 重要: 中身は .slide-inner で囲み、list時のスケーリングに対応 -->
    <section class="slide active" id="s1">
      <div class="slide-inner">...スライドの中身...</div>
    </section>
    <section class="slide" id="s2">
      <div class="slide-inner">...</div>
    </section>
    ...

    <!-- スライド番号（hero時のみ表示） -->
    <div id="slide-counter">1 / N</div>
  </div>

  <script>/* navigate / fitSlide / toggleTheme / toggleView / keyboard */</script>
</body>
</html>
```

### スライドタイプ別レイアウト

**タイトルスライド**
```
[大きなタイトル]
[サブタイトル]
[情報源バッジ: GitHub ⭐ / X 🐦]
```

**リスト系スライド**
```
[スライドタイトル]
━━━━━━━━━━━━━━
• ポイント1（簡潔に）
• ポイント2
• ポイント3
[補足メモ（小文字）]
```

**カード系スライド（比較・紹介）**
```
[スライドタイトル]
┌──────┐ ┌──────┐ ┌──────┐
│ 項目A │ │ 項目B │ │ 項目C │
│ 説明  │ │ 説明  │ │ 説明  │
└──────┘ └──────┘ └──────┘
```

**まとめスライド**
```
[まとめ]
━━━━━━━━━━━━━━
① キーポイント1
② キーポイント2
③ キーポイント3
```

---

## Step 5: 出力

- ファイル名: `{テーマ}-slides.html`
- 保存先: `/mnt/user-data/outputs/`
- `present_files` で提示

---

## クオリティチェックリスト

出力前に以下を確認する。

- [ ] Web検索から得た実際の情報が含まれているか（架空のデータNG）
- [ ] スライド枚数が 6〜10枚の範囲内か
- [ ] スライドが 960×540px（16:9）固定サイズになっているか
- [ ] ブラウザリサイズ時に `transform: scale()` でフィットするか
- [ ] ライト／ダークテーマ切り替えボタンが動作するか
- [ ] **ヒーロー／一覧モード切り替えボタン**がテーマトグルの右隣にあり動作するか
- [ ] **一覧モードで縦スクロール表示**になり、スライドクリックでヒーローに戻るか
- [ ] 左右ナビ矢印が表示され、最初・最後で非表示になるか
- [ ] キーボード（←→ / Space / F / V）ナビゲーションが動作するか
- [ ] スライド番号・プログレスバーが正しく動作するか
- [ ] 出典URLが参考リンクスライドに含まれているか
- [ ] 日本語フォントが正しく読み込まれているか

---

## 参考: 職種別 検索パターン例

ユーザーの職種・ロールに応じて検索クエリを最適化する。
`{}` は実際のテーマで置換する。日本市場向けの内容は日本語クエリも併用する。

### 技術系（エンジニア・データ・デザイン）

#### ソフトウェアエンジニア
| ユースケース | 主な検索クエリ |
|------|--------------|
| 関数テスト・テスト戦略 | `{language} unit test best practices github`, `{framework} testing patterns 2025` |
| デバッグ・スタックトレース | `{error type} debugging guide github`, `{language} stack trace common pitfalls` |
| コードパターン解説 | `{pattern name} design pattern examples github`, `{language} {pattern} real world` |
| ライブラリ・フレームワーク | `{library} examples github stars`, `{library} tips tricks 2025` |
| AI ツール比較 | `{tool} vs {tool} github comparison`, `{tool} popular use cases` |

#### エンジニアリングマネージャー・テックリード
| ユースケース | 主な検索クエリ |
|------|--------------|
| プロジェクト計画 | `engineering project planning template github`, `tech roadmap example 2025` |
| アーキテクチャ評価 | `{architecture} trade-offs comparison`, `architecture decision record examples github` |
| 技術ドキュメント | `technical documentation template github`, `ADR template best practices` |
| Claude Code / MCP | `claude code skill github stars`, `MCP server awesome list github` |

#### データサイエンス
| ユースケース | 主な検索クエリ |
|------|--------------|
| 評価指標解釈 | `{metric} interpretation guide`, `ML evaluation metrics cheat sheet github` |
| EDA・探索的分析 | `EDA notebook example github`, `pandas profiling examples 2025` |
| 概念解説 | `{concept} explained intuitive`, `{algorithm} visualization github` |

#### デザイナー
| ユースケース | 主な検索クエリ |
|------|--------------|
| モックレビュー | `design review checklist`, `Figma review template github` |
| ユーザビリティテスト | `usability testing plan template`, `UT script examples 2025` |
| UX フロー改善 | `user flow friction analysis`, `funnel drop-off UX patterns` |

---

### ビジネス系（PM・経営・営業・マーケ）

#### プロダクトマネジメント
| ユースケース | 主な検索クエリ |
|------|--------------|
| バックログ優先順位 | `RICE scoring template`, `prioritization framework comparison github` |
| ステークホルダー報告 | `stakeholder update template`, `product status report examples` |
| 指標調査・グロース | `growth metric analysis case study`, `north star metric examples 2025` |

#### 創業者・経営者
| ユースケース | 主な検索クエリ |
|------|--------------|
| ビジネスモデル検証 | `business model canvas examples`, `lean canvas case study github` |
| 競合分析 | `competitive analysis framework`, `{industry} competitive landscape 2025` |
| 投資家向け資料 | `investor update template`, `monthly investor email examples` |

#### マーケティング
| ユースケース | 主な検索クエリ |
|------|--------------|
| コピーバリエーション | `ad copy framework AIDA PAS`, `landing page copy examples 2025` |
| アトリビューション | `attribution model comparison`, `multi-touch attribution guide` |
| ファネル分析 | `conversion funnel optimization case study`, `funnel drop-off analysis` |

#### 営業
| ユースケース | 主な検索クエリ |
|------|--------------|
| 反論対応・ナレッジ | `sales objection handling framework`, `objection responses {industry}` |
| 新規開拓メール | `cold email templates that work 2025`, `outbound email examples github` |
| アカウントプラン | `account planning template B2B`, `key account management framework` |

#### 財務
| ユースケース | 主な検索クエリ |
|------|--------------|
| 予算差異分析 | `budget variance analysis template`, `FP&A variance commentary examples` |
| 取締役会向けメモ | `board memo template`, `board reporting best practices 2025` |
| 年間予算サイクル | `annual budgeting process timeline`, `zero-based budgeting guide` |

#### コンサルタント
| ユースケース | 主な検索クエリ |
|------|--------------|
| スライド作成 | `consulting deck examples github`, `McKinsey style slide templates` |
| 課題解決策定 | `MECE problem solving framework`, `issue tree examples consulting` |
| フレームワーク解説 | `{framework} consulting case study`, `strategy framework comparison` |

#### オペレーション
| ユースケース | 主な検索クエリ |
|------|--------------|
| RFP 作成 | `vendor RFP template github`, `procurement RFP best practices` |
| SOP 作成 | `standard operating procedure template`, `SOP examples {industry}` |
| 承認ワークフロー | `approval workflow examples`, `RACI matrix template github` |

#### 人事
| ユースケース | 主な検索クエリ |
|------|--------------|
| オンボーディング | `employee onboarding checklist template`, `30-60-90 day plan examples` |
| 面接質問設計 | `behavioral interview questions {role}`, `interview rubric template github` |
| 人事規程 | `employee handbook template`, `HR policy examples 2025` |

---

### 専門職（法務・医療・研究・教育）

#### 法務
| ユースケース | 主な検索クエリ |
|------|--------------|
| 契約書要約 | `contract review checklist`, `key terms NDA SaaS agreement` |
| 条項ドラフト | `{clause type} contract template`, `boilerplate clauses examples` |
| 法的要求対応 | `{regulation} compliance checklist`, `GDPR CCPA compliance guide 2025` |

#### 科学者・研究者
| ユースケース | 主な検索クエリ |
|------|--------------|
| 研究ノート要約 | `lab notebook summary template`, `research notes synthesis methods` |
| 実験設計 | `{field} experimental design guide`, `DOE design of experiments examples` |
| 平易な解説 | `{topic} explained simply`, `science communication examples github` |
| 助成金申請 | `grant proposal examples`, `NIH NSF grant writing guide` |
| 研究計画 | `research plan template`, `study protocol examples github` |

#### 医療・ヘルスケア
| ユースケース | 主な検索クエリ |
|------|--------------|
| インフォームドコンセント | `informed consent communication guide`, `difficult conversations clinical` |
| 患者向け資料 | `patient education material examples`, `health literacy plain language guide` |
| 臨床論文要約 | `clinical paper summary template`, `evidence synthesis methods 2025` |

#### 教育者
| ユースケース | 主な検索クエリ |
|------|--------------|
| 誤解診断 | `common misconceptions {subject}`, `formative assessment examples` |
| 概念説明 | `{concept} teaching strategies`, `analogy examples teaching {topic}` |
| フィードバック | `student feedback rubric template`, `effective feedback examples teaching` |

#### 学生
| ユースケース | 主な検索クエリ |
|------|--------------|
| エッセイ構成 | `essay outline template`, `argumentative essay structure examples` |
| 概念分解 | `Feynman technique examples`, `{concept} explained step by step` |
| 推論検証 | `logical fallacies cheat sheet`, `critical thinking checklist github` |

#### ライター
| ユースケース | 主な検索クエリ |
|------|--------------|
| 初稿執筆 | `{genre} first draft techniques`, `writing prompts {topic} 2025` |
| 推敲・明確化 | `editing checklist for clarity`, `self-editing guide writers` |
| 長文構成 | `long-form article structure examples`, `narrative arc templates github` |

---

### クロス職種（汎用テーマ）

| テーマ | 主な検索クエリ |
|--------|--------------|
| Claude Code / AI開発 | `claude code skill github stars`, `claude code tips x.com` |
| MCP サーバー | `MCP server awesome list github`, `model context protocol trending` |
| Python / JS ライブラリ | `{library} examples github`, `{library} tricks 2025` |
| AI ツール比較 | `{tool} vs {tool} github`, `{tool} popular use cases` |
| 業界トレンド | `{industry} trends 2025`, `state of {field} report` |
| ベストプラクティス | `{topic} best practices 2025`, `{topic} common pitfalls` |

---

### 職種特定時のヒアリング指針

ユーザーの職種・ロールが不明な場合は、Step 1 のテーマ確認時に以下を併せて聞く：

- 「どんなお仕事をされていますか？（職種・ロール）」
- 「このスライドは誰に見せますか？（社内向け／顧客向け／勉強会など）」

職種が分かれば、上記の検索パターン表から該当カテゴリを選んでクエリを構築する。
複数職種にまたがる場合（例: PM × エンジニア）は両方のクエリパターンを組み合わせる。
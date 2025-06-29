# Obsidian Japanese Search Plugin

Enhanced Japanese text search for Obsidian with romaji input support.

## Features

- **Romaji Search**: Search Japanese text (kanji, hiragana, katakana) using romaji input
- **Multiple Romanization Systems**: Supports both Hepburn and Kunrei styles (e.g., "shi"/"si" → し)
- **All Kanji Readings**: Searches through all possible readings (on'yomi and kun'yomi)
- **Partial Matching**: Find results with partial input
- **Accurate Highlighting**: Highlights only the matched characters

## Usage

Press `Ctrl/Cmd + J` to open Japanese Search.

### Search Examples

| Input | Matches | Highlighted | Notes |
|-------|---------|-------------|-------|
| yama | 山田太郎 | 山 | Matches 山 (yama) |
| toukyou | 東京都 | 東、京 | Standard romanization |
| tokyo | 東京都 | ❌ | Incorrect romanization |
| gakkou | 学校 | 学、校 | With long vowel |
| si | 新聞 | 新 | Kunrei style (si = shi) |
| ti | 地図 | 地 | ti matches 地 (chi) |
| n | 中村 | 中 | Single character search |

### Supported Input Methods

- **Romaji**: yama, sakura, nihon
- **Hiragana**: やま, さくら, にほん
- **Katakana**: ヤマ, サクラ, ニホン
- **Kanji**: Direct kanji search works too

## Installation

### Manual Installation

1. Download the latest release
2. Extract `main.js`, `manifest.json`, and `styles.css`
3. Copy to your vault's `.obsidian/plugins/japanese-search/` folder
4. Enable the plugin in Settings → Community plugins

## License

MIT

---

# 日本語版

Obsidianで日本語検索を強化するプラグイン。ローマ字で漢字を検索できます。

## 主な機能

- **ローマ字検索**: ローマ字入力で漢字・ひらがな・カタカナを検索
- **複数の入力方式**: ヘボン式・訓令式の両方に対応（例：「shi」「si」→ し）
- **全読みパターン対応**: 漢字の音読み・訓読みすべてに対応
- **部分マッチ**: 入力の一部がマッチすれば検索結果に表示
- **正確なハイライト**: マッチした文字だけを正確にハイライト

## 使い方

`Ctrl/Cmd + J` で日本語検索を開きます。

### 検索例

| 入力 | マッチ例 | ハイライト部分 | 説明 |
|------|----------|--------------|------|
| yama | 山田太郎 | 山 | 「山」の読み「やま」にマッチ |
| toukyou | 東京都 | 東、京 | 標準的なローマ字 |
| tokyo | 東京都 | ❌ | 誤ったローマ字（マッチしない） |
| gakkou | 学校 | 学、校 | 長音付き |
| si | 新聞 | 新 | 訓令式（si = し） |
| ti | 地図 | 地 | 「地」の音読み「チ」にマッチ |
| n | 中村 | 中 | 1文字でも検索可能 |

### 対応する入力方法

- **ローマ字**: yama, sakura, nihon
- **ひらがな**: やま、さくら、にほん
- **カタカナ**: ヤマ、サクラ、ニホン
- **漢字**: 直接漢字での検索も可能
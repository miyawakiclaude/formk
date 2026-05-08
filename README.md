# KatagrMa TRフォーム

KatagrMa 無料トライアル登録申込フォームです。

---

## 全体構成

```
フォーム（GitHub Pages）
        ↓ 送信（POST）
Google Apps Script（Web App）
        ↓ 書き込み
Googleスプレッドシート
        ↓ 読み込み
管理画面（#admin）
```

---

## セットアップ手順

### STEP 1：Googleスプレッドシートを作成

1. [Google スプレッドシート](https://sheets.google.com) を開く
2. 新しいスプレッドシートを作成
3. URLの `https://docs.google.com/spreadsheets/d/XXXXXXXX/edit` の `XXXXXXXX` 部分をコピー（スプレッドシートID）

---

### STEP 2：Google Apps Scriptを設定

1. [script.google.com](https://script.google.com) を開く
2. 「新しいプロジェクト」を作成
3. `コード.gs` の内容を全て削除し、zipの `Code.gs` の内容を貼り付け
4. 1行目の `YOUR_SPREADSHEET_ID` をSTEP 1のIDに書き換える

```javascript
const SHEET_ID = 'ここにスプレッドシートIDを貼り付ける';
```

5. 上部メニューの「デプロイ」→「新しいデプロイ」
6. 種類：「ウェブアプリ」を選択
7. 設定：
   - 次のユーザーとして実行：**自分**
   - アクセスできるユーザー：**全員**
8. 「デプロイ」→ 表示された **ウェブアプリのURL** をコピー

---

### STEP 3：HTMLにGAS URLを設定

`index.html` をテキストエディタで開き下記を書き換える：

```javascript
const GAS_URL = 'https://script.google.com/macros/s/XXXXX/exec';
```

---

### STEP 4：GitHub Pagesに公開

1. GitHubで新規リポジトリ作成（Public）
2. `index.html` をアップロード
3. Settings → Pages → Branch: main/(root) → Save
4. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開

---

## 管理画面

```
https://<ユーザー名>.github.io/<リポジトリ名>/#admin
```

月別の申込件数・施設数をGoogleスプレッドシートからリアルタイムで表示します。

---

## スプレッドシートのシート構成

| シート名 | 内容 |
|---------|------|
| 申込データ | 全申込の詳細（1行1申込） |
| 月次集計 | 月別の集計サマリー |

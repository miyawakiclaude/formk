# KatagrMa TRフォーム

KatagrMa 無料トライアル登録申込フォームです。

## 公開手順（GitHub Pages）

### 1. GitHubリポジトリを作成

1. [github.com](https://github.com) にログイン
2. 右上の「＋」→「New repository」をクリック
3. Repository name を入力（例：`katagrma-tr-form`）
4. **Public** を選択
5. 「Create repository」をクリック

### 2. ファイルをアップロード

1. 作成したリポジトリのページを開く
2. 「uploading an existing file」をクリック
3. `index.html` をドラッグ＆ドロップ
4. 「Commit changes」をクリック

### 3. GitHub Pages を有効化

1. リポジトリの「Settings」タブを開く
2. 左メニューの「Pages」をクリック
3. Source を「Deploy from a branch」に設定
4. Branch を「main」→「/(root)」に設定
5. 「Save」をクリック

### 4. 公開URLを確認

数分後に以下のURLで公開されます：

```
https://<GitHubユーザー名>.github.io/<リポジトリ名>/
```

例：`https://katagrma.github.io/katagrma-tr-form/`

---

## 管理画面

申込データの月次集計はURLの末尾に `#admin` を追加してアクセスできます。

```
https://<GitHubユーザー名>.github.io/<リポジトリ名>/#admin
```

※ データはブラウザのlocalStorageに保存されます。

---

## 更新方法

`index.html` を修正後、GitHubリポジトリにアップロードし直すだけで自動的に反映されます。

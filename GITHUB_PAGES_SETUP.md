# GitHub Pages デプロイガイド

学校のフィルタリングを回避するため、GitHub Pages でアプリをホストします。

## セットアップ手順

### ステップ 1: リポジトリの Settings を開く

1. https://github.com/moralaction01/kuku-practice-app にアクセス
2. 上部の「Settings」タブをクリック

### ステップ 2: Pages 設定を有効化

1. 左側メニューから「Pages」を選択
2. 「Build and deployment」セクションで以下を設定：
   - **Source**：「GitHub Actions」を選択
   - これで自動的にデプロイワークフローが実行されます

### ステップ 3: デプロイ完了を待つ

1. 「Actions」タブで デプロイの進行状況を確認
2. 数分後、デプロイが完了します
3. Pages 設定ページに公開 URL が表示されます

## 公開 URL

デプロイ完了後、以下の URL でアプリにアクセスできます：

```
https://moralaction01.github.io/kuku-practice-app
```

## QR コード生成

公開 URL を QR コード化して児童に配布：

1. QR コード生成ツール（例：https://qr-code-generator.com/）にアクセス
2. 上記の URL を入力
3. QR コードを生成してダウンロード
4. 印刷して児童に配布

## 学校環境での確認

- 学校の環境で GitHub.com がアクセス可能か確認してください
- GitHub がアクセス可能なら、GitHub Pages の URL も通常アクセス可能です
- 万が一 GitHub Pages がブロックされている場合は、別のホスティングサービス（Vercel、Netlify など）の利用を検討してください

## 自動デプロイ

今後、main ブランチに変更をプッシュすると、自動的に GitHub Pages にデプロイされます。

```bash
git add .
git commit -m "Update app"
git push origin main
```

デプロイは数分で完了し、変更が公開 URL に反映されます。

## トラブルシューティング

### デプロイが失敗する場合

1. 「Actions」タブでエラーメッセージを確認
2. ビルドエラーがある場合は、ローカルで `pnpm build` を実行して確認
3. エラーを修正して再度プッシュ

### URL にアクセスできない場合

1. GitHub Pages が有効になっているか確認（Settings → Pages）
2. Source が「GitHub Actions」に設定されているか確認
3. デプロイが完了しているか確認（Actions タブ）
4. ブラウザキャッシュをクリアして再度アクセス

## サポート

問題が発生した場合は、GitHub Issues で報告してください。

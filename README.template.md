# {{SERVER_NAME}} MCP Server Template

このファイルは **テンプレート用 README** です。新しい MCP サーバーを作る際に以下のプレースホルダを置き換えてください。

| プレースホルダ | 置き換え例 | 説明 |
|----------------|-----------|------|
| `{{SERVER_NAME}}` | UrlContext | クライアントに表示されるサーバー名 (ListTools で返す name とは別でも可) |
| `{{NPM_PACKAGE_NAME}}` | @your-scope/url-context-mcp | npm 公開名 (スコープ推奨) |
| `{{BIN_COMMAND}}` | url-context-mcp | npx / ローカル実行バイナリ名 |
| `{{DESCRIPTION_JA}}` | 指定 URL から本文/メタデータを取得して要約する MCP ツール | 日本語説明 |
| `{{DESCRIPTION_EN}}` | Fetches and summarizes web page content. | 英語説明 |

---

> 以下テンプレート本文: 必要に応じ削除/編集してください。

## {{SERVER_NAME}} MCP Server

{{DESCRIPTION_EN}}

{{DESCRIPTION_JA}}

### Features
- Structured tool schema (Zod + MCP SDK)
- TypeScript + strict compile
- Ready for `npx` execution (shebang + bin)
- Minimal build (`tsc`) only
- Example: single tool implementation (`calculator` を差し替えてください)

### Directory
```
/ src
  index.ts          エントリ (Server 初期化 + ツール登録)
  tools/
    exampleTool.ts  新しいツール用の雛形 (任意で追加)
```

### Quick Start
```bash
# Install deps
yarn install # or npm i / pnpm i
# Build
npm run build
# Run via node (after build)
node build/index.js
# or directly (npx published)
npx {{NPM_PACKAGE_NAME}}@latest
```

### Add to Claude Code CLI
```bash
claude mcp add {{SERVER_NAME}} -s user -- npx {{NPM_PACKAGE_NAME}}@latest
```

### Tool Interface (Example)
```ts
// src/index.ts の抜粋
const tools: Tool[] = [
  {
    name: "fetch_url",
    description: "Fetch a URL and return structured content blocks (title, meta, text, links)",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Target URL (http/https)" },
        summarize: { type: "boolean", description: "Whether to return a summary", default: true }
      },
      required: ["url"]
    }
  }
];
```

### Implementation Tips
- ネットワーク I/O を行う場合は **タイムアウト** と **エラーメッセージ整形 (ユーザー向け)** を明示
- 大きな本文は要約 + 分割返却 (content array を複数分割)
- 返却 `content` の型: `[{ type: 'text', text: '...'}]` を基本にしつつ、構造化 JSON を文字列化して返しても良い (将来の structured content 拡張を考慮)

### Testing (Manual)
```bash
# 標準入出力テスト (JSON-RPC を手動)
node build/index.js < sample-requests/listTools.json
```

### Release Flow
1. `package.json` の version を semver 更新
2. `CHANGELOG.md` 追記
3. `npm publish --access public`
4. GitHub Release (タグ付け)

### License
- テンプレート利用時のデフォルト想定は **MIT License**
- 他ライセンスへ変更する場合: `LICENSE` 差し替え + `package.json#license` 更新 + README の表記更新
- 派生リポで独自ソースを多く加える前にライセンスを確定しておくと後工程が楽です

---
## Customization Checklist
- [ ] `package.json` name を `{{NPM_PACKAGE_NAME}}` に変更
- [ ] README 書き換え / 日本語 README.ja.md 追加 (任意)
- [ ] ツール名 / description をユースケースに合わせ編集
- [ ] 追加の `.env` が必要なら `dotenv` を導入し README に記載
- [ ] 公開前に `npm pack` でサイズ確認 (不要ファイルは `files` フィールドで除外)

Happy building 🎯

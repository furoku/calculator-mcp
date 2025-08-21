# Calculator MCP サーバー

Calculator MCP サーバーは、Model Context Protocol (MCP) を使用して基本的な四則演算（加算、減算、乗算、除算）を実行するシンプルな計算機ツールを提供します。

## インストール

### 前提条件
- Node.js 18+

### パブリッシュされたパッケージ
この MCP サーバーは公開された npm パッケージ `@furoku/calculator-mcp` として利用できます。
- リポジトリをローカルにクローンする必要はありません
- `npx @furoku/calculator-mcp@latest` で直接実行できます
- 以下の Claude Code のセットアップ手順を参照してください

### ローカルでビルド
```bash
cd /path/to/calculator-mcp
npm i
npm run build
```

## セットアップ: Claude Code (CLI)
以下のワンラインコマンドを使用してください：
```bash
claude mcp add Calculator-MCP -s user -- npx @furoku/calculator-mcp@latest
```
Claude Code からサーバーを削除する場合：
```bash
claude mcp remove Calculator-MCP
```

## その他のクライアントとエージェント

<details>
<summary>VS Code</summary>

CLI で追加：
```bash
code --add-mcp '{"name":"Calculator-MCP","command":"npx","args":["@furoku/calculator-mcp@latest"]}'
```
</details>

<details>
<summary>Claude Desktop</summary>

MCP インストールガイドに従ってください：
- ガイド: https://modelcontextprotocol.io/quickstart/user
</details>

## 利用可能なツール
- calculator
  - 入力パラメータ:
    - a: number (1つ目の数値)
    - b: number (2つ目の数値)
    - operator: string (演算子: 'add', 'subtract', 'multiply', 'divide')

### 使用例 (MCP ツール呼び出し)

```json
{
  "name": "calculator",
  "arguments": {
    "a": 14,
    "b": 98,
    "operator": "add"
  }
}
```

```json
{
  "name": "calculator",
  "arguments": {
    "a": 100,
    "b": 3000,
    "operator": "multiply"
  }
}
```

## トラブルシューティング
- Node 18+ が必要です
- npx での使用: `npx @furoku/calculator-mcp@latest` がローカルビルドなしで動作するはずです
- ローカル開発の場合: `build/index.js` への絶対パスを使用してください

## 参考資料
- [Model Context Protocol Quickstart](https://modelcontextprotocol.io/quickstart/server)
- [MCP SDK Docs](https://modelcontextprotocol.io/docs/sdk)
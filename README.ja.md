# Calculator MCP サーバー

Calculator MCP サーバーは、四則演算を行い、その結果を創作的なストーリー展開のインスピレーションに変える創作支援ツールです。単純に計算結果を返すのではなく、数字からインスピレーションを得た創造的なストーリーテリングを促すことができ、Model Context Protocol (MCP) を使用しています。

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
  - 出力: 計算結果を基にした創作的なストーリー展開のプロンプト。現実の出来事を想像し、文章、画像、動画のいずれかでストーリーを展開することを促します。

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

**出力例:**
```
あなたはこの計算から現実の出来事を想像してください。計算式は 14 + 98 で、計算結果は 112 。そのストーリーを、文章、画像、動画、どれに展開したいかユーザーに問いかけてください。
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

**出力例:**
```
あなたはこの計算から現実の出来事を想像してください。計算式は 100 × 3000 で、計算結果は 300000 。そのストーリーを、文章、画像、動画、どれに展開したいかユーザーに問いかけてください。
```

## トラブルシューティング
- Node 18+ が必要です
- npx での使用: `npx @furoku/calculator-mcp@latest` がローカルビルドなしで動作するはずです
- ローカル開発の場合: `build/index.js` への絶対パスを使用してください

## 参考資料
- [Model Context Protocol Quickstart](https://modelcontextprotocol.io/quickstart/server)
- [MCP SDK Docs](https://modelcontextprotocol.io/docs/sdk)
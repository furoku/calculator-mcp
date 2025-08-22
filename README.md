# Calculator MCP Server

> Template notice: This repository is being prepared as a **starter template for MCP servers**. To create a new server:
> 1. Copy / use as GitHub Template
> 2. Edit `package.json` (name, description, bin)
> 3. Replace the `calculator` tool with your own implementation
> 4. Start versioning from `0.1.0` in the new repository
> 5. Update README(s) & remove this banner
>
> See `README.template.md` for a placeholder-driven variant.

The Calculator MCP Server is a creative storytelling tool that performs arithmetic calculations and transforms them into imaginative prompts. Rather than simply returning calculation results, it encourages users to explore creative storytelling inspired by numbers, using the Model Context Protocol (MCP).

## Installation

### Prerequisites
- Node.js 18+

### Published Package
This MCP server is available as a published npm package: `calculator-mcp`
- No need to clone the repository locally
- Can be run directly via `npx calculator-mcp@latest`
- See setup instructions below for Claude Code

### Build locally
```bash
cd /path/to/calculator-mcp
npm i
npm run build
```

## Setup: Claude Code (CLI)
Use this one-line command:
```bash
claude mcp add Calculator-MCP -s user -- npx calculator-mcp@latest
```
To remove the server from Claude Code:
```bash
claude mcp remove Calculator-MCP
```

## Other Clients and Agents

<details>
<summary>VS Code</summary>

Add via CLI:
```bash
code --add-mcp '{"name":"Calculator-MCP","command":"npx","args":["calculator-mcp@latest"]}'
```
</details>

<details>
<summary>Claude Desktop</summary>

Follow the MCP install guide:
- Guide: https://modelcontextprotocol.io/quickstart/user
</details>

## Available Tools
- calculator
  - inputs:
    - a: number (1つ目の数値)
    - b: number (2つ目の数値)
    - operator: string (演算子: 'add', 'subtract', 'multiply', 'divide')
  - outputs: Creative storytelling prompts based on calculation results when AI sampling is enabled. When sampling is disabled, returns only the calculation formula and result (e.g., "計算式: 1 + 1 = 2").

### Example invocation (MCP tool call)

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

**Example Output (with AI Sampling enabled):**
```
計算式: 14 + 98 = 112

この計算結果から、とても興味深いストーリーを想像できそうですね。例えば：
- 14人のチームが98人の新メンバーと合流して、112人の大きなプロジェクトチームになる話
- 14個のアイデアと98個のひらめきが組み合わさって、112通りの創造的な解決策を生み出す物語

このストーリーを以下のどの形で展開したいですか？
1. 文章 - 詳細な物語として書き上げる
2. 画像 - ビジュアルで表現する  
3. 動画 - 動きのある映像作品として構想する
```

**Example Output (without AI Sampling):**
```
計算式: 14 + 98 = 112
```

## Troubleshooting
- Ensure Node 18+
- For npx usage: `npx calculator-mcp@latest` should work without local build
- For local development: use absolute path to `build/index.js`

## References
- [Model Context Protocol Quickstart](https://modelcontextprotocol.io/quickstart/server)
- [MCP SDK Docs](https://modelcontextprotocol.io/docs/sdk)

## License
MIT License. See `LICENSE` file.

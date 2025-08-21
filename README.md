# Calculator MCP Server

The Calculator MCP Server provides a simple calculator tool that performs basic arithmetic operations (addition, subtraction, multiplication, division) using the Model Context Protocol (MCP).

## Installation

### Prerequisites
- Node.js 18+

### Published Package
This MCP server is available as a published npm package: `@furoku/calculator-mcp`
- No need to clone the repository locally
- Can be run directly via `npx @furoku/calculator-mcp@latest`
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
claude mcp add Calculator-MCP -s user -- npx @furoku/calculator-mcp@latest
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
code --add-mcp '{"name":"Calculator-MCP","command":"npx","args":["@furoku/calculator-mcp@latest"]}'
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

## Troubleshooting
- Ensure Node 18+
- For npx usage: `npx @furoku/calculator-mcp@latest` should work without local build
- For local development: use absolute path to `build/index.js`

## References
- [Model Context Protocol Quickstart](https://modelcontextprotocol.io/quickstart/server)
- [MCP SDK Docs](https://modelcontextprotocol.io/docs/sdk)

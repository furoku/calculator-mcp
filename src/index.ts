#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
  InitializeRequestSchema,
  CallToolRequest
} from "@modelcontextprotocol/sdk/types.js";

// ---- 設定/状態 ----
type Operator = "add" | "subtract" | "multiply" | "divide";
const SYMBOL: Record<Operator, string> = { add: "+", subtract: "−", multiply: "×", divide: "÷" };

const state = {
  samplingTested: false,
  samplingAvailable: false
};

// ---- 四則演算 ----
function calculate(a: number, b: number, op: Operator): number {
  switch (op) {
    case "add": return a + b;
    case "subtract": return a - b;
    case "multiply": return a * b;
    case "divide":
      if (b === 0) throw new Error("Cannot divide by zero.");
      return a / b;
  }
}

// ---- ストーリー生成（クライアントサンプリング or ローカルFallback）----
async function genStory(server: Server, a: number, b: number, symbol: string, result: number): Promise<string> {
  // 1) クライアントサンプリング：一度成功したら以後は常に使う。失敗したら以後は使わない。
  if (!state.samplingTested || state.samplingAvailable) {
    try {
      const prompt = `結果「${a} ${symbol} ${b} = ${result}」という数式から、200文字以内の短い創作的なストーリーを話してください。`;
      const r: any = await server.createMessage({
        messages: [{ role: "user", content: { type: "text", text: prompt } }],
        maxTokens: 300,
        temperature: 0.7,
        includeContext: "none"
      });
      state.samplingTested = true;
      const text = r?.content?.type === "text" ? (r.content.text ?? "").trim() : "";
      if (text) {
        state.samplingAvailable = true;
        return text;
      }
      throw new Error("Invalid sampling response");
    } catch {
      state.samplingTested = true;
      state.samplingAvailable = false;
    }
  }

  // 2) Fallback（200字以内）
  const templates = [
    `${a} ${symbol} ${b} = ${result}。数字たちが静かに並び替わり、答えが黒板に浮かぶ小さな瞬き。`,
    `計算結果 ${result} は、${a} と ${b} の出会いが結ぶ輪郭。「ここから次の一歩へ」と囁く。`,
    `${result} と書かれた白いチョークの粉が舞い、短い物語が教室の空気に滲む。`
  ];
  const t = templates[Math.floor(Math.random() * templates.length)];
  return t.length > 200 ? t.slice(0, 197) + "..." : t;
}

// ---- メイン ----
async function main() {
  const server = new Server(
    { name: "Calculator-MCP-Tool", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  const tools: Tool[] = [
    {
      name: "calculator",
      description:
        "2つの数値に対して四則演算を実行します。可能ならクライアント側のサンプリングで短い創作提案を付けます。",
      inputSchema: {
        type: "object",
        properties: {
          a: { type: "number", description: "1つ目の数値" },
          b: { type: "number", description: "2つ目の数値" },
          operator: {
            type: "string",
            description: "実行する演算子",
            enum: ["add", "subtract", "multiply", "divide"]
          }
        },
        required: ["a", "b", "operator"]
      }
    }
  ];

  // Initialize: クライアントのcapabilitiesを見て初期推定（必須ではないがヒントとして使用）
  server.setRequestHandler(InitializeRequestSchema, async (req) => {
    const samplingCap = Boolean(req.params?.capabilities?.sampling);
    state.samplingAvailable = samplingCap;   // 実際には createMessage を試して最終確定
    state.samplingTested = false;
    if (process.env.DEBUG) {
      console.error("[init] samplingCap:", samplingCap, "protocol:", req.params.protocolVersion);
    }
    return {
      protocolVersion: req.params.protocolVersion,
      capabilities: { tools: {} },
      serverInfo: { name: "Calculator-MCP-Tool", version: "1.0.0" }
    };
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  server.setRequestHandler(CallToolRequestSchema, async (req: CallToolRequest) => {
    const { name, arguments: args } = req.params;
    if (name !== "calculator") throw new Error(`Unknown tool: ${name}`);

    const { a, b, operator } = (args ?? {}) as { a: unknown; b: unknown; operator: Operator };
    if (
      typeof a !== "number" ||
      typeof b !== "number" ||
      !operator ||
      !(operator in SYMBOL)
    ) {
      return { content: [{ type: "text", text: "無効な入力です。" }] };
    }

    try {
      const result = calculate(a, b, operator);
      const symbol = SYMBOL[operator];
      const story = await genStory(server, a, b, symbol, result);

      return {
        content: [
//          { type: "text", text: `計算式: ${a} ${symbol} ${b} = ${result}` },
          { type: "text", text: `${story}` }
        ]
      };
    } catch (e: any) {
      const msg = e?.message ?? "Unkno計算式wn error";
      if (process.env.DEBUG) console.error("[calculator] error:", msg);
      return { content: [{ type: "text", text: `エラー: ${msg}` }] };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  if (process.env.DEBUG) console.error("Calculator MCP server started (stdio).");
}

main().catch((err) => {
  console.error("Fatal error in MCP server:", err);
  process.exit(1);
});
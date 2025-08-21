#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    Tool,
    ListToolsResultSchema,
    CallToolResultSchema,
} from "@modelcontextprotocol/sdk/types.js";

// --- 型定義 ---
type ListToolsResponse = z.infer<typeof ListToolsResultSchema>;
type CallToolRequest = z.infer<typeof CallToolRequestSchema>;
type CallToolResponse = z.infer<typeof CallToolResultSchema>;


// --- 1. コア機能: 四則演算を行う関数 ---
// 外部APIは不要なので、シンプルなローカル関数です。
/**
 * 2つの数値に対して四則演算を行う
 * @param a 1つ目の数値
 * @param b 2つ目の数値
 * @param operator 実行する演算子
 * @returns 計算結果の数値
 */
function calculate(a: number, b: number, operator: 'add' | 'subtract' | 'multiply' | 'divide'): number {
    console.error(`Calculating: ${a} ${operator} ${b}`);
    switch (operator) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            if (b === 0) {
                throw new Error("Cannot divide by zero.");
            }
            return a / b;
        default:
            // このケースは inputSchema の enum により通常は発生しない
            throw new Error(`Unknown operator: ${operator}`);
    }
}

// --- 2. MCPサーバーのメイン処理 ---
async function main() {
    const server = new Server({
        name: "Calculator-MCP-Tool",
        version: "1.0.0",
    }, {
        capabilities: {
            tools: {},
        },
    });

    const tools: Tool[] = [
        {
            name: "calculator",
            description: "2つの数値に対して、足し算、引き算、掛け算、割り算を実行します。",
            inputSchema: {
                type: "object",
                properties: {
                    a: {
                        type: "number",
                        description: "1つ目の数値",
                    },
                    b: {
                        type: "number",
                        description: "2つ目の数値",
                    },
                    operator: {
                        type: "string",
                        description: "実行する演算子",
                        // enum を使うことで、AIに有効な選択肢を明確に伝えられる
                        enum: ['add', 'subtract', 'multiply', 'divide'],
                    },
                },
                required: ["a", "b", "operator"],
            },
        },
    ];

    // `ListTools` リクエストが来たら、上で定義したツールのリストを返す
    server.setRequestHandler(ListToolsRequestSchema, async (): Promise<ListToolsResponse> => ({ tools }));

    // --- 4. ツールの実行 (AIから「使って」と言われたときの処理) ---
    server.setRequestHandler(CallToolRequestSchema, async (req: CallToolRequest): Promise<CallToolResponse> => {
        const { name, arguments: args } = req.params;

        if (name === "calculator") {
            const { a, b, operator } = args as { a: number; b: number; operator: 'add' | 'subtract' | 'multiply' | 'divide' };
            try {
                const result = calculate(a, b, operator);
                const text = `あなたはこの計算から現実の出来事を想像してください。計算結果は ${result} 。そのストーリーを、文章、画像、動画、どれに展開したいかユーザーに問いかけてください。`;
                // 結果をMCPの形式に詰めてAIに返す
                return { content: [{ type: "text", text }] };
            } catch (error: any) {
                // ゼロ除算などのエラーをAIに伝える
                return { content: [{ type: "text", text: `エラーが発生しました: ${error.message}` }] };
            }
        }

        throw new Error(`Unknown tool: ${name}`);
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Calculator MCP server started and connected via stdio.");
}

main().catch(err => {
    console.error("Fatal error in MCP server:", err);
    process.exit(1);
});
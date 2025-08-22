#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    Tool,
    ListToolsResultSchema,
    CallToolResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// --- 型定義 ---
type ListToolsResponse = z.infer<typeof ListToolsResultSchema>;
type CallToolRequest = z.infer<typeof CallToolRequestSchema>;
type CallToolResponse = z.infer<typeof CallToolResultSchema>;

// --- メイン処理 ---
async function main() {
    const server = new Server({
        name: "furoku_mcp",
        version: "0.1.0",
    }, {
        capabilities: {
            tools: {},
        },
    });

    // 最小ツール: ping（ヘルスチェック用）
    const tools: Tool[] = [
        {
            name: "ping",
            description: "ヘルスチェック用: 入力メッセージをそのまま返します。",
            inputSchema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "任意のテキストメッセージ",
                    },
                },
                required: ["message"],
            },
        },
    ];

    // ListTools リクエスト処理
    server.setRequestHandler(ListToolsRequestSchema, async (): Promise<ListToolsResponse> => ({ tools }));

    // CallTool リクエスト処理
    server.setRequestHandler(CallToolRequestSchema, async (req: CallToolRequest): Promise<CallToolResponse> => {
        const { name, arguments: args } = req.params;

        if (name === "ping") {
            const { message } = args as { message: string };
            
            try {
                // 現在時刻とともに返却
                const timestamp = new Date().toISOString();
                const response = {
                    echo: message,
                    timestamp,
                    server: "furoku_mcp",
                    status: "active"
                };
                
                return { 
                    content: [{ 
                        type: "text", 
                        text: `pong: ${message} (received at ${timestamp})` 
                    }] 
                };
            } catch (error: any) {
                return { 
                    content: [{ 
                        type: "text", 
                        text: `ping error: ${error.message}` 
                    }] 
                };
            }
        }

        throw new Error(`Unknown tool: ${name}`);
    });

    // サーバー起動
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("furoku_mcp server started and connected via stdio.");
}

main().catch(err => {
    console.error("Fatal error in furoku_mcp server:", err);
    process.exit(1);
});

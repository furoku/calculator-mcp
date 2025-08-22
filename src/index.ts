#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { 
    ListToolsRequestSchema, 
    CallToolRequestSchema, 
    Tool,
    InitializeRequestSchema,
    CallToolRequest
} from "@modelcontextprotocol/sdk/types.js";

// クライアントのsampling機能サポート状況を追跡
let clientSupportsSampling = false;
let samplingTestedSuccessfully = false;  // 実際のサンプリング成功を記録

type Operator = 'add' | 'subtract' | 'multiply' | 'divide';
const SYMBOL: Record<Operator, string> = { add: '+', subtract: '-', multiply: '×', divide: '÷' };


// --- 1. コア機能: 四則演算を行う関数 ---
// 外部APIは不要なので、シンプルなローカル関数です。
/**
 * 2つの数値に対して四則演算を行う
 * @param a 1つ目の数値
 * @param b 2つ目の数値
 * @param operator 実行する演算子
 * @returns 計算結果の数値
 */
function calculate(a: number, b: number, operator: Operator): number {
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

// フォールバックストーリー生成
async function sampleStory(server: Server, a: number, b: number, symbol: string, result: number): Promise<string | null> {
    console.error(`Sampling requested for: ${a} ${symbol} ${b} = ${result}`);

    // 1) まずクライアント経由の sampling を試みる
    // 初期化時に false でも、実行時には試してみる（VS Code の場合）
    if (clientSupportsSampling || !samplingTestedSuccessfully) {
        try {
            const prompt = `結果 ${a} ${symbol} ${b} = ${result} を題材に短い創作的提案をください (200文字以内)`;
            const r = await server.request({
                method: "sampling/createMessage",  // 修正: 正しいメソッド名
                params: {
                    messages: [{
                        role: 'user',
                        content: {  // 修正: 単一オブジェクト形式
                            type: 'text',
                            text: prompt
                        }
                    }],
                    max_tokens: 300,  // 修正: スネークケース
                    temperature: 0.7,
                    includeContext: 'none',  // コンテキストを含めない設定
                    modelPreferences: {
                        hints: [{
                            name: "claude-3-haiku-20240307"  // 軽量モデルを推奨
                        }]
                    }
                }
            }, z.any());
            console.error("Sampling request successful:", r);
            
            // 成功したらフラグを更新
            samplingTestedSuccessfully = true;
            clientSupportsSampling = true;
            
            // 修正: 正しいレスポンス解析
            const response = r as any;
            if (response?.model && response?.stopReason) {
                // 正常なレスポンス
                const content = response.content;
                if (Array.isArray(content)) {
                    const textContent = content.find((c: any) => c?.type === 'text');
                    if (textContent?.text) {
                        return `**プロンプト:** ${prompt}\n\n**生成結果:**\n${textContent.text.trim()}`;
                    }
                } else if (content?.type === 'text' && content?.text) {
                    return `**プロンプト:** ${prompt}\n\n**生成結果:**\n${content.text.trim()}`;
                }
            }
        } catch (error: any) {
            console.error("Sampling request failed with details:", {
                error: error.message,
                stack: error.stack,
                code: error.code
            });
            
            // 初回テスト失敗を記録
            if (!samplingTestedSuccessfully) {
                samplingTestedSuccessfully = true;
                clientSupportsSampling = false;
                console.error("Sampling test failed - will use fallback for future requests");
            }
            // フォールバックに進む
        }
    } else {
        console.error("Client does not support sampling capability, using local fallback");
    }

    // 2) ローカルの簡易サンプラー（クライアント未対応やリクエスト失敗時のフォールバック）
    //    マニュアルの「サンプリングの流れ」を手軽に試せるよう、簡単なテンプレート生成を行う。
    console.error("Using local fallback sampler");
    
    const templates = [
        `${a} ${symbol} ${b} = ${result}。この計算から生まれる物語：数字たちが踊りながら答えを見つけていく。`,
        `計算結果 ${result} が語りかける：「私は ${a} と ${b} の出会いから生まれました」と小さくささやく。`,
        `${result} という答えが、静かな教室の黒板に白いチョークで書かれ、明日への希望を描いている。`
    ];
    
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // 200文字以内に整形
    if (selectedTemplate.length > 200) {
        return selectedTemplate.slice(0, 197) + '...';
    }
    return selectedTemplate;
}

// --- 2. MCPサーバーのメイン処理 ---
async function main() {
    const server = new Server({
        name: "Calculator-MCP-Tool",
        version: "1.0.0",
    }, {
        capabilities: {
            tools: {},
            sampling: {}
        },
    });

    const tools: Tool[] = [
        {
            name: "calculator",
            description: "2つの数値に対して四則演算を実行します。サンプリング機能が利用可能な場合は、計算結果から創作的なストーリー提案も生成します。",
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

    // 初期化ハンドラーを追加してクライアントのcapabilityを確認
    server.setRequestHandler(InitializeRequestSchema, async (request) => {
        const clientCapabilities = request.params.capabilities;
        clientSupportsSampling = !!clientCapabilities?.sampling;
        
        console.error("Full client capabilities:", JSON.stringify(request.params, null, 2));
        console.error("Client capabilities:", JSON.stringify(clientCapabilities, null, 2));
        console.error("Sampling support:", clientSupportsSampling);
        
        return {
            protocolVersion: "2024-11-05",
            capabilities: {
                tools: {},
                sampling: {}
            },
            serverInfo: {
                name: "Calculator-MCP-Tool",
                version: "1.0.0"
            }
        };
    });

    // `ListTools` リクエストが来たら、上で定義したツールのリストを返す
    server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

    // --- 4. ツールの実行 (AIから「使って」と言われたときの処理) ---
    server.setRequestHandler(CallToolRequestSchema, async (req: CallToolRequest) => {
        const { name, arguments: args } = req.params;

        if (name === "calculator") {
            const { a, b, operator } = args as { a: number; b: number; operator: Operator };
            if (typeof a !== 'number' || typeof b !== 'number' || !SYMBOL[operator]) {
                return { content: [{ type: 'text', text: '無効な入力です。' }] };
            }
            try {
                const result = calculate(a, b, operator);
                const symbol = SYMBOL[operator];
                const story = await sampleStory(server, a, b, symbol, result);
                
                const response = [
                    { type: 'text', text: `計算式: ${a} ${symbol} ${b} = ${result}` }
                ];
                
                if (story) {
                    response.push({ type: 'text', text: `**創作ストーリー提案:**\n${story}` });
                } else {
                    response.push({ type: 'text', text: `*ストーリー生成に失敗しました（詳細はログを確認してください）*` });
                }
                
                return { content: response };
            } catch (e: any) {
                return { content: [{ type: 'text', text: `エラー: ${e.message}` }] };
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
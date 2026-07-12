export type AIProvider = "openai" | "anthropic" | "gemini" | "none";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface AICompletionResponse {
  text: string;
  provider: AIProvider;
  model: string;
}

export interface AIAdapter {
  readonly provider: AIProvider;
  complete(request: AICompletionRequest): Promise<AICompletionResponse>;
}

export function getConfiguredAIProvider(): AIProvider {
  const explicit = process.env.AI_PROVIDER as AIProvider | undefined;
  if (explicit && explicit !== "none") return explicit;
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return "none";
}

export function createAIAdapter(provider?: AIProvider): AIAdapter | null {
  const selected = provider ?? getConfiguredAIProvider();
  if (selected === "none") return null;

  switch (selected) {
    case "openai":
      return createOpenAIAdapter();
    case "anthropic":
      return createAnthropicAdapter();
    case "gemini":
      return createGeminiAdapter();
    default:
      return null;
  }
}

function createOpenAIAdapter(): AIAdapter {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  return {
    provider: "openai",
    async complete(request) {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.chat.completions.create({
        model,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: request.maxTokens ?? 600,
        temperature: request.temperature ?? 0.4,
      });
      return {
        text: response.choices[0]?.message?.content ?? "",
        provider: "openai",
        model,
      };
    },
  };
}

function createAnthropicAdapter(): AIAdapter {
  const model =
    process.env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-20241022";
  return {
    provider: "anthropic",
    async complete(request) {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const system = request.messages.find((m) => m.role === "system")?.content;
      const userMessages = request.messages.filter((m) => m.role !== "system");
      const response = await client.messages.create({
        model,
        max_tokens: request.maxTokens ?? 600,
        temperature: request.temperature ?? 0.4,
        system: system ?? undefined,
        messages: userMessages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      });
      const textBlock = response.content.find((b) => b.type === "text");
      return {
        text: textBlock?.type === "text" ? textBlock.text : "",
        provider: "anthropic",
        model,
      };
    },
  };
}

function createGeminiAdapter(): AIAdapter {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
  return {
    provider: "gemini",
    async complete(request) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const genModel = client.getGenerativeModel({ model });
      const system = request.messages.find((m) => m.role === "system")?.content;
      const prompt = request.messages
        .filter((m) => m.role !== "system")
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n\n");
      const result = await genModel.generateContent(
        system ? `${system}\n\n${prompt}` : prompt,
      );
      return {
        text: result.response.text(),
        provider: "gemini",
        model,
      };
    },
  };
}

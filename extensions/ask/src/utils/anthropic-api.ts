import { getPreferenceValues } from "@raycast/api";
import Anthropic from "@anthropic-ai/sdk";
import { ApiArgs } from "../type";

const preferences = getPreferenceValues();

const anthropic = new Anthropic({
  baseURL: preferences.apiEndpoint,
  apiKey: preferences.apiKey,
});

export async function* promptStream(args: ApiArgs): AsyncGenerator<string, void, unknown> {
  const stream = await anthropic.messages.stream({
    model: "claude-3-opus-20240229",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: args.prompt,
      },
    ],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }
}

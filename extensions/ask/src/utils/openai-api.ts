import { getPreferenceValues } from "@raycast/api";
import OpenAI from "openai";
import { ApiArgs } from "../type";

const preferences = getPreferenceValues();

const openAI = new OpenAI({
  apiKey: preferences.apiKey,
  baseURL: preferences.apiEndpoint,
});

export async function* promptStream(args: ApiArgs): AsyncGenerator<string, void, unknown> {
  const result = await openAI.chat.completions.create(
    {
      model: args.model,
      temperature: Number(args.temperature),
      messages: [
        { role: "system", content: args.systemPrompt },
        { role: "user", content: args.selectedText },
      ],
      stream: true,
    },
    {}
  );

  for await (const chunk of result) {
    const content = chunk.choices[0]?.delta?.content;
    if (typeof content === "string") {
      yield content;
    }
  }
}

import { getPreferenceValues } from "@raycast/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiArgs } from "../type";

const genAI = new GoogleGenerativeAI(getPreferenceValues().apiKey);

export async function* promptStream(args: ApiArgs): AsyncGenerator<string, void, unknown> {
  const model = genAI.getGenerativeModel({
    model: args.model,
    generationConfig: { temperature: args.temperature },
  }, {apiVersion: "v1beta"});

  const result = await model.generateContentStream(`Instructions:\n${args.systemPrompt}\n\nMessage:\n${args.prompt}`);

  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

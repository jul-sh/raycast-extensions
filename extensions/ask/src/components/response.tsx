import { Detail, ActionPanel, Action, Toast, showToast, Keyboard, getPreferenceValues, getSelectedText, popToRoot } from "@raycast/api";
import { useState, useEffect } from "react";
import * as geminiApi from "../utils/gemini-api";
import * as openAiApi from "../utils/openai-api";
import * as anthropicApi from "../utils/anthropic-api";
import { ApiArgs, ConfigurationPreferences } from "../type";

const preferences = getPreferenceValues<ConfigurationPreferences>();
const apiMap = {
  gemini: geminiApi.promptStream,
  anthropic: anthropicApi.promptStream,
  openai: openAiApi.promptStream,
};
const api = apiMap[preferences.apiType];

export default function ResponseComponent({
  prompt,
}: {
  prompt: string;
}) {
  const [markdownResponse, setMarkdownResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let selectedText;
      try {
        selectedText = await getSelectedText();
      } catch (e) {
        console.error(e);
        await popToRoot();
        await showToast({
          style: Toast.Style.Failure,
          title: "Could not get the selected text",
        });
        return;
      }

      const start = Date.now();


      let promptApiArgs = selectedText
        ? {
          systemPrompt: `${prompt} ONLY return the updated text, without explanations.`,
          prompt: selectedText,
        }
        : { systemPrompt: "You're a helpful assistant", prompt: prompt };

      const apiArgs: ApiArgs = {
        ...promptApiArgs,
        temperature: 0,
        model: preferences.defaultModel,
      };

      await showToast({
        style: Toast.Style.Animated,
        title: "Waiting for response...",
      });

      try {
        for await (const responseChunk of api(apiArgs)) {
          setMarkdownResponse((markdownResponse) => markdownResponse + responseChunk);
        }

        await showToast({
          style: Toast.Style.Success,
          title: "Response finished",
          message: `${(Date.now() - start) / 1000} seconds`,
        });
      } catch (e) {
        console.error("eeeeeh", e);
        setMarkdownResponse("## Could not access Gemini.\n\nIt's API failed when responding.");
        await showToast({
          style: Toast.Style.Failure,
          title: "Response failed",
          message: `${(Date.now() - start) / 1000} seconds`,
        });
      }

      setIsLoading(false);
    })();
  }, []);

  return (
    <Detail
      actions={
        !isLoading && (
          <ActionPanel>
            <Action.Paste content={markdownResponse} />
            <Action.CopyToClipboard shortcut={Keyboard.Shortcut.Common.Copy} content={markdownResponse} />
          </ActionPanel>
        )
      }
      isLoading={isLoading}
      markdown={markdownResponse}
    />
  );
}

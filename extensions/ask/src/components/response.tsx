import {
  Detail,
  ActionPanel,
  Action,
  Toast,
  showToast,
  getSelectedText,
  popToRoot,
  Keyboard,
  getPreferenceValues,
} from "@raycast/api";
import { useState, useEffect } from "react";
import * as geminiApi from "../utils/gemini-api";
import * as openAiApi from "../utils/openai-api";
import * as anthropicApi from "../utils/anthropic-api";
import { ApiArgs, ConfigurationPreferences } from "../type";

const preferences = getPreferenceValues<ConfigurationPreferences>();
const apiType = preferences.apiType;
const api =
  apiType === "gemini"
    ? geminiApi.promptStream
    : apiType === "anthropic"
      ? anthropicApi.promptStream
      : openAiApi.promptStream;

export default function useResponse({
  systemPrompt,
  allowPaste = false,
  ignoreNoSelectedText,
}: {
  systemPrompt: string;
  allowPaste: boolean;
  ignoreNoSelectedText?: boolean;
}) {
  const [markdownResponse, setMarkdownResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const populateResponse = async (apiArgs: ApiArgs) => {
    await showToast({
      style: Toast.Style.Animated,
      title: "Waiting for response...",
    });

    const start = Date.now();

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
  };

  useEffect(() => {
    (async () => {
      let selectedText;
      try {
        selectedText = await getSelectedText();
      } catch (e) {
        if (!ignoreNoSelectedText) {
          console.error(e);
          await popToRoot();
          await showToast({
            style: Toast.Style.Failure,
            title: "Could not get the selected text",
          });
        }
      }
      populateResponse({
        prompt: `${systemPrompt}\n${selectedText}\nIt is very important that you only provide the final output without any additional comments or remarks`,
        temperature: 0,
        model: preferences.defaultModel,
      });
    })();
  }, []);

  return (
    <Detail
      actions={
        !isLoading && (
          <ActionPanel>
            {allowPaste && <Action.Paste content={markdownResponse} />}
            <Action.CopyToClipboard shortcut={Keyboard.Shortcut.Common.Copy} content={markdownResponse} />
          </ActionPanel>
        )
      }
      isLoading={isLoading}
      markdown={markdownResponse}
    />
  );
}

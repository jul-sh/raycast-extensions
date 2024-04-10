import { useEffect, useState } from "react";
import { Toast, showToast, getSelectedText, popToRoot, Detail } from "@raycast/api";
import "./utils/polyfills";
import ResponseComponent from "./components/response";

export default function Ask(props: { prompt: string; ignoreNoSelectedText?: boolean }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedText, setSelectedText] = useState<string>("");

  let resProps = selectedText
    ? {
      systemPrompt: `${props.prompt} ONLY return the updated text, without explanations.`,
      prompt: selectedText,
    }
    : { systemPrompt: "You're a helpful assistant", prompt: props.prompt };

  useEffect(() => {
    (async () => {
      try {
        let text = await getSelectedText();
        setSelectedText(text);
      } catch (e) {
        if (!props.ignoreNoSelectedText) {
          console.error(e);
          await popToRoot();
          await showToast({
            style: Toast.Style.Failure,
            title: "Could not get the selected text",
          });
          return;
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return isLoading ? <Detail isLoading /> : <ResponseComponent allowPaste={true} {...resProps} />;
}

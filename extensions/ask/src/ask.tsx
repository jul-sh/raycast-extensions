import "./utils/polyfills";
import useResponse from "./components/response";

export default function Ask(props: { prompt: string; ignoreNoSelectedText?: boolean }) {
  let systemPrompt = `${props.prompt} ONLY return the updated text, without explanations.`;
  return useResponse({
    systemPrompt,
    allowPaste: true,
    ignoreNoSelectedText: props.ignoreNoSelectedText,
  });
}

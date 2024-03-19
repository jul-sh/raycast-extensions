import "./utils/polyfills";
import useResponse from "./components/response";

export default function Ask(props: { systemPrompt: string; ignoreNoSelectedText?: boolean }) {
  return useResponse({
    systemPrompt: props.systemPrompt,
    allowPaste: true,
    ignoreNoSelectedText: props.ignoreNoSelectedText,
  });
}

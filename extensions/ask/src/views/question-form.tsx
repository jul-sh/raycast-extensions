import { Action, ActionPanel, Form, Icon } from "@raycast/api";
import { useState } from "react";
import { QuestionFormProps } from "../type";

export const QuestionForm = ({ initialQuestion, onSubmit }: QuestionFormProps) => {
  const [question, setQuestion] = useState<string>(initialQuestion ?? "");
  const [error, setError] = useState<{ question: string }>({
    question: "",
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action
            title="Submit"
            icon={Icon.Checkmark}
            onAction={() => {
              onSubmit(question);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="prompt"
        title="Prompt"
        placeholder="Type your custom prompt here"
        error={error.question.length > 0 ? error.question : undefined}
        onChange={setQuestion}
        value={question}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setError({ ...error, question: "Required" });
          } else {
            if (error.question && error.question.length > 0) {
              setError({ ...error, question: "" });
            }
          }
        }}
      />
    </Form>
  );
};

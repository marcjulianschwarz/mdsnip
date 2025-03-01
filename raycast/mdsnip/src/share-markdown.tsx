import { Form, ActionPanel, Action, showToast, Clipboard, popToRoot, open } from "@raycast/api";
import fetch from "node-fetch";

type Values = {
  textfield: string;
  textarea: string;
  datepicker: Date;
  checkbox: boolean;
  dropdown: string;
  tokeneditor: string[];
};

export interface Snippet {
  id: number;
  markdown: string;
  shareCode: string;
  createdAt: Date;
  userId: number | null;
  expiresAt: string | null;
  expirationHours: number | null;
}

export async function createSnippet(markdown: string): Promise<Snippet> {
  const res = await fetch(`https://mdsnip.com/api/snippets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ markdown }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const snippet = (await res.json()) as Snippet;
  console.log(snippet);

  return snippet;
}

export default function Command() {
  async function handleSubmit(values: Values, openURL: boolean) {
    console.log(values);
    const snippet = await createSnippet(values.textarea);
    const shareLink = `http://mdsnip.com/share/${snippet.shareCode}`;
    await Clipboard.copy(shareLink);
    showToast({ title: "Done", message: "Copied Link To Clipboard" });

    popToRoot();
    if (openURL) {
      open(shareLink);
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={(values: Values) => handleSubmit(values, false)} title="Copy Share Link" />
          <Action.SubmitForm onSubmit={(values: Values) => handleSubmit(values, true)} title="Open Share Link" />
        </ActionPanel>
      }
    >
      <Form.Description text="Enter your markdown here to quickly share it with a link." />
      <Form.TextArea id="textarea" title="Markdown" placeholder="# Markdown Text" />
    </Form>
  );
}

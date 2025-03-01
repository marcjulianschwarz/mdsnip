"use client";
import { useUser } from "@/app/hooks/useUser";
import SnippetsView from "./SnippetsView";

export default function SnippetsPage() {
  const { auth } = useUser();

  if (!auth.isAuthenticated) {
    return (
      <div className="mdsnip-container">
        <h1>Your Snippets</h1>
        <p>Please login to manage your snippets.</p>
      </div>
    );
  }

  return (
    <div className="mdsnip-container">
      <h1>Your Snippets</h1>
      <SnippetsView user={auth.user}></SnippetsView>
    </div>
  );
}

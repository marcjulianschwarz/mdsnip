"use client";
import { useUser } from "@/app/hooks/useUser";

export default function AccountPage() {
  const { auth } = useUser();

  if (!auth.isAuthenticated) {
    return <p>Not authenticated</p>;
  }

  return (
    <div className="mdsnip-container">
      <h1>Your Account</h1>
      <p>Manage your account details.</p>
      <br></br>
      <br></br>
      <br></br>
      <h2>Profile</h2>
      <p>Username: @{auth.user.username}</p>
    </div>
  );
}

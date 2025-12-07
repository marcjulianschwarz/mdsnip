import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home/page";
import QueryProvider from "./providers";
import SnippetsPage from "./pages/snippets/page";
import SettingsPage from "./pages/settings/page";
import LoginPage from "./pages/login/page";
import RegisterPage from "./pages/register/page";
import AccountPage from "./pages/account/page";
import SharePage from "./pages/share/page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/snippets" element={<SnippetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/share/:shareId" element={<SharePage />} />
        </Routes>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
);

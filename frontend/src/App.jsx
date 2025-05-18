import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router";
import { RootLayout } from "@/pages/RootLayout";
import { AuthContext, AuthContextProvider } from "@/components/AuthContext";
import { useContext } from "react";
import { Email } from "@/pages/EmailPage";
import { EmailListPage } from "@/pages/EmailListPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ComposeEmailPage } from "@/pages/ComposeEmailPage";

const ProtectedRoute = () => {
  const { user,initialLoading } = useContext(AuthContext);

  if (initialLoading) return null;

  if (user) return <Outlet />;

  return <Navigate to="/login" />;
};

const RedirectIfLoggedIn = () => {
  const { user, initialLoading } = useContext(AuthContext);

  if (initialLoading) return null;

  if (user) return <Navigate to="/c/inbox" />;

  return <Outlet />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      
      <Route element={<ProtectedRoute />}>
        <Route index element={<Navigate to="c/inbox" />} />
        <Route path="c/:emailCategory" element={<EmailListPage />} />
        <Route path="c/:emailCategory/:emailId" element={<Email />} />
        <Route path="compose" element={<ComposeEmailPage />} />
      </Route>

      <Route element={<RedirectIfLoggedIn />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export const App = () => {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
};

import { FormEvent, useState } from "react";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("enatan10712@gmail.com");
  const [password, setPassword] = useState("yoniman");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // POST the credentials to the FastAPI /auth/login route.
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      // Persist the JWT so subsequent requests include the Authorization header.
      localStorage.setItem("accessToken", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refreshToken", data.refresh_token);
      }

      // Navigate straight to the admin dashboard once authenticated.
      navigate("/admin/users");
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      setError(axiosError.response?.data?.detail ?? "Login failed. Check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300" htmlFor="email">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          startIcon={<AtSymbolIcon className="h-4 w-4" />}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          startIcon={<LockClosedIcon className="h-4 w-4" />}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-primary" />
            <span>Remember me</span>
          </label>
          <Link to="#" className="text-primary hover:text-primary-light">
            Forgot password?
          </Link>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting} disabled={isSubmitting}>
        Sign in
      </Button>
      <p className="text-center text-sm text-slate-400">
        Need an account?{" "}
        <Link to="/register" className="text-primary hover:text-primary-light">
          Register
        </Link>
      </p>
    </form>
  );
}

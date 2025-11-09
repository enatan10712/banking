import { AtSymbolIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export function RegisterPage() {
  return (
    <form className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300" htmlFor="fullName">
            Full name
          </label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            startIcon={<UserIcon className="h-4 w-4" />}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm efet font-medium text-slate-300" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            startIcon={<AtSymbolIcon className="h-4 w-4" />}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            startIcon={<LockClosedIcon className="h-4 w-4" />}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300" htmlFor="confirmPassword">
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat password"
            startIcon={<LockClosedIcon className="h-4 w-4" />}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300" htmlFor="role">
          Role
        </label>
        <Select id="role" defaultValue="customer">
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="analyst">Analyst</option>
        </Select>
      </div>
      <Button type="submit" className="w-full" size="lg">
        Create account
      </Button>
      <p className="text-center text-sm text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-primary hover:text-primary-light">
          Log in
        </Link>
      </p>
    </form>
  );
}

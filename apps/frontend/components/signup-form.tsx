"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/useAuthContext";

export function SignUpForm() {
  const router = useRouter();
  const { signup, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [tag, setTag] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    clearError();

    // Validate passwords match
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      console.log(email, password, tag);
      const user = await signup(email, password, tag);
      console.log(user);
      router.push("/login");
    } catch (err) {
      console.log(err);
      // Error is handled by the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag">Tag</Label>
        <Input
          id="tag"
          type="text"
          placeholder="@yourname"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {(formError || error) && (
        <p className="text-sm text-destructive">{formError || error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

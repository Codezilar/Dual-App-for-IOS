"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AppWindow, Loader2, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Unable to continue. Check your details and try again.");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="mesh-bg grid min-h-screen place-items-center p-4">
      <Card className="w-full max-w-md bg-card/90 shadow-soft backdrop-blur-xl">
        <CardHeader>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <AppWindow className="h-5 w-5" />
          </div>
          <CardTitle>{isSignup ? "Create your Dual App account" : "Log in to Dual App"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {isSignup
              ? "Your isolated app profiles and cookie stores will be saved to this account."
              : "Return to your saved app profiles without re-entering every app credential."}
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={submit}>
            {isSignup ? <Input name="name" placeholder="Full name" autoComplete="name" /> : null}
            <Input name="email" type="email" placeholder="Email" autoComplete="email" required />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={8}
              required
            />
            {error ? <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
            <Button className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSignup ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {isSignup ? "Create account" : "Log in"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "New to Dual App?"}{" "}
            <Link className="font-medium text-foreground underline-offset-4 hover:underline" href={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Log in" : "Create one"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

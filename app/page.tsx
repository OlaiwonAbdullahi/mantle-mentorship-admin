"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (data) {
          console.log(data.data.token);
          localStorage.setItem("admin_token", data.data.token);
          document.cookie = `admin_token=${data.data.token}; path=/; max-age=86400; SameSite=Lax`;

          localStorage.setItem("admin_name", data.data.name);
          localStorage.setItem("admin_data", JSON.stringify(data.data));
        }
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-[#008000] lg:flex flex-col justify-between p-10 text-white dark:border-r">
        <div className="flex items-center gap-2 font-medium text-xl sora">
          <div className="bg-white rounded-full p-1 flex items-center justify-center">
            <Image
              src="/mantleLogo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </div>
          The Mantle Mentorship
        </div>
        <div className="space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              &ldquo;Transferring the practical & life-based skill mantle to the
              next generation of future leaders.&rdquo;
            </p>
            <footer className="text-sm opacity-80">Admin Portal</footer>
          </blockquote>
        </div>
        <div className="opacity-60 text-sm">
          &copy; {new Date().getFullYear()} Mantle Mentorship. All rights
          reserved.
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto w-full max-w-[400px] space-y-8">
          <div className="flex flex-col items-center gap-2 text-center">
            {/* Show logo on mobile only since it's hidden in the side panel */}
            <div className="lg:hidden bg-[#008000] rounded-full p-2 mb-2">
              <Image
                src="/mantleLogo.png"
                alt="Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain bg-white rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the Admin Portal
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={onSubmit}>
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-11 border-neutral-200 dark:border-neutral-800 focus-visible:ring-[#008000]"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Password
                    </label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="h-11 border-neutral-200 dark:border-neutral-800 focus-visible:ring-[#008000]"
                    required
                  />
                </div>
                <Button
                  disabled={isLoading}
                  className="h-11 bg-[#008000] hover:bg-[#006000] text-white shadow-sm transition-all"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

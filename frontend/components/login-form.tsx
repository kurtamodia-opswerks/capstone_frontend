"use client";

import { signIn } from "next-auth/react";

import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    await signIn("microsoft-entra-id");
    setIsLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Vizly</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Vizly</h1>
            <FieldDescription>
              Turn Data into Insightful Charts
            </FieldDescription>
          </div>

          <Field>
            <Button
              type="submit"
              onClick={() => handleLogin()}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <rect x="0" y="0" width="11" height="11" fill="#F35325" />
                <rect x="13" y="0" width="11" height="11" fill="#81BC06" />
                <rect x="0" y="13" width="11" height="11" fill="#05A6F0" />
                <rect x="13" y="13" width="11" height="11" fill="#FFBA08" />
              </svg>
              {isLoading ? "Logging in..." : "Login with Microsoft"}
            </Button>
          </Field>
          <FieldSeparator></FieldSeparator>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By logging in, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}

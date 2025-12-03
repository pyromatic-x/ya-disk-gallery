"use client";

import { Roboto } from "next/font/google";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/ui/form/button";
import "./globals.css";
import { Bug, Check } from "lucide-react";
import NextTopLoader from "nextjs-toploader";
import { toast } from "sonner";
import { use_notify_about_bug_mutation } from "@/hooks/mutations";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/shared/empty";
import { Toaster } from "@/ui/ux/sonner";
import Providers from "./providers";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

interface TProps {
  error: Error & { digest?: string };
}

export default function GlobalError({ error }: TProps) {
  return (
    <html lang="en" className={`${roboto.className} dark`}>
      <head>
        <title>Bug's are everywhere</title>
      </head>
      <body>
        <NextTopLoader height={6} color="#c7c7c7" showSpinner={false} initialPosition={0.15} />
        <Toaster position="top-center" />
        <Providers>
          <Content error={error} />
        </Providers>
      </body>
    </html>
  );
}

const Content = ({ error }: TProps) => {
  const router = useRouter();

  const onGoHome = () => router.replace("/");

  const { mutate, isSuccess, isError, isPending } = use_notify_about_bug_mutation({
    onSuccess: () => toast.success("Notification sent, thanks."),
    onError: () => "Hmmm, even here error occurred. Love my life.",
  });

  const err = error.digest || error.message || "Not recognized error happened.";

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative">
      <Empty className="max-w-max m-auto">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bug className="text-yellow-500" />
          </EmptyMedia>
          <EmptyTitle>How did you get here?</EmptyTitle>
          <EmptyDescription>
            Something strange happened:
            <br />
            <span className="text-red-400">{err}</span>
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-row gap-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onGoHome}
            aria-label="error button"
          >
            To Homepage
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => mutate({ error: err })}
            aria-label="error button"
            loading={isPending}
            disabled={isSuccess || isError}
          >
            {isSuccess ? (
              <span className="flex items-center gap-2">
                Notified
                <Check size={18} className="text-green-400" />
              </span>
            ) : (
              "Notify about bug"
            )}
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};

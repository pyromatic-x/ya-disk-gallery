"use client";

import { ShieldUser } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/shared/empty";
import { TelegramLoginButton } from "./_components/telegram-button";

export default function Page() {
  const router = useRouter();

  const [error, setError] = useState("");

  const onSuccess = () => router.replace("/");
  const onError = (error: Error) => setError(error.message);

  return (
    <div className="w-full h-screen flex items-center justify-center grow overflow-hidden">
      <Empty className="max-w-max m-auto">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldUser className="text-yellow-500" />
          </EmptyMedia>
          <EmptyTitle>hiddenfolder</EmptyTitle>
          <EmptyDescription>Login via telegram to continue</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {!error ? (
            <TelegramLoginButton onSuccess={onSuccess} onError={onError} />
          ) : (
            <p>Your account is in waitlist now. Wait for approval to continue.</p>
          )}
        </EmptyContent>
      </Empty>
    </div>
  );
}

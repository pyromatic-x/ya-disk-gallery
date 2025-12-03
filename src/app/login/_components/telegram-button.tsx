"use client";

import { use_login_mutation } from "@mutations";
import { useEffect, useRef } from "react";

interface TProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export const TelegramLoginButton = ({ onSuccess, onError }: TProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { mutate } = use_login_mutation({
    onSuccess,
    onError,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: on mount
  useEffect(() => {
    window.onTelegramAuth = mutate;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?21";
    script.async = true;

    script.setAttribute("data-telegram-login", "pyromatic_bot");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "6");
    script.setAttribute("data-userpic", "false");

    containerRef.current?.appendChild(script);

    return () => {
      containerRef.current?.removeChild(script);
      window.onTelegramAuth = undefined;
    };
  }, []);

  return <div ref={containerRef} className="h-10"></div>;
};

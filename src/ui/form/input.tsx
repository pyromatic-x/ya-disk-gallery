import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface TProps extends ComponentProps<"input"> {
  wrapperClassName?: ComponentProps<"div">["className"];
}

function Input({ className, type, wrapperClassName, ...props }: TProps) {
  return (
    <div className={cn(["relative", wrapperClassName])}>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground  border-input flex h-9 w-full min-w-0 px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "h-[38px]",
          "bg-black text-white",
          "py-2.5",
          "px-3",
          "rounded-md",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          type === "password" ? "pr-13" : "",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Input };

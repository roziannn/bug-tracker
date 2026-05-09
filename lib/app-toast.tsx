"use client";

import type { ComponentProps } from "react";
import { AlertCircle, Info, X } from "lucide-react";
import { toast, type Toast } from "react-hot-toast";

import { cn } from "@/lib/utils";

type AppToastOptions = {
  title: string;
  description?: string;
  duration?: number;
};

type AppToastVariant = "success" | "error" | "info";

function SuccessFilledIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="10" cy="10" fill="currentColor" r="9" />
      <path
        d="M6.6 10.2 8.8 12.4 13.4 7.8"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

const iconClasses: Record<AppToastVariant, string> = {
  success: "text-emerald-500 fill-emerald-500",
  error: "text-destructive fill-destructive/15",
  info: "text-primary fill-primary/15",
};

const iconAnimation: Record<AppToastVariant, string> = {
  success: "animate-[toast-pop_280ms_ease-out]",
  error: "animate-[toast-shake_360ms_ease-out]",
  info: "animate-[toast-float_420ms_ease-out]",
};

const variantIcons = {
  success: SuccessFilledIcon,
  error: AlertCircle,
  info: Info,
} satisfies Record<AppToastVariant, React.ComponentType<{ className?: string }>>;

function GlassToast({
  toastInstance,
  title,
  description,
  variant,
}: AppToastOptions & {
  toastInstance: Toast;
  variant: AppToastVariant;
}) {
  const Icon = variantIcons[variant];

  return (
    <div
      className="pointer-events-auto relative w-[min(92vw,24rem)] overflow-hidden rounded-2xl bg-[color-mix(in_oklab,var(--background)_78%,transparent)] p-4 shadow-lg backdrop-blur-2xl"
      style={{
        opacity: toastInstance.visible ? 1 : 0,
        transform: toastInstance.visible
          ? "translateY(0) scale(1)"
          : "translateY(-8px) scale(0.98)",
        transition:
          "opacity 220ms ease, transform 220ms ease",
      }}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 shrink-0", iconAnimation[variant])}>
          <Icon className={cn("size-5", iconClasses[variant])} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <button
          aria-label="Dismiss notification"
          className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
          onClick={() => toast.dismiss(toastInstance.id)}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

function showToast(variant: AppToastVariant, options: AppToastOptions) {
  return toast.custom(
    (toastInstance) => (
      <GlassToast
        description={options.description}
        duration={options.duration}
        title={options.title}
        toastInstance={toastInstance}
        variant={variant}
      />
    ),
    {
      duration: options.duration ?? 3000,
      removeDelay: 220,
    }
  );
}

export const appToast = {
  success: (options: AppToastOptions) => showToast("success", options),
  error: (options: AppToastOptions) => showToast("error", options),
  info: (options: AppToastOptions) => showToast("info", options),
};

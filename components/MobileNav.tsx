"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "left" | "right";
};

export function MobileNav({
  open,
  onClose,
  title,
  children,
  side = "left",
}: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const slideClass = side === "left" ? "left-0" : "right-0";

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-amor-text/30"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={`absolute top-0 ${slideClass} flex h-full w-[min(100%,20rem)] flex-col border-amor-soft bg-amor-white shadow-xl ${side === "left" ? "border-r" : "border-l"}`}
      >
        <div className="flex min-h-14 items-center justify-between border-b border-amor-soft px-4">
          {title ? (
            <p className="text-lg font-semibold text-amor-blue">{title}</p>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-amor-text hover:bg-amor-soft"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

type MenuButtonProps = {
  onClick: () => void;
  label?: string;
};

export function MenuButton({ onClick, label = "Open menu" }: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-amor-blue hover:bg-amor-soft lg:hidden"
      aria-label={label}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  );
}

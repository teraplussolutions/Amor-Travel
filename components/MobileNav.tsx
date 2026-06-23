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
  side = "right",
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
        className="absolute inset-0 bg-amor-text/25 backdrop-blur-[2px]"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={`mobile-nav-panel ${slideClass}`}
      >
        <div className="mobile-nav-panel__header">
          {title ? (
            <p className="text-xl font-bold text-amor-red">{title}</p>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="mobile-nav-panel__close"
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
        <div className="mobile-nav-panel__body">{children}</div>
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
      className="header-menu-btn lg:hidden"
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

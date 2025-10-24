"use client";

/**
 * Footer component displayed on all pages
 * Shows the challenge version for deployment tracking
 */
export function Footer() {
  const version = "3.5";

  return (
    <footer className="border-t border-border bg-background/50 py-6 text-center text-sm text-muted-foreground">
      <p>Challenge Version {version}</p>
    </footer>
  );
}

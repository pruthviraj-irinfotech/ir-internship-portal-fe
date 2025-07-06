'use client';

// This layout is intentionally left blank to resolve a routing conflict.

export default function BlankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is disabled.
  return <>{children}</>;
}

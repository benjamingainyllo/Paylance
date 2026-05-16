/**
 * Custom layout for the Create Event page.
 * This overrides the default dashboard layout (sidebar + mobile header)
 * so the create page renders full-screen without any chrome.
 */
export default function CreateEventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

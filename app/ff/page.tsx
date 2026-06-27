import type { Metadata } from "next";
import FeatureFlagPage from "./FeatureFlagPage";

// Keep this page out of search engine indexes
export const metadata: Metadata = {
  title: "Feature Flags",
  robots: { index: false, follow: false },
};

export default function FFPage() {
  return <FeatureFlagPage />;
}

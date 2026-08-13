import { SiteChrome } from "@/components/SiteChrome";
import { HomePage } from "@/components/HomePage";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <SiteChrome current="home">
      <HomePage />
    </SiteChrome>
  );
}

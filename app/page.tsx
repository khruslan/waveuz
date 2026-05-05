import { WaveLabsApp } from "@/components/WaveLabsApp";

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WaveLabs",
    url: "https://wavelabs.uz",
    email: "hello@wavelabs.uz",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tashkent",
      addressCountry: "UZ"
    },
    knowsAbout: ["AI Engineering", "Machine Learning", "Data Engineering", "Custom Software"]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WaveLabsApp />
    </>
  );
}

import type { CompanyScale, IndustryPresetCard, Industry, StatItem } from "@/lib/types";

// Phase C: translation keys below (ind.*) are placeholders.
// Populate data/translations.generated.json before rendering IndustryPresets section.
const industryPresets = {
  banking: [
    { image: "/media/ind-banking-01.webp", useCaseKey: "ind.banking.c1.uc", outcomeKey: "ind.banking.c1.out" },
    { image: "/media/ind-banking-02.webp", useCaseKey: "ind.banking.c2.uc", outcomeKey: "ind.banking.c2.out" },
    { image: "/media/ind-banking-03.webp", useCaseKey: "ind.banking.c3.uc", outcomeKey: "ind.banking.c3.out" }
  ],
  retail: [
    { image: "/media/ind-retail-01.webp", useCaseKey: "ind.retail.c1.uc", outcomeKey: "ind.retail.c1.out" },
    { image: "/media/ind-retail-02.webp", useCaseKey: "ind.retail.c2.uc", outcomeKey: "ind.retail.c2.out" },
    { image: "/media/ind-retail-03.webp", useCaseKey: "ind.retail.c3.uc", outcomeKey: "ind.retail.c3.out" }
  ],
  telecom: [
    { image: "/media/ind-telecom-01.webp", useCaseKey: "ind.telecom.c1.uc", outcomeKey: "ind.telecom.c1.out" },
    { image: "/media/ind-telecom-02.webp", useCaseKey: "ind.telecom.c2.uc", outcomeKey: "ind.telecom.c2.out" },
    { image: "/media/ind-telecom-03.webp", useCaseKey: "ind.telecom.c3.uc", outcomeKey: "ind.telecom.c3.out" }
  ],
  fmcg: [
    { image: "/media/ind-fmcg-01.webp", useCaseKey: "ind.fmcg.c1.uc", outcomeKey: "ind.fmcg.c1.out" },
    { image: "/media/ind-fmcg-02.webp", useCaseKey: "ind.fmcg.c2.uc", outcomeKey: "ind.fmcg.c2.out" },
    { image: "/media/ind-fmcg-03.webp", useCaseKey: "ind.fmcg.c3.uc", outcomeKey: "ind.fmcg.c3.out" }
  ],
  government: [
    { image: "/media/ind-gov-01.webp", useCaseKey: "ind.gov.c1.uc", outcomeKey: "ind.gov.c1.out" },
    { image: "/media/ind-gov-02.webp", useCaseKey: "ind.gov.c2.uc", outcomeKey: "ind.gov.c2.out" },
    { image: "/media/ind-gov-03.webp", useCaseKey: "ind.gov.c3.uc", outcomeKey: "ind.gov.c3.out" }
  ]
} satisfies Record<string, IndustryPresetCard[]>;

export const assets = {
  heroVideo: "/media/hero.mp4",
  contactVideo: "/media/contact.mp4",
  processVideo: "/media/process.mp4",
  workImages: [
    "/media/work-01.webp",
    "/media/work-02.webp",
    "/media/work-03.webp"
  ],
  serviceIcons: [
    "/media/svc-01.webm",
    "/media/svc-02.webm",
    "/media/svc-03.webm",
    "/media/svc-04.webm",
    "/media/svc-05.webm"
  ],
  industryPresets
};

export const navItems = [
  { href: "#services-pin", key: "nav.services" },
  { href: "#work", key: "nav.work" },
  { href: "#process", key: "nav.process" },
  { href: "#team", key: "nav.team" }
];

export const clients = [
  [
    "Jusan Bank",
    "Air Astana",
    "Kolesa Group",
    "ForteBank",
    "Freedom Finance",
    "Choco",
    "BI Group",
    "Kcell",
    "Beeline KZ",
    "Magnum"
  ],
  ["Uzum", "Humans", "Payme", "Click", "Alif Bank", "Artel", "Ucell", "Orient Group", "Hamkorbank", "Zoomrad"]
];

export const marqueeItems = [
  "mq.ai",
  "mq.ml",
  "mq.software",
  "mq.data",
  "mq.transformation",
  "mq.product",
  "mq.cloud",
  "mq.nlp"
];

export const services = [
  { n: "01", name: "sv1.name", desc: "sv1.desc", tags: ["PyTorch", "TensorFlow", "LLMs", "MLOps"] },
  { n: "02", name: "sv2.name", desc: "sv2.desc", tags: ["Python", "Go", "Node.js", "Microservices"] },
  { n: "03", name: "sv3.name", desc: "sv3.desc", tags: ["Kafka", "Spark", "dbt", "Airflow"] },
  { n: "04", name: "sv4.name", desc: "sv4.desc", tags: ["Flutter", "React", "iOS/Android"] },
  { n: "05", name: "sv5.name", desc: "sv5.desc", tags: ["Strategy", "Architecture", "Change Mgmt"] }
];

if (services.length !== assets.serviceIcons.length) {
  throw new Error(
    `services (${services.length}) and assets.serviceIcons (${assets.serviceIcons.length}) length mismatch`
  );
}

export const stats: StatItem[] = [
  { value: "4", suffix: "", label: "stats.l1", evidence: "stats.l1.ev" },
  { value: "3", suffix: "y", label: "stats.l2", evidence: "stats.l2.ev" },
  { value: "2", suffix: "", label: "stats.l3", evidence: "stats.l3.ev" },
  { value: "12", suffix: "+", label: "stats.l4", evidence: "stats.l4.ev" }
];

export const testimonials = [
  { text: "tm1.text", who: "tm1.who" },
  { text: "tm2.text", who: "tm2.who" },
  { text: "tm3.text", who: "tm3.who" },
  { text: "tm4.text", who: "tm4.who" }
];

export const workItems = [
  { tag: "wk1.tag", name: "wk1.name", alt: "AI Credit Scoring" },
  { tag: "wk2.tag", name: "wk2.name", alt: "Semantic Search" },
  { tag: "wk3.tag", name: "wk3.name", alt: "Supply Chain" }
];

export const processSteps = [
  { n: "01", title: "pr1.title", desc: "pr1.desc" },
  { n: "02", title: "pr2.title", desc: "pr2.desc" },
  { n: "03", title: "pr3.title", desc: "pr3.desc" },
  { n: "04", title: "pr4.title", desc: "pr4.desc" }
];

export const teamMembers = [
  { initials: "AR", name: "Anel Ryspaeva", role: "m1.role", xp: "team.source" },
  { initials: "EK", name: "Emil Khusnutdinov", role: "m2.role", xp: "team.source" },
  { initials: "RK", name: "Ruslan Khusenov", role: "m3.role", xp: "team.source" },
  { initials: "MS", name: "Madina Saylaubayeva", role: "m4.role", xp: "team.source" }
];

export const techTags = [
  "Python",
  "PyTorch",
  "TensorFlow",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "Apache Kafka",
  "Spark",
  "dbt",
  "Airflow",
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Terraform",
  "React",
  "Flutter",
  "Node.js",
  "Go",
  "LangChain",
  "OpenAI API",
  "Hugging Face",
  "Elasticsearch",
  "Prometheus"
];

export const faqItems = [
  { q: "fq1.q", a: "fq1.a" },
  { q: "fq2.q", a: "fq2.a" },
  { q: "fq3.q", a: "fq3.a" },
  { q: "fq4.q", a: "fq4.a" },
  { q: "fq5.q", a: "fq5.a" },
  { q: "fq6.q", a: "fq6.a" }
];

export const industries: Array<{ value: Industry; labelKey: string }> = [
  { value: "fintech", labelKey: "industry.fintech" },
  { value: "ecom", labelKey: "industry.ecom" },
  { value: "logistics", labelKey: "industry.logistics" },
  { value: "health", labelKey: "industry.health" },
  { value: "realestate", labelKey: "industry.realestate" },
  { value: "other", labelKey: "industry.other" }
];

export const scales: Array<{ value: CompanyScale; labelKey: string }> = [
  { value: "startup", labelKey: "scale.startup" },
  { value: "smb", labelKey: "scale.smb" },
  { value: "enterprise", labelKey: "scale.enterprise" }
];

import type { ClientItem, CompanyScale, Industry, StatItem, WorkItem } from "@/lib/types";

export const assets = {
  heroVideo: "/media/hero.mp4",
  contactVideo: "/media/contact.mp4",
  processVideo: "/media/process.mp4",
  serviceIcons: [
    "/media/svc-01.webm",
    "/media/svc-02.webm",
    "/media/svc-03.webm",
    "/media/svc-04.webm",
    "/media/svc-05.webm"
  ]
};

export const navItems = [
  { href: "#services-pin", key: "nav.services" },
  { href: "#work", key: "nav.work" },
  { href: "#process", key: "nav.process" },
  { href: "#team", key: "nav.team" }
];

export const clients: ClientItem[][] = [
  [
    { name: "UMarket", badge: "Marketplace" },
    { name: "INTECA", badge: "Education" },
    { name: "ART.KZ", badge: "Art" },
    { name: "HIBA", badge: "Agritech" },
    { name: "Lev Telman", badge: "Healthcare" }
  ],
  [
    { name: "Just AI", badge: "AI" },
    { name: "Mirsot", badge: "Consulting" },
    { name: "KazParts", badge: "E-commerce" },
    { name: "RA Group", badge: "Investment" }
  ]
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

export const workItems: WorkItem[] = [
  { tag: "case.umarket.tag", name: "case.umarket.name", desc: "case.umarket.desc", image: "/media/case-umarket.jpg", alt: "UMarket" },
  { tag: "case.inteca.tag", name: "case.inteca.name", desc: "case.inteca.desc", image: "/media/case-inteca.jpg", alt: "INTECA" },
  { tag: "case.art.tag", name: "case.art.name", desc: "case.art.desc", image: "/media/case-art.jpg", alt: "ART.KZ" },
  { tag: "case.hiba.tag", name: "case.hiba.name", desc: "case.hiba.desc", image: "/media/case-hiba.jpg", alt: "HIBA" },
  { tag: "case.lev.tag", name: "case.lev.name", desc: "case.lev.desc", image: "/media/case-lev.jpg", alt: "Lev Telman" },
  { tag: "case.justai.tag", name: "case.justai.name", desc: "case.justai.desc", image: "/media/case-justai.jpg", alt: "Just AI" },
  { tag: "case.mirsot.tag", name: "case.mirsot.name", desc: "case.mirsot.desc", image: "/media/case-mirsot.jpg", alt: "Mirsot" },
  { tag: "case.kazparts.tag", name: "case.kazparts.name", desc: "case.kazparts.desc", image: "/media/case-kazparts.jpg", alt: "KazParts" },
  { tag: "case.ragroup.tag", name: "case.ragroup.name", desc: "case.ragroup.desc", image: "/media/case-ragroup.jpg", alt: "RA Group" }
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

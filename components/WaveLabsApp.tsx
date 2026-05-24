"use client";

import Image from "next/image";
import { createElement, type FormEvent, type JSX, useEffect, useMemo, useState } from "react";
import {
  assets,
  clients,
  faqItems,
  industries,
  marqueeItems,
  navItems,
  processSteps,
  scales,
  services,
  stats,
  teamMembers,
  techTags,
  testimonials,
  workItems
} from "@/data/site";
import { calculateEstimate, generateProposal } from "@/lib/calculator";
import { detectLocale, isLocale, translate } from "@/lib/i18n";
import type { CalculatorInput, LeadPayload, Locale, Theme } from "@/lib/types";
import { useWaveAnimations } from "@/components/useWaveAnimations";

function Html({ html, className, tag = "div" }: { html: string; className?: string; tag?: keyof JSX.IntrinsicElements }) {
  return createElement(tag, {
    className,
    dangerouslySetInnerHTML: { __html: html }
  });
}

function SectionLabel({ n, children, className = "rv" }: { n: string; children: string; className?: string }) {
  return (
    <div className={`s-label ${className}`} data-n={n}>
      {children}
    </div>
  );
}

function LeadForm({
  source,
  locale,
  submitClass,
  fieldClass,
  noteClass,
  onSuccess,
  estimate
}: {
  source: LeadPayload["source"];
  locale: Locale;
  submitClass: string;
  fieldClass: string;
  noteClass?: string;
  onSuccess?: () => void;
  estimate?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const t = (key: string) => translate(locale, key);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const formData = new FormData(event.currentTarget);
    const payload: LeadPayload = {
      name: String(formData.get("name") ?? ""),
      contact: String(formData.get("contact") ?? ""),
      message: String(formData.get("message") ?? ""),
      source,
      estimate
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    event.currentTarget.reset();
    setStatus("sent");
    onSuccess?.();
  }

  return (
    <form onSubmit={submit}>
      <div className={fieldClass}>
        <label>{t("modal.name")}</label>
        <input name="name" type="text" required placeholder={t("modal.name.ph")} />
      </div>
      <div className={fieldClass}>
        <label>{t("modal.contact")}</label>
        <input name="contact" type="text" required placeholder={t("modal.contact.ph")} />
      </div>
      <div className={fieldClass}>
        <label>{t("modal.project")}</label>
        <textarea name="message" rows={3} required placeholder={t("modal.project.ph")} />
      </div>
      <button type="submit" className={submitClass} disabled={status === "sending"}>
        {status === "sending"
          ? t("lead.sending")
          : status === "sent"
            ? t("lead.sent")
            : status === "error"
              ? t("lead.error")
              : t("modal.submit")}
      </button>
      {noteClass ? <p className={noteClass}>{status === "error" ? t("lead.error.note") : t("modal.note")}</p> : null}
    </form>
  );
}

export function WaveLabsApp() {
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [modalOpen, setModalOpen] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderOut, setLoaderOut] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [modalEstimate, setModalEstimate] = useState<string | undefined>();
  const [calculatorInput, setCalculatorInput] = useState<CalculatorInput>({
    idea: "",
    industry: "fintech",
    scale: "startup"
  });
  const [proposalLocale, setProposalLocale] = useState<Locale>("en");
  const [proposalVisible, setProposalVisible] = useState(false);

  useWaveAnimations();

  const t = (key: string) => translate(locale, key);
  const estimate = useMemo(() => calculateEstimate(calculatorInput), [calculatorInput]);
  const proposal = useMemo(
    () => generateProposal(calculatorInput, proposalLocale),
    [calculatorInput, proposalLocale]
  );
  const timelineText = `${estimate.timelineWeeks} ${t("calc.weeks")}`;

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("wl-lang");
    const nextLocale = isLocale(savedLocale) ? savedLocale : detectLocale(window.navigator.languages);
    const savedTheme = window.localStorage.getItem("wl-theme");
    const nextTheme: Theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
    window.queueMicrotask(() => {
      setLocale(nextLocale);
      setProposalLocale(nextLocale);
      setTheme(nextTheme);
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("wl-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("wl-lang", locale);
  }, [locale]);

  useEffect(() => {
    let progress = 0;
    const interval = window.setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 15);
      setLoaderProgress(Math.floor(progress));
      if (progress >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => setLoaderOut(true), 300);
      }
    }, 80);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const fallback = window.setTimeout(() => setHeroVideoReady(true), 3000);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const setLang = (value: Locale) => {
    setLocale(value);
    setProposalLocale(value);
  };

  return (
    <>
      <div id="progress" />

      <div id="loader" className={loaderOut ? "out" : ""} aria-hidden={loaderOut}>
        <div className="ld-logo">WAVELABS</div>
        <div className="ld-bar" />
        <div className="ld-n">{loaderProgress}%</div>
      </div>

      <div className="vsw" aria-label={t("theme.switcher")}>
        <button type="button" className={theme === "dark" ? "on" : ""} onClick={() => setTheme("dark")}>
          {t("theme.dark")}
        </button>
        <button type="button" className={theme === "light" ? "on" : ""} onClick={() => setTheme("light")}>
          {t("theme.light")}
        </button>
      </div>

      <nav id="nav">
        <a href="#" className="nav-logo" aria-label={t("nav.home")}>
          WL°
        </a>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{t(item.key)}</a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <div className="lang-sw" aria-label={t("lang.switcher")}>
            {(["en", "ru", "uz"] as Locale[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLang(item)}
                className={locale === item ? "active" : ""}
                aria-pressed={locale === item}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="nav-cta"
            onClick={() => {
              setModalEstimate(undefined);
              setModalOpen(true);
            }}
          >
            {t("nav.cta")}
          </button>
        </div>
      </nav>

      <section id="hero">
        <video
          id="hero-vid"
          className={heroVideoReady ? "ready" : ""}
          src={assets.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setHeroVideoReady(true)}
          onError={() => setHeroVideoReady(true)}
        />
        <div className="hero-tint" />
        <div className="hero-grid-lines" />

        <div className="hero-body">
          <div className="hero-chip">
            <div className="hero-dot" />
            <span className="chip-txt">{t("hero.chip")}</span>
          </div>
          <h1 className="hero-title" id="heroTitle">
            <span className="hero-line">{t("hero.title.1")}</span>
            <br />
            <span className="hero-line hero-line--accent">{t("hero.title.2")}</span>
            <br />
            <span className="hero-line hero-line--outline">{t("hero.title.3")}</span>
          </h1>

          <p className="hero-sub-lead">{t("hero.sub")}</p>

          <div className="hero-sub-row">
            {[
              ["hero.loc.label", "hero.loc.val"],
              ["hero.spec.label", "hero.spec.val"],
              ["hero.accred.label", "hero.accred.val"],
              ["hero.status.label", "hero.status.val"]
            ].map(([label, value]) => (
              <div className="hero-sub-col" key={label}>
                <div className="hs-label">{t(label)}</div>
                <Html tag="div" className="hs-val" html={t(value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="hsi-line" />
          <span className="hsi-txt">{t("hero.scroll")}</span>
        </div>
      </section>

      <div className="mq-wrap">
        <div className="mq-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`}>{t(item)}</span>
          ))}
        </div>
      </div>

      <section id="ecosystem">
        <div className="eco-inner">
          <div className="eco-label">{t("eco.label")}</div>
          <div className="eco-grid">
            {[
              ["IT PARK", "country.uzbekistan", "eco.itpark.status", "eco.itpark.desc"],
              ["AIFC", "country.kazakhstan", "eco.aifc.status", "eco.aifc.desc"],
              ["ASTANA HUB", "country.kazakhstan", "eco.hub.status", "eco.hub.desc"]
            ].map(([name, country, status, desc], index) => (
              <div className={`eco-card ${index === 1 ? "eco-card--mid" : ""}`} key={name}>
                <div className="eco-name">{name}</div>
                <div className="eco-country">{t(country)}</div>
                <div className="eco-status">{t(status)}</div>
                <div className="eco-desc">{t(desc)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="clients">
        <div className="cl-header">{t("clients.header")}</div>
        <div className="cl-rows">
          {clients.map((row, rowIndex) => (
            <div className="cl-row" key={rowIndex}>
              <div className={`cl-track ${rowIndex === 0 ? "cl-track--fwd" : "cl-track--rev"}`}>
                {[...row, ...row].map((client, index) => (
                  <span className="cl-chip" key={`${client}-${index}`}>
                    {client}
                    <span className="cl-badge">{rowIndex === 0 ? "KZ" : "UZ"}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="manifesto">
        <div className="mf-grid">
          <div className="mf-side rv">
            <SectionLabel n="01" className="">
              {t("about.label")}
            </SectionLabel>
            <p>{t("about.desc")}</p>
          </div>
          <Html tag="div" className="mf-body" html={t("manifesto")} />
        </div>
      </section>

      <div id="services-pin">
        <div className="sv-header">
          <Html tag="h2" className="sv-title rv" html={t("sv.title")} />
          <Html tag="div" className="sv-hint rv" html={t("sv.hint")} />
        </div>
        <div className="sv-track-wrap">
          <div className="sv-track" id="svTrack">
            {services.map((service, idx) => (
              <div className="sv-card" key={service.n}>
                {assets.serviceIcons[idx] ? (
                  <video
                    className="sv-icon"
                    src={assets.serviceIcons[idx]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="sv-n">{service.n}</div>
                <Html tag="div" className="sv-name" html={t(service.name)} />
                <div className="sv-desc">{t(service.desc)}</div>
                <div className="sv-tags">
                  {service.tags.map((tag) => (
                    <span className="sv-tag" key={tag}>
                      {t(tag) || tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="stats">
        <div className="st-grid">
          {stats.map((stat, index) => (
            <div className={`st-cell rv ${index ? `d${index}` : ""}`} key={stat.label}>
              <div className="st-n">
                <span className="cnt" data-v={stat.value}>
                  0
                </span>
                <sub>{stat.suffix}</sub>
              </div>
              <div className="st-l">{t(stat.label)}</div>
              <p className="st-evidence">{t(stat.evidence)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials">
        <SectionLabel n="03.5">{t("testi.label")}</SectionLabel>
        <div className="tm-grid rv">
          {testimonials.map((item) => (
            <div className="tm-card" key={item.text}>
              <div className="tm-qm">&quot;</div>
              <p className="tm-text">{t(item.text)}</p>
              <Html tag="div" className="tm-who" html={t(item.who)} />
            </div>
          ))}
        </div>
      </section>

      <section id="work">
        <div className="wk-head">
          <Html tag="h2" className="wk-title rv" html={t("work.title")} />
          <a href="#contact" className="wk-all rv">
            {t("work.all")}
          </a>
        </div>
        <div className="wk-grid rv">
          {workItems.map((item, index) => (
            <div className="wk-card" key={item.tag}>
              <div className="wk-img">
                <Image src={assets.workImages[index]} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
              </div>
              <div className="wk-overlay" />
              <div className="wk-glare" />
              <div className="wk-num">{String(index + 1).padStart(3, "0")}</div>
              <div className="wk-info">
                <div className="wk-tag">{t(item.tag)}</div>
                <Html tag="div" className="wk-name" html={t(item.name)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="process" style={{ position: "relative", overflow: "hidden" }}>
        <video
          src={assets.processVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.06,
            zIndex: 0,
            pointerEvents: "none"
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <SectionLabel n="04">{t("pr.label")}</SectionLabel>
          <Html tag="h2" className="pr-title rv" html={t("pr.title")} />
          <div className="pr-row">
            {processSteps.map((step, index) => (
              <div className={`pr-step rv ${index ? `d${index}` : ""}`} key={step.n}>
                <div className="pr-n">{step.n}</div>
                <Html tag="div" className="pr-t" html={t(step.title)} />
                <p className="pr-d">{t(step.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team">
        <div className="tm-head">
          <div>
            <SectionLabel n="05">{t("team.label")}</SectionLabel>
            <Html tag="h2" className="tm-ht rv" html={t("team.title")} />
          </div>
          <p className="tm-hp rv">{t("team.desc")}</p>
        </div>
        <div className="tm-row">
          {teamMembers.map((member, index) => (
            <div className={`tm-member rv ${index ? `d${index}` : ""}`} key={member.initials}>
              <div className="tm-av">{member.initials}</div>
              <div className="tm-name">{member.name}</div>
              <div className="tm-role">{t(member.role)}</div>
              <div className="tm-xp">{t(member.xp)}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="tech">
        <div className="tc-wrap">
          <div className="tc-left rv">
            <SectionLabel n="06" className="">
              {t("tech.label")}
            </SectionLabel>
            <Html tag="h2" html={t("tech.title")} />
            <p>{t("tech.desc")}</p>
          </div>
          <div className="tc-tags rv d1">
            {techTags.map((tag) => (
              <span className="tc-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="fq-head">
          <div>
            <SectionLabel n="07">{t("faq.label")}</SectionLabel>
            <Html tag="h2" className="fq-ht rv" html={t("faq.title")} />
          </div>
          <p className="fq-hp rv">{t("faq.subtitle")}</p>
        </div>
        <div className="fq-list rv">
          {faqItems.map((item, index) => (
            <div className={`fq-item ${openFaq === index ? "open" : ""}`} key={item.q}>
              <button type="button" className="fq-q" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                {t(item.q)}
                <span className="fq-t">+</span>
              </button>
              <div className="fq-a">
                <div className="fq-a-inner">{t(item.a)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="calculator">
        <SectionLabel n="08">{t("calc.label")}</SectionLabel>
        <div className="calc-head">
          <Html tag="h2" className="calc-title rv" html={t("calc.title")} />
          <Html tag="p" className="calc-sub rv d1" html={t("calc.sub")} />
        </div>
        <div className="calc-grid">
          <div className="calc-left">
            <div className="calc-field">
              <label>{t("calc.idea")}</label>
              <textarea
                value={calculatorInput.idea}
                placeholder={t("calc.idea.ph")}
                onChange={(event) => setCalculatorInput((value) => ({ ...value, idea: event.target.value }))}
              />
            </div>
            <div className="calc-select-row">
              <div>
                <label className="calc-small-label">{t("calc.industry")}</label>
                <select
                  className="calc-sel"
                  value={calculatorInput.industry}
                  onChange={(event) =>
                    setCalculatorInput((value) => ({ ...value, industry: event.target.value as CalculatorInput["industry"] }))
                  }
                >
                  {industries.map((industry) => (
                    <option value={industry.value} key={industry.value}>
                      {t(industry.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="calc-small-label">{t("calc.scale")}</label>
                <select
                  className="calc-sel"
                  value={calculatorInput.scale}
                  onChange={(event) =>
                    setCalculatorInput((value) => ({ ...value, scale: event.target.value as CalculatorInput["scale"] }))
                  }
                >
                  {scales.map((scale) => (
                    <option value={scale.value} key={scale.value}>
                      {t(scale.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              className="calc-kp-btn"
              onClick={() => {
                setProposalVisible(true);
                setProposalLocale(locale);
              }}
            >
              {t("calc.gen")}
            </button>
            {proposalVisible ? (
              <>
                <div className="calc-kp-lang" style={{ display: "flex" }}>
                  {(["en", "ru", "uz"] as Locale[]).map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={proposalLocale === item ? "active" : ""}
                      onClick={() => setProposalLocale(item)}
                    >
                      {item.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="calc-kp-output show">{proposal}</div>
              </>
            ) : null}
          </div>
          <div className="calc-right">
            <div className="calc-result">
              <div className="calc-result-label">{t("calc.estimate")}</div>
              <div className="calc-currency-row">
                <div className="calc-currency">
                  <div className="calc-currency-code">USD</div>
                  <div className="calc-currency-val usd">{estimate.display.usd}</div>
                </div>
                <div className="calc-currency">
                  <div className="calc-currency-code">EUR</div>
                  <div className="calc-currency-val">{estimate.display.eur}</div>
                </div>
                <div className="calc-currency">
                  <div className="calc-currency-code">UZS</div>
                  <div className="calc-currency-val">{estimate.display.uzs}</div>
                </div>
              </div>
              <div className="calc-timeline">
                {t("calc.timeline")} <span>{timelineText}</span>
              </div>
            </div>
            <button
              type="button"
              className="calc-apply-btn"
              onClick={() => {
                setModalEstimate(estimate.display.usd);
                setModalOpen(true);
              }}
            >
              {t("calc.apply")}
            </button>
          </div>
        </div>
      </section>

      <section id="contact">
        <video
          src={assets.contactVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.14,
            zIndex: 0,
            pointerEvents: "none"
          }}
        />
        <div className="ct-spotlight" />
        <div className="ct-inner">
          <div>
            <div className="ct-pre rv">{t("ct.pre")}</div>
            <Html tag="h2" className="ct-title rv" html={t("ct.title")} />
            <a href="mailto:hello@wavelabs.uz" className="ct-email rv">
              hello@wavelabs.uz
            </a>
          </div>
          <div className="rv d2">
            <div className="ct-form-eyebrow">{t("modal.eyebrow")}</div>
            <LeadForm
              locale={locale}
              source="contact"
              fieldClass="ct-field"
              submitClass="ct-submit"
              noteClass="ct-form-note"
            />
          </div>
        </div>
      </section>

      <footer>
        <div className="ft-logo">WaveLabs © 2026</div>
        <Html tag="div" className="ft-copy" html={t("footer.copy")} />
        <ul className="ft-links">
          <li>
            <a href="mailto:hello@wavelabs.uz">hello@wavelabs.uz</a>
          </li>
          <li>
            <a href="https://www.linkedin.com" rel="noreferrer" target="_blank">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://t.me" rel="noreferrer" target="_blank">
              Telegram
            </a>
          </li>
        </ul>
      </footer>

      <div id="modal-overlay" className={modalOpen ? "open" : ""} aria-hidden={!modalOpen}>
        <button type="button" className="modal-bg" aria-label={t("modal.close")} onClick={() => setModalOpen(false)} />
        <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
          <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>
            x
          </button>
          <div className="modal-eyebrow">{t("modal.eyebrow")}</div>
          <h3 className="modal-title" id="lead-modal-title">
            {t("modal.title")}
          </h3>
          <p className="modal-sub">{t("modal.sub")}</p>
          <LeadForm
            locale={locale}
            source={modalEstimate ? "calculator" : "modal"}
            fieldClass="modal-field"
            submitClass="modal-submit"
            estimate={modalEstimate}
            onSuccess={() => window.setTimeout(() => setModalOpen(false), 500)}
          />
          <p className="modal-note">{t("modal.note")}</p>
        </div>
      </div>

      <canvas id="cursor-canvas" />
    </>
  );
}

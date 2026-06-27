"use client";

import { useEffect } from "react";

export function useWaveAnimations() {
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    const cleanup: Array<() => void> = [];

    // CSS-fallback helpers: ensure content is visible and counters reach their
    // final value even if GSAP never runs (reduced motion or boot failure).
    const showAllReveals = () => {
      document.querySelectorAll<HTMLElement>(".rv").forEach((element) => element.classList.add("in"));
    };
    const finalizeCounters = () => {
      document.querySelectorAll<HTMLElement>(".cnt").forEach((element) => {
        const target = Number(element.dataset.v ?? 0);
        element.textContent = String(target);
        element.closest(".st-cell")?.classList.add("lit");
      });
    };

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced-motion guard: skip Lenis smooth-scroll, 3D tilt, char-reveal and
    // the custom cursor. Reveal everything and finalize counters immediately so
    // native scroll/cursor and all content keep working.
    if (reduceMotion) {
      showAllReveals();
      finalizeCounters();
      return;
    }

    async function boot() {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis")
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true
      });

      // Expose the Lenis instance so modal open/close can stop/start smooth
      // scroll (background scroll-lock).
      (window as unknown as { __wlLenis?: { stop(): void; start(): void } }).__wlLenis = lenis;
      cleanup.push(() => {
        delete (window as unknown as { __wlLenis?: unknown }).__wlLenis;
      });

      const progress = document.getElementById("progress");
      const onScroll = ({ progress: scrollProgress }: { progress: number }) => {
        if (progress) progress.style.width = `${scrollProgress * 100}%`;
        ScrollTrigger.update();
      };
      lenis.on("scroll", onScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      cleanup.push(() => {
        cancelAnimationFrame(frame);
        lenis.destroy();
      });

      const nav = document.getElementById("nav");
      const onNativeScroll = () => nav?.classList.toggle("stuck", window.scrollY > 60);
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      cleanup.push(() => window.removeEventListener("scroll", onNativeScroll));

      document.querySelectorAll<HTMLElement>(".rv").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true }
          }
        );
      });

      const track = document.getElementById("svTrack");
      const pin = document.getElementById("services-pin");
      if (track && pin && track.parentElement) {
        const distance = Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
        const progBar = document.getElementById("svProgBar");
        const progNum = document.getElementById("svProgNum");
        const cardCount = track.childElementCount;
        gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            pin: true,
            scrub: 0.8,
            end: `+=${distance + 200}`,
            invalidateOnRefresh: true,
            onUpdate: ({ progress: trackProgress }: { progress: number }) => {
              if (progBar) progBar.style.transform = `scaleX(${trackProgress})`;
              if (progNum && cardCount > 0) {
                const current = Math.min(cardCount, Math.floor(trackProgress * cardCount) + 1);
                progNum.textContent = String(current).padStart(2, "0");
              }
            }
          }
        });
      }

      document.querySelectorAll<HTMLElement>(".cnt").forEach((element) => {
        const target = Number(element.dataset.v ?? 0);
        gsap.fromTo(
          element,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.8,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
              once: true,
              onEnter: () => element.closest(".st-cell")?.classList.add("lit")
            }
          }
        );
      });

      gsap.from(".tc-tag", {
        opacity: 0,
        y: 16,
        stagger: { amount: 0.8, from: "random" },
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: "#tech", start: "top 72%", once: true }
      });

      document.querySelectorAll<HTMLElement>(".wk-card").forEach((card) => {
        const glare = card.querySelector<HTMLElement>(".wk-glare");
        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, { rotateY: x * 12, rotateX: -y * 12, duration: 0.3, ease: "power2.out" });
          glare?.style.setProperty("--mx", `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
          glare?.style.setProperty("--my", `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
        };
        const onLeave = () =>
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanup.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      const contact = document.getElementById("contact");
      const spotlight = document.querySelector<HTMLElement>(".ct-spotlight");
      if (contact && spotlight) {
        const onMove = (event: MouseEvent) => {
          const rect = contact.getBoundingClientRect();
          spotlight.style.left = `${event.clientX - rect.left}px`;
          spotlight.style.top = `${event.clientY - rect.top}px`;
        };
        contact.addEventListener("mousemove", onMove);
        cleanup.push(() => contact.removeEventListener("mousemove", onMove));
      }

      cleanup.push(() => ScrollTrigger.getAll().forEach((trigger) => trigger.kill()));
      ScrollTrigger.refresh();
    }

    // Boot can reject (dynamic import failure) or throw mid-init. In every
    // failure path, fall back to the CSS reveal so content is never stuck at
    // opacity:0, and finalize counters so they never read "0".
    boot().catch((error) => {
      if (cancelled) return;
      console.error("WaveLabs animation init failed", error);
      showAllReveals();
      finalizeCounters();
    });

    return () => {
      cancelled = true;
      cleanup.forEach((fn) => fn());
    };
  }, []);

  useEffect(() => {
    // Reduced motion: do not draw a custom cursor and never hide the native one
    // (the `cursor-ready` class below is what enables `cursor:none` in CSS).
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = document.getElementById("cursor-canvas") as HTMLCanvasElement | null;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const lerp = (a: number, b: number, factor: number) => a + (b - a) * factor;
    const withAlpha = (color: string, alpha: number) => {
      const value = color.trim();

      if (value.startsWith("#")) {
        const hex = value.slice(1);
        const normalized =
          hex.length === 3
            ? hex
                .split("")
                .map((char) => char + char)
                .join("")
            : hex.padEnd(6, "0").slice(0, 6);
        const int = Number.parseInt(normalized, 16);
        return `rgba(${(int >> 16) & 255},${(int >> 8) & 255},${int & 255},${alpha})`;
      }

      if (value.startsWith("rgb(")) {
        return value.replace("rgb(", "rgba(").replace(")", `,${alpha})`);
      }

      return value;
    };
    const readAccent = () => getComputedStyle(document.documentElement).getPropertyValue("--a").trim() || "#00D4FF";

    let mx = -200;
    let my = -200;
    let dx = -200;
    let dy = -200;
    let rx = -200;
    let ry = -200;
    let hovering = false;
    let pressing = false;
    let frame = 0;
    let cursorReady = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };
    const onLeave = () => {
      mx = -200;
      my = -200;
    };
    const onDown = () => {
      pressing = true;
    };
    const onUp = () => {
      pressing = false;
    };
    const hoverIn = () => {
      hovering = true;
    };
    const hoverOut = () => {
      hovering = false;
    };
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("a,button,img,input,textarea,select,.sv-card,.wk-card,.pr-step,.tc-tag,.fq-q,.tm-member,.cl-chip")
    );

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    targets.forEach((element) => {
      element.addEventListener("mouseenter", hoverIn);
      element.addEventListener("mouseleave", hoverOut);
    });

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      dx = lerp(dx, mx, 0.2);
      dy = lerp(dy, my, 0.2);
      rx = lerp(rx, mx, 0.1);
      ry = lerp(ry, my, 0.1);

      if (dx > -150) {
        const accent = readAccent();
        const dotRadius = pressing ? 5 : 4;
        const ringRadius = pressing ? 11 : hovering ? 23 : 14;

        if (hovering) {
          ctx.beginPath();
          ctx.arc(rx, ry, ringRadius + 7, 0, Math.PI * 2);
          ctx.strokeStyle = withAlpha(accent, 0.14);
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(dx, dy, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rx, ry, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = withAlpha(accent, hovering ? 0.9 : 0.56);
        ctx.lineWidth = hovering ? 1.75 : 1.35;
        ctx.stroke();
      }

      // Hide the native cursor only once the canvas cursor is actually drawing.
      if (!cursorReady) {
        cursorReady = true;
        document.documentElement.classList.add("cursor-ready");
      }

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("cursor-ready");
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      targets.forEach((element) => {
        element.removeEventListener("mouseenter", hoverIn);
        element.removeEventListener("mouseleave", hoverOut);
      });
    };
  }, []);
}

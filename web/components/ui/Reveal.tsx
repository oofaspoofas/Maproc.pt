"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || !("IntersectionObserver" in window)) return;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (!media.matches)
            animation = element.animate(
              [
                { transform: "translateY(20px)" },
                { transform: "translateY(0)" },
              ],
              { duration: 600, easing: "cubic-bezier(.16,1,.3,1)" },
            );
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    const stopMotion = () => {
      if (media.matches) animation?.cancel();
    };
    media.addEventListener("change", stopMotion);
    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.cancel();
      media.removeEventListener("change", stopMotion);
    };
  }, []);
  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}

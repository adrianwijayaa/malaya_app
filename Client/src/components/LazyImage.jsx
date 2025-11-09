import React, { useEffect, useRef, useState } from "react";

const SHIMMER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='9' viewBox='0 0 16 9'>
      <defs>
        <linearGradient id='g'>
          <stop stop-color='#d1d5db' offset='0'/>
          <stop stop-color='#e5e7eb' offset='0.5'/>
          <stop stop-color='#d1d5db' offset='1'/>
        </linearGradient>
      </defs>
      <rect rx='2' width='100%' height='100%' fill='url(#g)'>
        <animate attributeName='x' from='-100%' to='100%' dur='1.2s' repeatCount='indefinite'/>
      </rect>
    </svg>`
  );

export default function LazyImage({ src, alt = "", className = "", onClick }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      onClick={onClick}
    >
      {/* placeholder */}
      {!loaded && (
        <img
          src={SHIMMER}
          alt=""
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(4px)",
          }}
        />
      )}
      {/* real image */}
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: loaded ? "static" : "absolute",
            inset: 0,
            opacity: loaded ? 1 : 0,
            transition: "opacity 400ms ease",
            display: "block",
          }}
          loading="lazy"
        />
      )}
    </div>
  );
}

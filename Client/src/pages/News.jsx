// src/pages/News.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import api, { BASE_URL } from "../api/axiosConfig";
import "./News.css";

const PAGE_SIZE = 5;

function useQP() {
  const [params, setParams] = useSearchParams();
  const get = (k, d = "") => params.get(k) ?? d;
  const set = (k, v) => {
    const next = new URLSearchParams(params);
    if (!v) next.delete(k);
    else next.set(k, String(v));
    setParams(next, { replace: true });
  };
  return { get, set };
}

function formatDate(yyyyMMdd) {
  if (!yyyyMMdd) return "";
  // yyyy-mm-dd → Date in local TZ
  const [y, m, d] = String(yyyyMMdd).split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function imageSrc(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = BASE_URL?.replace(/\/+$/, "") || "";
  const path = String(url).startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}

export default function News() {
  const location = useLocation();
  const mode = location.state?.mode || "";
  const containerRef = useRef(null);
  const { get, set } = useQP();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemsAll, setItemsAll] = useState([]);

  const sort = get("sort", "new"); // 'new' | 'old'
  const p = Math.max(1, parseInt(get("p", "1"), 10) || 1);

  // fetch once (active only)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/news", {
          params: { status: "active", sort: "date", order: "DESC" },
        });
        if (!alive) return;
        setItemsAll(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!alive) return;
        setError("Failed to load news.");
        setItemsAll([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const list = useMemo(() => {
    const arr = [...itemsAll];
    arr.sort((a, b) => {
      const da = new Date(a?.date || "1970-01-01").getTime();
      const db = new Date(b?.date || "1970-01-01").getTime();
      return sort === "old" ? da - db : db - da;
    });
    return arr;
  }, [itemsAll, sort]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(p, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const items = list.slice(start, start + PAGE_SIZE);

  const goto = (n) => {
    set("p", String(n));
    window.scrollTo({ top: 10, behavior: "smooth" });
  };

  const latest = useMemo(() => list.slice(0, 2), [list]);

  const featured = useMemo(() => {
    const f = list.filter((i) => !!i.featured);
    if (f.length >= 3) return f.slice(0, 3);
    const fb = list.slice(0, 2);
    return f.length ? [...f, ...fb].slice(0, 3) : fb;
  }, [list]);

  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="maRail-page" aria-label="News">
      <div className={`maRail-sticky ${showSticky ? "is-show" : ""}`}>
        <div className="maRail-stickyInner">
          <div className="maRail-stickyTitle">News</div>
          <select
            className="maRail-stickySort"
            value={sort}
            onChange={(e) => {
              set("sort", e.target.value);
              set("p", "1");
            }}
            aria-label="Sort"
          >
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
          </select>
        </div>
      </div>

      <div className="maRail-container">
        <div className="maRail-layout">
          <header className="maRail-head" ref={containerRef}>
            <h1 className="maRail-title">News & Stories</h1>
            <p className="maRail-sub">
              Fresh guides, trip reports, and updates.
            </p>
          </header>

          <aside className="maRail-side">
            <div className="maRail-box">
              <div className="maRail-sideTitle">Featured</div>
              <ul className="maRail-miniList">
                {(featured || []).map((it) => (
                  <li key={it.slug}>
                    <Link to={`/news/${it.slug}`} className="maRail-miniItem">
                      <img src={imageSrc(it.imageUrl)} alt="" loading="lazy" />
                      <span>{it.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="maRail-box">
              <div className="maRail-sideTitle">Latest Updates</div>
              <ul className="maRail-linkList">
                {(latest || []).map((it) => (
                  <li key={it.slug}>
                    <Link to={`/news/${it.slug}`}>{it.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="maRail-box">
              <div className="maRail-sideTitle">Newsletter</div>
              <p className="maRail-note">
                Get new trip stories and guides in your inbox.
              </p>
              <a href="#subscribe" className="maRail-subBtn">
                Subscribe
              </a>
            </div>
          </aside>

          <main className="maRail-main" role="list">
            {loading ? (
              <div className="maRail-empty">Loading…</div>
            ) : error ? (
              <div className="maRail-empty">{error}</div>
            ) : items.length === 0 ? (
              <div className="maRail-empty">No articles found.</div>
            ) : (
              items.map((it) => (
                <article key={it.slug} className="maRail-row" role="listitem">
                  <Link to={`/news/${it.slug}`} className="maRail-thumb">
                    <img src={imageSrc(it.imageUrl)} alt="" loading="lazy" />
                  </Link>
                  <div className="maRail-body">
                    <h2 className="maRail-itemTitle">
                      <Link to={`/news/${it.slug}`}>{it.title}</Link>
                    </h2>
                    <p className="maRail-desc">{it.desc}</p>
                    <div className="maRail-metaRow">
                      <div className="maRail-meta">
                        <time dateTime={it.date}>{formatDate(it.date)}</time>
                        <span>•</span>
                        <span>{it.readTime} min read</span>
                      </div>
                      <Link to={`/news/${it.slug}`} className="maRail-readBtn">
                        Read news →
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}

            {totalPages > 1 && !loading && !error && (
              <nav className="maRail-pagination" aria-label="Pagination">
                <button
                  className="maRail-navBtn"
                  disabled={page <= 1}
                  onClick={() => goto(page - 1)}
                >
                  ← Prev
                </button>
                <div className="maRail-pages">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    const on = n === page;
                    return (
                      <button
                        key={n}
                        className={`maRail-page ${on ? "is-on" : ""}`}
                        onClick={() => goto(n)}
                        aria-current={on ? "page" : undefined}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <button
                  className="maRail-navBtn"
                  disabled={page >= totalPages}
                  onClick={() => goto(page + 1)}
                >
                  Next →
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

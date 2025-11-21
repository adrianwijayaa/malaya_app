// src/pages/NewsDetail.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api, { BASE_URL } from "../api/axiosConfig";
import "./NewsDetail.css";

function formatDate(yyyyMMdd) {
  if (!yyyyMMdd) return "";
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

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const barRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [listAll, setListAll] = useState([]);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState({});

  // progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const h = el.scrollHeight - el.clientHeight || 1;
      const w = (el.scrollTop / h) * 100;
      if (barRef.current) barRef.current.style.width = `${w}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fetch article + list
  useEffect(() => {
    let alive = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [detail, list] = await Promise.all([
          api.get(`/news/slug/${slug}`),
          api.get("/news", {
            params: { status: "active", sort: "date", order: "DESC" },
          }),
        ]);
        if (!alive) return;
        setArticle(detail?.data?.data || null);
        setListAll(Array.isArray(list.data) ? list.data : []);
      } catch (e) {
        if (!alive) return;
        setError("Article not found.");
        setArticle(null);
        setListAll([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const md = useMemo(() => {
    if (!article) return "";
    return String(article.desc || "");
  }, [article]);

  const idx = useMemo(() => {
    if (!article) return -1;
    return listAll.findIndex((i) => i.slug === article.slug);
  }, [listAll, article]);

  const prev = idx > 0 ? listAll[idx - 1] : null;
  const next = idx >= 0 && idx < listAll.length - 1 ? listAll[idx + 1] : null;

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const moreStories = useMemo(() => {
    if (!article) return [];
    const byDate = [...listAll]
      .filter((i) => i.slug !== article.slug)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const pick = [];
    const seen = new Set();
    // kategori tidak wajib ada di model — fallback tanpa filter kalau undefined
    for (const it of byDate) {
      const cat = it.category ?? "__no_cat__";
      if (!seen.has(cat)) {
        pick.push(it);
        seen.add(cat);
        if (pick.length >= 6) break;
      }
    }
    if (pick.length < 6) {
      for (const it of byDate) {
        if (pick.find((p) => p.slug === it.slug)) continue;
        pick.push(it);
        if (pick.length >= 6) break;
      }
    }
    return pick;
  }, [article, listAll]);

  const mdComponents = {
    h1: (p) => <h2 {...p} />,
    h2: (p) => <h3 {...p} />,
    h3: (p) => <h4 {...p} />,
    img: (p) => <img {...p} loading="lazy" />,
    a: (p) => <a {...p} target="_blank" rel="noreferrer" />,
    code: (p) => <code {...p} />,
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" && next) navigate(`/news/${next.slug}`);
      if (e.key === "ArrowLeft" && prev) navigate(`/news/${prev.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, navigate]);

  if (loading) {
    return (
      <>
        <div className="maND3-progress" ref={barRef} aria-hidden />
        <section className="maND3-page">
          <div className="maND3-empty">
            <p>Loading…</p>
            <Link className="maND3-btn" to="/news">
              Back to News
            </Link>
          </div>
        </section>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <div className="maND3-progress" ref={barRef} aria-hidden />
        <section className="maND3-page">
          <div className="maND3-empty">
            <p>{error || "Article not found."}</p>
            <Link className="maND3-btn" to="/news">
              Back to News
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="maND3-progress" ref={barRef} aria-hidden />
      <article className="maND3-page">
        <div className="maND3-grid">
          {/* LEFT: Main article (70%) */}
          <main className="maND3-main">
            <header className="maND3-hero">
              {article.imageUrl && !imageErrors['hero'] ? (
                <img 
                  src={imageSrc(article.imageUrl)} 
                  alt="" 
                  onError={() => handleImageError('hero')}
                />
              ) : null}
            </header>

            <div className="maND3-head">
              <h1 className="maND3-title">{article.title}</h1>
              <div className="maND3-meta">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span className="maND3-dot" />
                <span>{article.readTime} min read</span>
              </div>
            </div>

            <div className="maND3-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={mdComponents}
              >
                {md}
              </ReactMarkdown>

              <nav className="maND3-bottom" aria-label="Article navigation">
                <Link to="/news" className="maND3-btn">
                  ← Back to News
                </Link>
                <div className="maND3-spacer" />
                {prev ? (
                  <Link to={`/news/${prev.slug}`} className="maND3-minBtn">
                    Prev
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link to={`/news/${next.slug}`} className="maND3-minBtn">
                    Next
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            </div>
          </main>

          {/* RIGHT: More Stories (30%) */}
          <aside className="maND3-side" aria-label="More stories">
            <div className="maND3-sideBox">
              <div className="maND3-sideTitle">More Stories</div>
              <ul className="maND3-cardList">
                {moreStories.map((it) => (
                  <li key={it.slug}>
                    <Link to={`/news/${it.slug}`} className="maND3-cardItem">
                      <div className="maND3-cardThumb">
                        {it.imageUrl && !imageErrors[it.slug] ? (
                          <img
                            src={imageSrc(it.imageUrl)}
                            alt=""
                            loading="lazy"
                            onError={() => handleImageError(it.slug)}
                          />
                        ) : null}
                      </div>
                      <div className="maND3-cardBody">
                        <h3 className="maND3-cardTitle">{it.title}</h3>
                        <div className="maND3-cardMeta">
                          <time dateTime={it.date}>{formatDate(it.date)}</time>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

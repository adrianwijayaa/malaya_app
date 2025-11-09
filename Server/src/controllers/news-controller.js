const Model = require("../models");
const { Op } = require("sequelize");
const News = Model.News;

// Terima:
// - kosong/null (opsional)
// - URL absolut https
// - http untuk localhost/127.0.0.1 (dev)
// - path relatif yang diawali "/uploads/"
const isSafeUrl = (url) => {
  if (!url) return true;
  try {
    // izinkan path relatif uploads
    if (typeof url === "string" && url.startsWith("/uploads/")) return true;

    const u = new URL(url);

    // https absolut (prod)
    if (u.protocol === "https:" && url.length <= 500) return true;

    // http absolut tapi hanya untuk localhost/dev
    const isLocal =
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1" ||
      u.hostname === "0.0.0.0";
    if (isLocal && u.protocol === "http:" && url.length <= 500) return true;

    return false;
  } catch {
    return false;
  }
};

const required = (body, fields) => {
  for (const [k, msg] of Object.entries(fields)) {
    if (body[k] === undefined || body[k] === null || body[k] === "") return msg;
  }
  return null;
};

// konversi aman ke boolean dari string/bool
const toBool = (v, fallback = false) =>
  v === true || v === "true"
    ? true
    : v === false || v === "false"
    ? false
    : fallback;

/**
 * POST /news
 */
exports.createNews = async (req, res) => {
  try {
    const err = required(req.body, {
      title: "title is required",
      desc: "desc is required",
      slug: "slug is required",
      date: "date is required",
      readTime: "readTime is required",
    });
    if (err) return res.status(400).json({ message: err });

    if (!Number.isInteger(+req.body.readTime) || +req.body.readTime < 1)
      return res
        .status(400)
        .json({ message: "readTime must be a positive integer" });

    if (req.body.imageUrl && !isSafeUrl(req.body.imageUrl))
      return res.status(400).json({ message: "imageUrl is invalid/unsafe" });

    const exists = await News.findOne({ where: { slug: req.body.slug } });
    if (exists) return res.status(409).json({ message: "slug already exists" });

    const row = await News.create({
      title: req.body.title,
      desc: req.body.desc,
      imageUrl: req.body.imageUrl || null, // boleh null atau "/uploads/.."
      slug: req.body.slug,
      date: req.body.date, // "YYYY-MM-DD"
      readTime: +req.body.readTime,
      featured: !!req.body.featured,
      body: req.body.body || null,
      isActive:
        req.body.isActive !== undefined
          ? toBool(req.body.isActive, true)
          : true,
    });

    return res.status(201).json({ message: "News created", data: row });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * GET /news?status=active|archived&q=...&sort=date|title&order=asc|desc
 * - Kompatibel tanpa query param (kembalikan semua)
 */
exports.getAllNews = async (req, res) => {
  try {
    const { status, q, sort = "date", order = "DESC" } = req.query;

    const where = {};
    if (status === "active") where.isActive = true;
    if (status === "archived") where.isActive = false;

    if (q && String(q).trim()) {
      const kw = `%${String(q).trim()}%`;
      where[Op.or] = [
        { title: { [Op.like]: kw } },
        { slug: { [Op.like]: kw } },
      ];
    }

    const sortCol = sort === "title" ? "title" : "date";
    const sortDir = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const rows = await News.findAll({
      where,
      order: [[sortCol, sortDir]],
    });

    if (!rows.length) return res.status(404).json({ message: "No news found" });
    return res.json(rows);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * GET /news/:id
 */
exports.getNewsById = async (req, res) => {
  try {
    const row = await News.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "News not found" });
    return res.json({ data: row });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * GET /news/slug/:slug
 */
exports.getNewsBySlug = async (req, res) => {
  try {
    const row = await News.findOne({ where: { slug: req.params.slug } });
    if (!row) return res.status(404).json({ message: "News not found" });
    return res.json({ data: row });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * PUT /news/:id
 */
exports.updateNews = async (req, res) => {
  try {
    const row = await News.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "News not found" });

    if (req.body.slug && req.body.slug !== row.slug) {
      const dup = await News.findOne({ where: { slug: req.body.slug } });
      if (dup) return res.status(409).json({ message: "slug already exists" });
    }

    if (req.body.readTime !== undefined) {
      if (!Number.isInteger(+req.body.readTime) || +req.body.readTime < 1)
        return res
          .status(400)
          .json({ message: "readTime must be a positive integer" });
    }

    if (req.body.imageUrl !== undefined && !isSafeUrl(req.body.imageUrl))
      return res.status(400).json({ message: "imageUrl is invalid/unsafe" });

    await row.update({
      title: req.body.title ?? row.title,
      desc: req.body.desc ?? row.desc,
      imageUrl: req.body.imageUrl ?? row.imageUrl,
      slug: req.body.slug ?? row.slug,
      date: req.body.date ?? row.date,
      readTime: req.body.readTime ?? row.readTime,
      featured:
        req.body.featured !== undefined ? !!req.body.featured : row.featured,
      body: req.body.body ?? row.body,
      isActive:
        req.body.isActive !== undefined
          ? toBool(req.body.isActive, row.isActive)
          : row.isActive,
    });

    const updated = await News.findByPk(row.id);
    return res.json({ message: "News updated", data: updated });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * DELETE /news/:id
 */
exports.deleteNews = async (req, res) => {
  try {
    const row = await News.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "News not found" });
    await row.destroy();
    return res.json({ message: "News deleted" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

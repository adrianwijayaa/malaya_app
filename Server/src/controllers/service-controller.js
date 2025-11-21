const Model = require("../models");
const { Op } = require("sequelize");
const Service = Model.Service;

// Helper: Safe URL validation
const isSafeUrl = (url) => {
  if (!url) return true;
  try {
    if (typeof url === "string" && url.startsWith("/uploads/")) return true;
    const u = new URL(url);
    if (u.protocol === "https:" && url.length <= 500) return true;
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

// Helper: Required fields validation
const required = (body, fields) => {
  for (const [k, msg] of Object.entries(fields)) {
    if (body[k] === undefined || body[k] === null || body[k] === "")
      return msg;
  }
  return null;
};

// Helper: Convert to boolean
const toBool = (v, fallback = false) =>
  v === true || v === "true"
    ? true
    : v === false || v === "false"
    ? false
    : fallback;

/**
 * POST /services
 * Create new service (Admin only)
 */
exports.createService = async (req, res) => {
  try {
    const err = required(req.body, {
      name: "name is required",
      slug: "slug is required",
      description: "description is required",
      price: "price is required",
    });
    if (err) return res.status(400).json({ message: err });

    if (req.body.imageUrl && !isSafeUrl(req.body.imageUrl))
      return res.status(400).json({ message: "imageUrl is invalid/unsafe" });

    // Check if slug already exists
    const exists = await Service.findOne({ where: { slug: req.body.slug } });
    if (exists)
      return res.status(409).json({ message: "slug already exists" });

    // Validate rating if provided
    if (req.body.rating !== undefined) {
      const rating = parseFloat(req.body.rating);
      if (isNaN(rating) || rating < 0 || rating > 5)
        return res
          .status(400)
          .json({ message: "rating must be between 0 and 5" });
    }

    // Validate reviews if provided
    if (req.body.reviews !== undefined) {
      if (!Number.isInteger(+req.body.reviews) || +req.body.reviews < 0)
        return res
          .status(400)
          .json({ message: "reviews must be a non-negative integer" });
    }

    const row = await Service.create({
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      rating: req.body.rating || 4.5,
      reviews: req.body.reviews || 0,
      imageUrl: req.body.imageUrl || null,
      detailDescription: req.body.detailDescription || null,
      packages: req.body.packages || [],
      valueProps: req.body.valueProps || [],
      testimonials: req.body.testimonials || [],
      isActive:
        req.body.isActive !== undefined
          ? toBool(req.body.isActive, true)
          : true,
    });

    return res.status(201).json({ message: "Service created", data: row });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * GET /services
 * Get all services (Public)
 * Query params: status=active|archived, q=search
 */
exports.getAllServices = async (req, res) => {
  try {
    const { status, q } = req.query;

    const where = {};
    if (status === "active") where.isActive = true;
    if (status === "archived") where.isActive = false;

    if (q && String(q).trim()) {
      const kw = `%${String(q).trim()}%`;
      where[Op.or] = [
        { name: { [Op.like]: kw } },
        { slug: { [Op.like]: kw } },
        { description: { [Op.like]: kw } },
      ];
    }

    const rows = await Service.findAll({
      where,
      order: [["name", "ASC"]],
      attributes: [
        "id",
        "name",
        "slug",
        "description",
        "price",
        "rating",
        "reviews",
        "imageUrl",
        "isActive",
      ],
    });

    if (!rows.length)
      return res.status(404).json({ message: "No services found" });
    return res.json(rows);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * GET /services/:id
 * Get service by ID (Public)
 */
exports.getServiceById = async (req, res) => {
  try {
    const row = await Service.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Service not found" });
    return res.json({ data: row });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * GET /services/slug/:slug
 * Get service by slug (Public)
 */
exports.getServiceBySlug = async (req, res) => {
  try {
    const row = await Service.findOne({ where: { slug: req.params.slug } });
    if (!row) return res.status(404).json({ message: "Service not found" });
    return res.json({ data: row });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * PUT /services/:id
 * Update service (Admin only)
 */
exports.updateService = async (req, res) => {
  try {
    const row = await Service.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Service not found" });

    // Check slug uniqueness if changing
    if (req.body.slug && req.body.slug !== row.slug) {
      const dup = await Service.findOne({ where: { slug: req.body.slug } });
      if (dup)
        return res.status(409).json({ message: "slug already exists" });
    }

    // Validate rating if provided
    if (req.body.rating !== undefined) {
      const rating = parseFloat(req.body.rating);
      if (isNaN(rating) || rating < 0 || rating > 5)
        return res
          .status(400)
          .json({ message: "rating must be between 0 and 5" });
    }

    // Validate reviews if provided
    if (req.body.reviews !== undefined) {
      if (!Number.isInteger(+req.body.reviews) || +req.body.reviews < 0)
        return res
          .status(400)
          .json({ message: "reviews must be a non-negative integer" });
    }

    if (req.body.imageUrl !== undefined && !isSafeUrl(req.body.imageUrl))
      return res.status(400).json({ message: "imageUrl is invalid/unsafe" });

    await row.update({
      name: req.body.name ?? row.name,
      slug: req.body.slug ?? row.slug,
      description: req.body.description ?? row.description,
      price: req.body.price ?? row.price,
      rating: req.body.rating ?? row.rating,
      reviews: req.body.reviews ?? row.reviews,
      imageUrl: req.body.imageUrl ?? row.imageUrl,
      detailDescription: req.body.detailDescription ?? row.detailDescription,
      packages: req.body.packages ?? row.packages,
      valueProps: req.body.valueProps ?? row.valueProps,
      testimonials: req.body.testimonials ?? row.testimonials,
      isActive:
        req.body.isActive !== undefined
          ? toBool(req.body.isActive, row.isActive)
          : row.isActive,
    });

    const updated = await Service.findByPk(row.id);
    return res.json({ message: "Service updated", data: updated });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

/**
 * DELETE /services/:id
 * Delete service (Admin only)
 */
exports.deleteService = async (req, res) => {
  try {
    const row = await Service.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Service not found" });
    await row.destroy();
    return res.json({ message: "Service deleted" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};


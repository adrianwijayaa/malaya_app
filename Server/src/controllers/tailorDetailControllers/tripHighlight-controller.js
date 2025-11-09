"use strict";
const { Trip, TripHighlight } = require("../../models");

exports.createHighlight = async (req, res) => {
  try {
    const { TripID, imageUrl, caption, sortOrder } = req.body;
    if (!TripID || !imageUrl || !caption)
      return res
        .status(400)
        .json({ message: "TripID, imageUrl, caption are required" });
    if (!(await Trip.findByPk(TripID)))
      return res.status(400).json({ message: "Invalid TripID" });
    const row = await TripHighlight.create({
      TripID,
      imageUrl,
      caption,
      sortOrder: sortOrder ?? 0,
    });
    res.status(201).json({ message: "Highlight created", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllHighlights = async (_req, res) => {
  try {
    const rows = await TripHighlight.findAll();
    if (!rows.length)
      return res.status(404).json({ message: "No highlights found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getHighlightById = async (req, res) => {
  try {
    const row = await TripHighlight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Highlight not found" });
    res.json({ message: "Highlight found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateHighlight = async (req, res) => {
  try {
    const row = await TripHighlight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Highlight not found" });
    await row.update(req.body);
    res.json({ message: "Highlight updated", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteHighlight = async (req, res) => {
  try {
    const row = await TripHighlight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Highlight not found" });
    await row.destroy();
    res.json({ message: "Highlight deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

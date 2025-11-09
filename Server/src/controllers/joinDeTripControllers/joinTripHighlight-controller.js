"use strict";
const { JoinTrip, JoinTripHighlight } = require("../../models");

exports.createJoinTripHighlight = async (req, res) => {
  try {
    const { JoinTripID, imageUrl, text, sortOrder } = req.body;
    if (!JoinTripID || !imageUrl || !text)
      return res
        .status(400)
        .json({ message: "JoinTripID, imageUrl, text are required" });
    if (!(await JoinTrip.findByPk(JoinTripID)))
      return res.status(400).json({ message: "Invalid JoinTripID" });
    const row = await JoinTripHighlight.create({
      JoinTripID,
      imageUrl,
      text,
      sortOrder: sortOrder ?? 0,
    });
    res.status(201).json({ message: "Highlight created", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllJoinTripHighlights = async (_req, res) => {
  try {
    const rows = await JoinTripHighlight.findAll();
    if (!rows.length)
      return res.status(404).json({ message: "No highlights found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getJoinTripHighlightById = async (req, res) => {
  try {
    const row = await JoinTripHighlight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Highlight not found" });
    res.json({ message: "Highlight found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateJoinTripHighlight = async (req, res) => {
  try {
    const row = await JoinTripHighlight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Highlight not found" });
    await row.update(req.body);
    res.json({ message: "Highlight updated", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteJoinTripHighlight = async (req, res) => {
  try {
    const row = await JoinTripHighlight.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Highlight not found" });
    await row.destroy();
    res.json({ message: "Highlight deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

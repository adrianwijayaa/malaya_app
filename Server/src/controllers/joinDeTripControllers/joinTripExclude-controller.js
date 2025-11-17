"use strict";
const { JoinTrip, JoinTripExclude } = require("../../models");

exports.createExclude = async (req, res) => {
  try {
    const { JoinTripID, label, sortOrder } = req.body;
    if (!JoinTripID || !label)
      return res
        .status(400)
        .json({ message: "JoinTripID and label are required" });
    if (!(await JoinTrip.findByPk(JoinTripID)))
      return res.status(400).json({ message: "Invalid JoinTripID" });
    const row = await JoinTripExclude.create({
      JoinTripID,
      label,
      sortOrder: sortOrder ?? 0,
    });
    res.status(201).json({ message: "Exclude created", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllExcludes = async (_req, res) => {
  try {
    const rows = await JoinTripExclude.findAll();
    if (!rows.length)
      return res.status(404).json({ message: "No excludes found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExcludeById = async (req, res) => {
  try {
    const row = await JoinTripExclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Exclude not found" });
    res.json({ message: "Exclude found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateExclude = async (req, res) => {
  try {
    const row = await JoinTripExclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Exclude not found" });
    await row.update(req.body);
    res.json({ message: "Exclude updated", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteExclude = async (req, res) => {
  try {
    const row = await JoinTripExclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Exclude not found" });
    await row.destroy();
    res.json({ message: "Exclude deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

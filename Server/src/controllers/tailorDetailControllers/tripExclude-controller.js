"use strict";
const { Trip, TripExclude } = require("../../models");

exports.createExclude = async (req, res) => {
  try {
    const { TripID, label, sortOrder } = req.body;
    if (!TripID || !label)
      return res.status(400).json({ message: "TripID and label are required" });
    if (!(await Trip.findByPk(TripID)))
      return res.status(400).json({ message: "Invalid TripID" });
    const row = await TripExclude.create({
      TripID,
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
    const rows = await TripExclude.findAll();
    if (!rows.length)
      return res.status(404).json({ message: "No excludes found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExcludeById = async (req, res) => {
  try {
    const row = await TripExclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Exclude not found" });
    res.json({ message: "Exclude found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateExclude = async (req, res) => {
  try {
    const row = await TripExclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Exclude not found" });
    await row.update(req.body);
    res.json({ message: "Exclude updated", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteExclude = async (req, res) => {
  try {
    const row = await TripExclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Exclude not found" });
    await row.destroy();
    res.json({ message: "Exclude deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

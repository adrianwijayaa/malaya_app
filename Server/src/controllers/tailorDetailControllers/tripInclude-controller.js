"use strict";
const { Trip, TripInclude } = require("../../models");

exports.createInclude = async (req, res) => {
  try {
    const { TripID, label, sortOrder } = req.body;
    if (!TripID || !label)
      return res.status(400).json({ message: "TripID and label are required" });
    if (!(await Trip.findByPk(TripID)))
      return res.status(400).json({ message: "Invalid TripID" });
    const row = await TripInclude.create({
      TripID,
      label,
      sortOrder: sortOrder ?? 0,
    });
    res.status(201).json({ message: "Include created", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllIncludes = async (_req, res) => {
  try {
    const rows = await TripInclude.findAll();
    if (!rows.length)
      return res.status(404).json({ message: "No includes found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getIncludeById = async (req, res) => {
  try {
    const row = await TripInclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Include not found" });
    res.json({ message: "Include found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateInclude = async (req, res) => {
  try {
    const row = await TripInclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Include not found" });
    await row.update(req.body);
    res.json({ message: "Include updated", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteInclude = async (req, res) => {
  try {
    const row = await TripInclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Include not found" });
    await row.destroy();
    res.json({ message: "Include deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

"use strict";
const { JoinTrip, JoinTripInclude } = require("../../models");

exports.createJoinTripInclude = async (req, res) => {
  try {
    const { JoinTripID, title, sortOrder } = req.body;
    if (!JoinTripID || !title)
      return res
        .status(400)
        .json({ message: "JoinTripID, title are required" });
    if (!(await JoinTrip.findByPk(JoinTripID)))
      return res.status(400).json({ message: "Invalid JoinTripID" });
    const row = await JoinTripInclude.create({
      JoinTripID,
      title,
      sortOrder: sortOrder ?? 0,
    });
    res.status(201).json({ message: "Include created", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllJoinTripIncludes = async (_req, res) => {
  try {
    const rows = await JoinTripInclude.findAll();
    if (!rows.length)
      return res.status(404).json({ message: "No includes found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getJoinTripIncludeById = async (req, res) => {
  try {
    const row = await JoinTripInclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Include not found" });
    res.json({ message: "Include found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateJoinTripInclude = async (req, res) => {
  try {
    const row = await JoinTripInclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Include not found" });
    await row.update(req.body);
    res.json({ message: "Include updated", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteJoinTripInclude = async (req, res) => {
  try {
    const row = await JoinTripInclude.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Include not found" });
    await row.destroy();
    res.json({ message: "Include deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

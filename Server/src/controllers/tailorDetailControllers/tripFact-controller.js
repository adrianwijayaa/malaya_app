"use strict";
const { Trip, TripFact } = require("../../models");

exports.createFact = async (req, res) => {
  try {
    const { TripID, key, value } = req.body;
    if (!TripID || !key || !value)
      return res
        .status(400)
        .json({ message: "TripID, key, value are required" });
    if (!(await Trip.findByPk(TripID)))
      return res.status(400).json({ message: "Invalid TripID" });
    const row = await TripFact.create({ TripID, key, value });
    res.status(201).json({ message: "Fact created", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllFacts = async (_req, res) => {
  try {
    const rows = await TripFact.findAll();
    if (!rows.length)
      return res.status(404).json({ message: "No facts found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFactById = async (req, res) => {
  try {
    const row = await TripFact.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Fact not found" });
    res.json({ message: "Fact found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateFact = async (req, res) => {
  try {
    const row = await TripFact.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Fact not found" });
    await row.update(req.body);
    res.json({ message: "Fact updated", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteFact = async (req, res) => {
  try {
    const row = await TripFact.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Fact not found" });
    await row.destroy();
    res.json({ message: "Fact deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

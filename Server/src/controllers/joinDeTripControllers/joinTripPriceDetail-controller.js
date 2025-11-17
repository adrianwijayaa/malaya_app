"use strict";
const { JoinTrip, JoinTripPriceDetail } = require("../../models");

exports.createPriceDetail = async (req, res) => {
  try {
    const { JoinTripID, pax, price, sortOrder } = req.body;
    if (!JoinTripID || !pax || !price)
      return res
        .status(400)
        .json({ message: "JoinTripID, pax, and price are required" });
    if (!(await JoinTrip.findByPk(JoinTripID)))
      return res.status(400).json({ message: "Invalid JoinTripID" });
    const row = await JoinTripPriceDetail.create({
      JoinTripID,
      pax,
      price,
      sortOrder: sortOrder ?? 0,
    });
    res.status(201).json({ message: "Price detail created", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPriceDetails = async (_req, res) => {
  try {
    const rows = await JoinTripPriceDetail.findAll();
    if (!rows.length)
      return res.status(404).json({ message: "No price details found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPriceDetailById = async (req, res) => {
  try {
    const row = await JoinTripPriceDetail.findByPk(req.params.id);
    if (!row)
      return res.status(404).json({ message: "Price detail not found" });
    res.json({ message: "Price detail found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePriceDetail = async (req, res) => {
  try {
    const row = await JoinTripPriceDetail.findByPk(req.params.id);
    if (!row)
      return res.status(404).json({ message: "Price detail not found" });
    await row.update(req.body);
    res.json({ message: "Price detail updated", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePriceDetail = async (req, res) => {
  try {
    const row = await JoinTripPriceDetail.findByPk(req.params.id);
    if (!row)
      return res.status(404).json({ message: "Price detail not found" });
    await row.destroy();
    res.json({ message: "Price detail deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

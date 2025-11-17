"use strict";
const { Trip, TripPriceDetail } = require("../../models");

exports.createPriceDetail = async (req, res) => {
  try {
    const { TripID, pax, price, sortOrder } = req.body;
    if (!TripID || !pax || !price)
      return res
        .status(400)
        .json({ message: "TripID, pax, and price are required" });
    if (!(await Trip.findByPk(TripID)))
      return res.status(400).json({ message: "Invalid TripID" });
    const row = await TripPriceDetail.create({
      TripID,
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
    const rows = await TripPriceDetail.findAll();
    if (!rows.length)
      return res.status(404).json({ message: "No price details found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPriceDetailById = async (req, res) => {
  try {
    const row = await TripPriceDetail.findByPk(req.params.id);
    if (!row)
      return res.status(404).json({ message: "Price detail not found" });
    res.json({ message: "Price detail found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePriceDetail = async (req, res) => {
  try {
    const row = await TripPriceDetail.findByPk(req.params.id);
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
    const row = await TripPriceDetail.findByPk(req.params.id);
    if (!row)
      return res.status(404).json({ message: "Price detail not found" });
    await row.destroy();
    res.json({ message: "Price detail deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

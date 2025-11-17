"use strict";
const {
  Trip,
  TripHighlight,
  TripInclude,
  TripExclude,
  TripFact,
  TripPriceDetail,
} = require("../../models");

exports.createTrip = async (req, res) => {
  try {
    const required = ["title", "slug", "heroImage", "overview"];
    for (const k of required)
      if (!req.body[k])
        return res.status(400).json({ message: `${k} is required` });
    const trip = await Trip.create(req.body);
    const withRels = await Trip.findByPk(trip.id, {
      include: [
        { model: TripHighlight, as: "highlights" },
        { model: TripInclude, as: "includes" },
        { model: TripExclude, as: "excludes" },
        { model: TripFact, as: "facts" },
        { model: TripPriceDetail, as: "priceDetails" },
      ],
    });
    res.status(201).json({ message: "Trip created", data: withRels });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getAllTrips = async (_req, res) => {
  try {
    const rows = await Trip.findAll({
      include: [
        { model: TripHighlight, as: "highlights" },
        { model: TripInclude, as: "includes" },
        { model: TripExclude, as: "excludes" },
        { model: TripFact, as: "facts" },
        { model: TripPriceDetail, as: "priceDetails" },
      ],
    });
    if (!rows.length)
      return res.status(404).json({ message: "No trips found" });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const row = await Trip.findByPk(req.params.id, {
      include: [
        { model: TripHighlight, as: "highlights" },
        { model: TripInclude, as: "includes" },
        { model: TripExclude, as: "excludes" },
        { model: TripFact, as: "facts" },
        { model: TripPriceDetail, as: "priceDetails" },
      ],
    });
    if (!row) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip found", data: row });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    await trip.update(req.body);
    const refreshed = await Trip.findByPk(trip.id, {
      include: [
        { model: TripHighlight, as: "highlights" },
        { model: TripInclude, as: "includes" },
        { model: TripExclude, as: "excludes" },
        { model: TripFact, as: "facts" },
        { model: TripPriceDetail, as: "priceDetails" },
      ],
    });
    res.json({ message: "Trip updated", data: refreshed });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    await TripHighlight.destroy({ where: { TripID: trip.id } });
    await TripInclude.destroy({ where: { TripID: trip.id } });
    await TripExclude.destroy({ where: { TripID: trip.id } });
    await TripFact.destroy({ where: { TripID: trip.id } });
    await TripPriceDetail.destroy({ where: { TripID: trip.id } });
    await trip.destroy();
    res.json({ message: "Trip deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

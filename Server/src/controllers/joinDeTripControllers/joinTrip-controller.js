"use strict";
const {
  JoinTrip,
  JoinTripHighlight,
  JoinTripInclude,
} = require("../../models");

exports.createJoinTrip = async (req, res) => {
  try {
    const required = ["title", "heroImage", "date", "duration", "location"];
    for (const k of required)
      if (!req.body[k])
        return res.status(400).json({ message: `${k} is required` });
    const trip = await JoinTrip.create(req.body);
    const withRelations = await JoinTrip.findByPk(trip.id, {
      include: [
        { model: JoinTripHighlight, as: "highlights" },
        { model: JoinTripInclude, as: "includes" },
      ],
    });
    res.status(201).json({ message: "Join Trip created", data: withRelations });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getAllJoinTrips = async (_req, res) => {
  try {
    const rows = await JoinTrip.findAll({
      include: [
        { model: JoinTripHighlight, as: "highlights" },
        { model: JoinTripInclude, as: "includes" },
      ],
    });
    if (!rows.length)
      return res.status(404).json({ message: "No join trips found" });
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getJoinTripById = async (req, res) => {
  try {
    const trip = await JoinTrip.findByPk(req.params.id, {
      include: [
        { model: JoinTripHighlight, as: "highlights" },
        { model: JoinTripInclude, as: "includes" },
      ],
    });
    if (!trip) return res.status(404).json({ message: "Join trip not found" });
    res.json({ message: "Join trip found", data: trip });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateJoinTrip = async (req, res) => {
  try {
    const trip = await JoinTrip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: "Join trip not found" });
    await trip.update(req.body);
    const updated = await JoinTrip.findByPk(trip.id, {
      include: [
        { model: JoinTripHighlight, as: "highlights" },
        { model: JoinTripInclude, as: "includes" },
      ],
    });
    res.json({ message: "Join trip updated", data: updated });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteJoinTrip = async (req, res) => {
  try {
    const trip = await JoinTrip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: "Join trip not found" });
    await JoinTripHighlight.destroy({ where: { JoinTripID: trip.id } });
    await JoinTripInclude.destroy({ where: { JoinTripID: trip.id } });
    await trip.destroy();
    res.json({ message: "Join trip deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

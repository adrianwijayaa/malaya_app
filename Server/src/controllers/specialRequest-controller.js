const Model = require("../models/index.js");
const SpecialRequest = Model.SpecialRequest;
const TravelDetails = Model.TravelDetails;

const createSpecialRequest = async (req, res) => {
  try {
    const {
      travelDetailsID,
      occasionsToCelebrate,
      additionalServicesNeeded,
      specialRequestsNotes,
    } = req.body;

    const requiredFields = {
      travelDetailsID: "Travel Details ID is required!",
      // occasionsToCelebrate: "Occasions to Celebrate are required!",
      // additionalServicesNeeded: "Additional Services Needed are required!",
      // specialRequestsNotes: "Special Requests Notes are required!"
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ message });
      }
    }

    const travelDetails = await TravelDetails.findByPk(travelDetailsID);
    if (!travelDetails) {
      return res.status(400).json({
        error:
          "Invalid TravelDetailsID. The referenced travel details do not exist.",
      });
    }

    const newSpecialRequest = await SpecialRequest.create({
      TravelDetailsID: travelDetailsID,
      OccasionsToCelebrate: occasionsToCelebrate,
      AdditionalServicesNeeded: additionalServicesNeeded,
      SpecialRequestsNotes: specialRequestsNotes,
    });

    return res.status(201).json({
      message: "Special Request created successfully!",
      data: newSpecialRequest,
    });
  } catch (error) {
    console.error("Error : ", error);
    res.status(500).send({
      message: "internal server error!",
      error: error,
    });
  }
};

const getAllSpecialRequest = async (req, res) => {
  try {
    const allSpecialRequest = await SpecialRequest.findAll();

    if (allSpecialRequest.length === 0) {
      return res.status(404).json({ message: "No Special Request found!" });
    }

    const travelIDs = allSpecialRequest.map((detail) => detail.TravelDetailsID);

    const travelDetails = await TravelDetails.findAll({
      where: { id: travelIDs },
    });

    const specialRequestWithTravel = allSpecialRequest.map((detail) => {
      const travelDetail = travelDetails.find(
        (travel) => travel.id === detail.TravelDetailsID
      );

      return {
        ...detail.dataValues,
        TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [],
      };
    });

    return res.status(200).json(specialRequestWithTravel);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send({
      message: error.message,
    });
  }
};

const getSpecialRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const specialRequest = await SpecialRequest.findByPk(id);

    if (!specialRequest) {
      return res.status(404).json({
        message: `Special Request with ID ${id} not found`,
      });
    }

    const travelDetail = await TravelDetails.findByPk(
      specialRequest.TravelDetailsID
    );

    const specialRequestWithTravelDetail = {
      ...specialRequest.dataValues, // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    return res.status(200).json({
      message: "Special Request found",
      data: specialRequestWithTravelDetail,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

const updateSpecialRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      travelDetailsID,
      OccasionsToCelebrate,
      AdditionalServicesNeeded,
      SpecialRequestsNotes,
    } = req.body;

    const specialRequest = await SpecialRequest.findByPk(id);

    if (!specialRequest) {
      return res.status(404).json({
        message: `Special Request with ID ${id} not found`,
      });
    }

    await specialRequest.update({
      TravelDetailsID: travelDetailsID,
      OccasionsToCelebrate: OccasionsToCelebrate,
      AdditionalServicesNeeded: AdditionalServicesNeeded,
      SpecialRequestsNotes: SpecialRequestsNotes,
    });

    const travelDetail = await TravelDetails.findByPk(
      specialRequest.TravelDetailsID
    );

    const specialRequestWithTravelDetail = {
      ...specialRequest.get(), // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    return res.status(200).json(specialRequestWithTravelDetail);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "internal server error!" });
  }
};

const deleteSpecialRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const specialRequest = await SpecialRequest.findByPk(id);

    if (!specialRequest) {
      return res.status(404).json({
        message: `Special Request dengan ID ${id} tidak ditemukan`,
      });
    }

    await specialRequest.destroy();

    res.status(200).json({
      message: `Special Request dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createSpecialRequest,
  getAllSpecialRequest,
  getSpecialRequestById,
  updateSpecialRequest,
  deleteSpecialRequest,
};

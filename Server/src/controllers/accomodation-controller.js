const Model = require("../models/index.js");
const Accomodation = Model.AccommodationPreferences;
const TravelDetail = Model.TravelDetails;

const createAccomodation = async (req, res) => {
  try {
    const {
      travelDetailId,
      preferredAccommodationType,
      roomType,
      specialAccommodationRequests,
    } = req.body;

    const requiredFields = {
      travelDetailId: "Travel Detail ID is required!",
      preferredAccommodationType: "Preferred Accommodation Type is required!",
      roomType: "Room Type is required!",
      // specialAccommodationRequests: "Special Accommodation Requests is required!"
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ message });
      }
    }

    const travelDetails = await TravelDetail.findByPk(travelDetailId);
    if (!travelDetails) {
      return res.status(400).json({
        error:
          "Invalid TravelDetailsID. The referenced travel details do not exist.",
      });
    }

    // Validasi ENUM untuk PreferredAccommodationType
    const validAccommodationTypes = [
      "Luxury Resort",
      "Boutique Hotel",
      "Private Villa",
      "Guest House",
      "Eco Lodge",
      "Glamping",
      "Traditional Stay",
    ];
    if (!validAccommodationTypes.includes(preferredAccommodationType)) {
      return res.status(400).json({
        error: `Invalid PreferredAccommodationType. Valid values are: ${validAccommodationTypes.join(
          ", "
        )}`,
      });
    }

    // Validasi ENUM untuk RoomType
    const validRoomTypes = [
      "Standard Room",
      "Deluxe Room",
      "Suite",
      "Family Room",
      "Pool Villa",
      "Ocean View Room",
      "Garden View Room",
      "Connecting Room",
    ];
    if (!validRoomTypes.includes(roomType)) {
      return res.status(400).json({
        error: `Invalid RoomType. Valid values are: ${validRoomTypes.join(
          ", "
        )}`,
      });
    }

    const newAccommodation = await Accomodation.create({
      TravelDetailsID: travelDetailId,
      PreferredAccommodationType: preferredAccommodationType,
      RoomType: roomType,
      SpecialAccommodationRequests: specialAccommodationRequests,
    });

    return res.status(201).json({
      message: "Accommodation preference created successfully.",
      data: newAccommodation,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "An error occurred while creating accomodation.",
    });
  }
};

const getAllAccomodation = async (req, res) => {
  try {
    const allAccommodation = await Accomodation.findAll();

    if (allAccommodation.length === 0) {
      return res.status(404).json({ message: "No Accomodation Details found" });
    }

    const travelIDs = allAccommodation.map((detail) => detail.TravelDetailsID);

    const travelDetails = await TravelDetail.findAll({
      where: { id: travelIDs },
    });

    const accommodationsWithTravel = allAccommodation.map((detail) => {
      const travelDetail = travelDetails.find(
        (travel) => travel.id === detail.TravelDetailsID
      );
      return {
        ...detail.dataValues,
        TravelDetailsID: travelDetail ? travelDetail.dataValues : null,
      };
    });

    return res.status(200).json(accommodationsWithTravel);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAccomodationById = async (req, res) => {
  try {
    const { id } = req.params;

    const accomodation = await Accomodation.findByPk(id);

    if (!accomodation) {
      return res.status(404).json({
        message: `Accommodation Prefferences with ID ${id} not found`,
      });
    }

    const travelDetail = await TravelDetail.findByPk(
      accomodation.TravelDetailsID
    );

    const accomodationWithTravelDetail = {
      ...accomodation.dataValues, // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    res.status(200).json({
      message: "Accommodation prefferences found",
      data: accomodationWithTravelDetail,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateAccomodation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      travelDetailsID,
      PreferredAccommodationType,
      RoomType,
      SpecialAccommodationRequests,
    } = req.body;
    if (PreferredAccommodationType !== undefined) {
      const validAccommodationTypes = [
        "Luxury Resort",
        "Boutique Hotel",
        "Private Villa",
        "Guest House",
        "Eco Lodge",
        "Glamping",
        "Traditional Stay",
      ];
      if (!validAccommodationTypes.includes(PreferredAccommodationType)) {
        return res.status(400).json({
          error: `Invalid PreferredAccommodationType. Valid values are: ${validAccommodationTypes.join(
            ", "
          )}`,
        });
      }
    }

    // Validasi ENUM untuk RoomType
    if (RoomType !== undefined) {
      const validRoomTypes = [
        "Standard Room",
        "Deluxe Room",
        "Suite",
        "Family Room",
        "Pool Villa",
        "Ocean View Room",
        "Garden View Room",
        "Connecting Room",
      ];
      if (!validRoomTypes.includes(RoomType)) {
        return res.status(400).json({
          error: `Invalid RoomType. Valid values are: ${validRoomTypes.join(
            ", "
          )}`,
        });
      }
    }

    const accommodationPref = await Accomodation.findByPk(id);

    if (!accommodationPref) {
      return res.status(404).json({
        message: `Accommodation Prefferences dengan ID ${id} tidak ditemukan`,
      });
    }

    await accommodationPref.update({
      TravelDetailsID: travelDetailsID,
      PreferredAccommodationType: PreferredAccommodationType,
      RoomType: RoomType,
      SpecialAccommodationRequests: SpecialAccommodationRequests,
    });

    const travelDetail = await TravelDetail.findByPk(
      accommodationPref.TravelDetailsID
    );

    const accomodationWithTravelDetail = {
      ...accommodationPref.get(), // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    return res.status(200).json(accomodationWithTravelDetail);
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteAccomodation = async (req, res) => {
  try {
    const { id } = req.params;

    const accommodation = await Accomodation.findByPk(id);

    if (!accommodation) {
      return res.status(404).json({
        message: `Accommodation Preferences dengan ID ${id} tidak ditemukan`,
      });
    }

    await accommodation.destroy();

    res.status(200).json({
      message: `Accomodation Prefferences dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createAccomodation,
  getAllAccomodation,
  getAccomodationById,
  updateAccomodation,
  deleteAccomodation,
};

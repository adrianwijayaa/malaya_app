const { where } = require("sequelize");
const Model = require("../models/index.js");
const TravelDetail = Model.TravelDetails;
const PersonalInfo = Model.PersonalInformation;

const createTravelDetail = async (req, res) => {
  try {
    const {
      personalID,
      preferredDestinations,
      preferredStartDate,
      flexibleDates,
      tripDurationDays,
      adults,
      children,
      childrenAges,
    } = req.body;

    const requiredFields = {
      personalID: "Personal ID is required!",
      preferredDestinations: "Preferred Destinations are required!",
      preferredStartDate: "Preferred Start Date is required!",
      flexibleDates: "Flexible Dates selection is required!",
      tripDurationDays: "Trip Duration (Days) is required!",
      adults: "Number of Adults is required!",
      children: "Number of Children is required!",
      childrenAges: "Children Ages are required!",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ message });
      }
    }

    const personalId = await PersonalInfo.findByPk(personalID);
    if (!personalId) {
      return res.status(400).json({
        error:
          "Invalid personalId. The referenced travel details do not exist.",
      });
    }

    // Buat entri baru di TravelDetails
    const travelDetails = await TravelDetail.create({
      PersonalID: personalID,
      PreferredDestinations: preferredDestinations,
      PreferredStartDate: preferredStartDate,
      FlexibleDates: flexibleDates,
      TripDurationDays: tripDurationDays,
      Adults: adults,
      Children: children,
      ChildrenAges: childrenAges,
    });

    // Kirimkan response sukses
    res.status(201).send({
      message: "Travel details created successfully.",
      data: travelDetails,
    });
  } catch (error) {
    // Tangani error
    console.error("Error: ", error);
    res.status(500).send({
      message:
        error.message || "An error occurred while creating travel details.",
    });
  }
};

const getAllTravelDetail = async (req, res) => {
  try {
    const allTravelDetail = await TravelDetail.findAll();

    if (allTravelDetail.length === 0) {
      return res.status(404).json({ message: "No Travel Details found" });
    }

    const personalIDs = allTravelDetail.map((detail) => detail.PersonalID);
    const personalInfoID = await PersonalInfo.findAll({
      where: { id: personalIDs },
    });

    const travelDetailsWithPersonal = allTravelDetail.map((detail) => {
      const personalInfo = personalInfoID.find(
        (personal) => personal.id === detail.PersonalID
      );
      return {
        ...detail.dataValues,
        PersonalID: personalInfo ? [personalInfo.dataValues] : [],
      };
    });

    return res.status(200).json(travelDetailsWithPersonal);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTravelDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    const travelDetail = await TravelDetail.findByPk(id);

    if (!travelDetail) {
      return res.status(404).json({
        message: `Travel Detail with ID ${id} not found`,
      });
    }

    const personalInfo = await PersonalInfo.findByPk(travelDetail.PersonalID);

    const travelDetailsWithPersonal = {
      ...travelDetail.dataValues, // Data dari TravelDetail
      PersonalID: personalInfo ? [personalInfo.dataValues] : [], // Data dari PersonalInfo
    };

    res.status(200).json({
      message: "Travel Detail found",
      data: travelDetailsWithPersonal,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTravelDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      PersonalID,
      PreferredDestinations,
      PreferredStartDate,
      FlexibleDates,
      TripDurationDays,
      Adults,
      Children,
      ChildrenAges,
    } = req.body;

    const travelDetail = await TravelDetail.findByPk(id);

    if (!travelDetail) {
      return res.status(404).json({
        message: `Travel Detail dengan ID ${id} tidak ditemukan`,
      });
    }

    // 🔥 Paksa Sequelize mendeteksi perubahan
    travelDetail.set({
      PersonalID: travelDetail.PersonalID,
      PreferredDestinations: PreferredDestinations,
      PreferredStartDate: PreferredStartDate,
      FlexibleDates: FlexibleDates,
      TripDurationDays: TripDurationDays,
      Adults: Adults,
      Children: Children,
      ChildrenAges: ChildrenAges,
      updatedAt: new Date(), // ⬅ Paksa perubahan waktu update
    });

    await travelDetail.save(); // ⬅ Simpan perubahan secara eksplisit

    const personalInfo = await PersonalInfo.findByPk(travelDetail.PersonalID);

    const travelDetailsWithPersonal = {
      ...travelDetail.toJSON(),
      PersonalID: personalInfo ? [personalInfo.dataValues] : [],
    };

    return res.status(200).json({
      message: `Travel Detail dengan ID ${id} berhasil diperbarui`,
      data: travelDetailsWithPersonal,
    });
  } catch (error) {
    console.error("Error updating travel detail:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteTravelDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const travelDetail = await TravelDetail.findByPk(id);

    if (!travelDetail) {
      return res.status(404).json({
        message: `Travel Detail dengan ID ${id} tidak ditemukan`,
      });
    }

    await travelDetail.destroy();

    return res.status(200).json({
      message: `Travel Detail dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createTravelDetail,
  getAllTravelDetail,
  getTravelDetailById,
  updateTravelDetail,
  deleteTravelDetail,
};

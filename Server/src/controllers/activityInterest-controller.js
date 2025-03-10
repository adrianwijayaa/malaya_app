const Model = require("../models/index.js");
const Activity = Model.ActivityInterest;
const TravelDetails = Model.TravelDetails;

const createActivity = async (req, res) => {
  try {
    const {
      travelDetailsId,
      prefferedActivities,
      activityLevel,
      specialInterest,
    } = req.body;

    const requiredFields = {
      travelDetailsId: "Travel Details ID is required!",
      prefferedActivities: "Preferred Activities are required!",
      activityLevel: "Activity Level is required!",
      // specialInterest: "Special Interest is required!"
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ message });
      }
    }

    const travelDetails = await TravelDetails.findByPk(travelDetailsId);
    if (!travelDetails) {
      return res.status(400).json({
        error:
          "Invalid TravelDetailsID. The referenced travel details do not exist.",
      });
    }

    const validActivityLevel = [
      "Relaxed (Minimal physical activity)",
      "Moderate (Some Walking, Light Activities)",
      "Active (Regular activities, longer walks)",
      "Challenging (Strenuous activities, hiking)",
      "Mixed (Combination of activity levels)",
    ];
    if (!validActivityLevel.includes(activityLevel)) {
      return res.status(400).json({
        error: `Invalid Activity Level. Valid values are: ${validActivityLevel.join(
          ", "
        )}`,
      });
    }

    const newActivity = await Activity.create({
      TravelDetailsID: travelDetailsId,
      PreferredActivities: prefferedActivities,
      ActivityLevel: activityLevel,
      SpecialInterests: specialInterest,
    });

    return res.status(201).json({
      message: "Activity Interest created successfully.",
      data: newActivity,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "An error occurred while creating activity interest.",
    });
  }
};

const getAllActivities = async (req, res) => {
  try {
    const allActivity = await Activity.findAll();

    if (allActivity.length === 0) {
      return res.status(404).json({ message: "No Activity Interest found!" });
    }

    const travelIDs = allActivity.map((detail) => detail.TravelDetailsID);

    const travelDetails = await TravelDetails.findAll({
      where: { id: travelIDs },
    });

    const activityWithTravel = allActivity.map((detail) => {
      const travelDetail = travelDetails.find(
        (travel) => travel.id === detail.TravelDetailsID
      );
      return {
        ...detail.dataValues,
        TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [],
      };
    });

    return res.status(200).json(activityWithTravel);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        message: `Activity Interest with ID ${id} not found`,
      });
    }

    const travelDetail = await TravelDetails.findByPk(activity.TravelDetailsID);

    const activityWithTravelDetail = {
      ...activity.dataValues, // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    res.status(200).json({
      message: "Activity Interest found",
      data: activityWithTravelDetail,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      TravelDetailsID,
      PreferredActivities,
      ActivityLevel,
      SpecialInterests,
    } = req.body;

    if (ActivityLevel !== undefined) {
      const validActivityLevel = [
        "Relaxed (Minimal physical activity)",
        "Moderate (Some Walking, Light Activities)",
        "Active (Regular activities, longer walks)",
        "Challenging (Strenuous activities, hiking)",
        "Mixed (Combination of activity levels)",
      ];
      if (!validActivityLevel.includes(ActivityLevel)) {
        return res.status(400).json({
          error: `Invalid Activity Level. Valid values are: ${validActivityLevel.join(
            ", "
          )}`,
        });
      }
    }

    const activityInterest = await Activity.findByPk(id);

    if (!activityInterest) {
      return res.status(404).json({
        message: `Activity Interest dengan ID ${id} tidak ditemukan`,
      });
    }

    await activityInterest.update({
      TravelDetailsID: TravelDetailsID,
      PreferredActivities: PreferredActivities,
      ActivityLevel: ActivityLevel,
      SpecialInterests: SpecialInterests,
    });

    const travelDetail = await TravelDetails.findByPk(
      activityInterest.TravelDetailsID
    );

    const activityWithTravelDetail = {
      ...activityInterest.get(), // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    return res.status(200).json(activityWithTravelDetail);
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        message: `Activity Interest dengan ID ${id} tidak ditemukan`,
      });
    }

    await activity.destroy();

    res.status(200).json({
      message: `Activity Interest dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};

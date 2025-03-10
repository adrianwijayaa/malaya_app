const Model = require("../models/index.js");
const Submission = Model.Submission;
const PersonalInfo = Model.PersonalInformation;

const createSubmission = async (req, res) => {
  try {
    const { personalID, howDidYouHear, consent } = req.body;

    const requiredFields = {
      personalID: "Personal ID is required!",
      howDidYouHear: "How Did You Hear field is required!",
      consent: "Consent is required!",
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

    const validHowDidYouHear = [
      "GOOGLE_SEARCH",
      "SOCIAL_MEDIA",
      "FRIEND_FAMILY",
      "TRAVEL_BLOG",
      "PREVIOUS_CUSTOMER",
      "TRAVEL_AGENT",
      "ADVERTISEMENT",
      "OTHER",
    ];
    if (!validHowDidYouHear.includes(howDidYouHear)) {
      return res.status(400).json({
        message: `Invalid How Did You Hear. Valid values are: ${validHowDidYouHear.join(
          ", "
        )}`,
      });
    }

    const newSubmission = await Submission.create({
      PersonalID: personalID,
      HowDidYouHear: howDidYouHear,
      Consent: consent,
    });

    return res.status(201).json({
      message: "Submission created successfully!",
      data: newSubmission,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send({
      message:
        error.message || "An error occurred while creating travel details.",
    });
  }
};

const getAllSubmission = async (req, res) => {
  try {
    const allSubmission = await Submission.findAll();

    if (allSubmission.length === 0) {
      return res.status(404).json({ message: "No Submission found" });
    }

    const personalIDs = allSubmission.map((detail) => detail.PersonalID);
    const personalInfoID = await PersonalInfo.findAll({
      where: { id: personalIDs },
    });

    const submissionDetailsWithPersonal = allSubmission.map((detail) => {
      const personalInfo = personalInfoID.find(
        (personal) => personal.id === detail.PersonalID
      );
      return {
        ...detail.dataValues,
        PersonalID: personalInfo ? [personalInfo.dataValues] : [],
      };
    });

    return res.status(200).json(submissionDetailsWithPersonal);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findByPk(id);

    if (!submission) {
      return res.status(404).json({
        message: `Submission with ID ${id} not found`,
      });
    }

    const personalInfo = await PersonalInfo.findByPk(submission.PersonalID);

    const submissionWithPersonal = {
      ...submission.dataValues, // Data dari TravelDetail
      PersonalID: personalInfo ? [personalInfo.dataValues] : [], // Data dari PersonalInfo
    };

    res.status(200).json({
      message: "Submission found",
      data: submissionWithPersonal,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const { personalID, howDidYouHear, consent } = req.body;

    if (howDidYouHear !== undefined) {
      const validHowDidYouHear = [
        "GOOGLE_SEARCH",
        "SOCIAL_MEDIA",
        "FRIEND_FAMILY",
        "TRAVEL_BLOG",
        "PREVIOUS_CUSTOMER",
        "TRAVEL_AGENT",
        "ADVERTISEMENT",
        "OTHER",
      ];
      if (!validHowDidYouHear.includes(howDidYouHear)) {
        return res.status(400).json({
          message: `Invalid How Did You Hear. Valid values are: ${validHowDidYouHear.join(
            ", "
          )}`,
        });
      }
    }

    const submission = await Submission.findByPk(id);

    if (!submission) {
      return res.status(404).json({
        message: `Submission with ID ${id} not found`,
      });
    }

    await submission.update({
      PersonalID: personalID,
      HowDidYouHear: howDidYouHear,
      Consent: consent,
    });

    const personalInfo = await PersonalInfo.findByPk(submission.PersonalID);

    const submissionWithPersonal = {
      ...submission.get(), // Data dari TravelDetail
      PersonalID: personalInfo ? [personalInfo.dataValues] : [], // Data dari PersonalInfo
    };

    return res.status(200).json({
      message: `Submission dengan ID ${id} berhasil diperbarui`,
      data: submissionWithPersonal,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findByPk(id);

    if (!submission) {
      return res.status(404).json({
        message: `Submission dengan ID ${id} tidak ditemukan`,
      });
    }

    await submission.destroy();

    return res.status(200).json({
      message: `Submission dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createSubmission,
  getAllSubmission,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
};

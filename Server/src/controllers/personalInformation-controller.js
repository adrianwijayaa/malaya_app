const Model = require("../models/index.js");
const PersonalInformation = Model.PersonalInformation;
const User = Model.User;

const createPersonalInformation = async (req, res) => {
  try {
    const { fullname, email, phonenumber, preferedcontactmethod } = req.body;

    const requiredFields = {
      fullname: "Full name is required!",
      email: "Email is required!",
      //   phonenumber: "Phone number is required!",
      preferedcontactmethod: "Preferred contact method is required!",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ message });
      }
    }

    const validMethods = ["Email", "Phone", "WhatsApp", "Other"];
    if (!validMethods.includes(preferedcontactmethod)) {
      return res.status(400).json({
        message: `Invalid Preffered contact method. Valid values are: ${validMethods.join(
          ", "
        )}`,
      });
    }

    const personalInfo = await PersonalInformation.create({
      fullname: fullname,
      email: email,
      phonenumber: phonenumber,
      PreferredContactMethod: preferedcontactmethod,
    });

    return res.status(201).json(personalInfo);
  } catch (error) {
    console.error("Error:", error);
  }
};

const getAllPersonalInformation = async (req, res) => {
  try {
    const allPersonalInfo = await PersonalInformation.findAll();

    if (allPersonalInfo.length === 0) {
      return res.status(404).json({ message: "No personal information found" });
    }

    return res.status(200).json(allPersonalInfo);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPersonalInformationbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const personalInfo = await PersonalInformation.findByPk(id);

    if (!personalInfo) {
      return res.status(404).json({
        message: `personal Info with ID ${id} not found`,
      });
    }

    res.status(200).json({
      message: "User found",
      data: personalInfo,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePersonalInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, phonenumber, preferedcontactmethod } = req.body;

    const updatePersonalInfo = await PersonalInformation.findByPk(id);

    if (!updatePersonalInfo) {
      return res.status(404).json({
        message: `Personal Info dengan ID ${id} tidak ditemukan`,
      });
    }

    await updatePersonalInfo.update({
      fullname,
      email,
      phonenumber,
      preferedcontactmethod,
    });

    res.status(200).json({
      message: `Personal Info dengan ID ${id} berhasil diperbarui`,
      data: updatePersonalInfo,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deletePersonalInformation = async (req, res) => {
  try {
    const { id } = req.params;

    const personalInfo = await PersonalInformation.findByPk(id);

    if (!personalInfo) {
      return res.status(404).json({
        message: `Personal Info dengan ID ${id} tidak ditemukan`,
      });
    }

    await personalInfo.destroy();

    res.status(200).json({
      message: `Personal Info dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createPersonalInformation,
  getAllPersonalInformation,
  getPersonalInformationbyId,
  updatePersonalInformation,
  deletePersonalInformation,
};

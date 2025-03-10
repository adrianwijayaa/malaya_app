const Model = require("../models/index.js");
const Budget = Model.Budget;
const TravelDetails = Model.TravelDetails;

const createBudget = async (req, res) => {
  try {
    const { travelDetailsID, estimatedBudgetPerPerson, currency } = req.body;

    const requiredFields = {
      travelDetailsID: "Travel Details ID is required!",
      estimatedBudgetPerPerson: "Estimated Budget Per Person is required!",
      currency: "Currency is required!",
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

    const validCurrency = [
      "USD - US Dollar",
      "EUR - Euro",
      "GBP - British Pound",
      "IDR - Indonesian Rupiah",
      "JPY - Japanese Yen",
      "AUD - Australian Dollar",
      "SGD - Singapore Dollar",
      "MYR - Malaysian Ringgit",
      "CNY - Chinese Yuan",
    ];
    if (!validCurrency.includes(currency)) {
      return res.status(400).json({
        message: `Invalid Currencies. Valid values are: ${validCurrency.join(
          ", "
        )}`,
      });
    }

    const newBudget = await Budget.create({
      TravelDetailsID: travelDetailsID,
      EstimatedBudgetPerPerson: estimatedBudgetPerPerson,
      Currency: currency,
    });

    return res.status(201).json({
      message: "Budget created successfuly!",
      data: newBudget,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "internal server error",
      error: error,
    });
  }
};

const getAllBudget = async (req, res) => {
  try {
    const allBudget = await Budget.findAll();

    if (allBudget.length === 0) {
      return res.status(404).json({ message: "No Budget found!" });
    }

    const travelIDs = allBudget.map((detail) => detail.TravelDetailsID);

    const travelDetails = await TravelDetails.findAll({
      where: { id: travelIDs },
    });

    const budgetWithTravel = allBudget.map((detail) => {
      const travelDetail = travelDetails.find(
        (travel) => travel.id === detail.TravelDetailsID
      );

      return {
        ...detail.dataValues,
        TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [],
      };
    });

    return res.status(200).json(budgetWithTravel);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send({
      message: error.message,
    });
  }
};

const getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findByPk(id);

    if (!budget) {
      return res.status(404).json({
        message: `Budget with ID ${id} not found`,
      });
    }

    const travelDetail = await TravelDetails.findByPk(budget.TravelDetailsID);

    const budgetWithTravelDetail = {
      ...budget.dataValues, // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    return res.status(200).json({
      message: "Budget found",
      data: budgetWithTravelDetail,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { travelDetailsID, EstimatedBudgetPerPerson, Currency } = req.body;

    if (Currency !== undefined) {
      const validCurrency = [
        "USD - US Dollar",
        "EUR - Euro",
        "GBP - British Pound",
        "IDR - Indonesian Rupiah",
        "JPY - Japanese Yen",
        "AUD - Australian Dollar",
        "SGD - Singapore Dollar",
        "MYR - Malaysian Ringgit",
        "CNY - Chinese Yuan",
      ];
      if (!validCurrency.includes(Currency)) {
        return res.status(400).json({
          message: `Invalid Currencies. Valid values are: ${validCurrency.join(
            ", "
          )}`,
        });
      }
    }

    const budget = await Budget.findByPk(id);

    if (!budget) {
      return res.status(404).json({
        message: `Budget with ID ${id} not found`,
      });
    }

    await budget.update({
      TravelDetails: travelDetailsID,
      EstimatedBudgetPerPerson: EstimatedBudgetPerPerson,
      Currency: Currency,
    });

    const travelDetail = await TravelDetails.findByPk(budget.TravelDetailsID);

    const budgetWithTravelDetail = {
      ...budget.get(), // Data dari TravelDetail
      TravelDetailsID: travelDetail ? [travelDetail.dataValues] : [], // Data dari PersonalInfo
    };

    return res.status(200).json(budgetWithTravelDetail);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "internal server error!" });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findByPk(id);

    if (!budget) {
      return res.status(404).json({
        message: `Budget dengan ID ${id} tidak ditemukan`,
      });
    }

    await budget.destroy();

    res.status(200).json({
      message: `Budget dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createBudget,
  getAllBudget,
  getBudgetById,
  updateBudget,
  deleteBudget,
};

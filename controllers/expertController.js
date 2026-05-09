const Expert = require("../models/Expert");

// @desc   Get experts (search + filter + pagination)
// @route  GET /experts
exports.getExperts = async (req, res) => {
  try {
    const { search = "", category = "", page = 1, limit = 20 } = req.query;

    const query = {
      name: { $regex: search, $options: "i" }
    };

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const experts = await Expert.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expert.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: experts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single expert
// @route  GET /experts/:id
exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.json(expert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
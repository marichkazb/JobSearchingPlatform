const Admin = require("../models/admin");

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createAdmin = async (req, res) => {
  try {
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteOneAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findOneAndRemove({ _id: id });
    res.status(200).json(`Deleted ${admin}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findById(id);

    admin.name = req.body.name;
    admin.email = req.body.email;

    admin.save();
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const updatePartOfAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const updateFields = req.body;
    const admin = await Admin.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const getAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findById(id);
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  getAllAdmins,
  createAdmin,
  deleteOneAdmin,
  updateAdmin,
  updatePartOfAdmin,
  getAdmin,
};

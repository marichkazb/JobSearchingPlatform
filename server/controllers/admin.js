const admin = require("../models/admin");

const getAllAdmins = async (req, res) => {
  try {
    const admins = await admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createAdmin = async (req, res) => {
  try {
    const newAdmin = new admin(req.body);
    await newAdmin.save();

    // set Firebase user claim to Role and MongoDB's ID
    try {
      const uid = req.user.uid;
      await admin.auth().setCustomUserClaims(uid, {
        role: "admin",
        id: newAdmin._id.toString(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error.message,
        stack: error.stack,
      });
    }

    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteOneAdmin = async (req, res) => {
  try {
    const id = req.params.id;
const admin = await admin.findOneAndRemove({ _id: id });
if (!admin) {
  return res.status(404).json({ message: "Admin not found" });
}
    
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
const admin = await admin.findById(id);
if (!admin) {
  return res.status(404).json({ message: "Admin not found" });
}
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
    const admin = await admin.findByIdAndUpdate(id, updateFields, {
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
    const admin = await admin.findById(id);
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

module.exports = {
  getAllAdmins,
  createAdmin,
  deleteOneAdmin,
  updateAdmin,
  updatePartOfAdmin,
  getAdmin,
};

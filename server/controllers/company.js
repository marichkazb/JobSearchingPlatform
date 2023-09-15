const Company = require("../models/company");

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

    const companiesWithLinks = companies.map((company) => {
      const id = company._id;
      return {
        ...company._doc,
        links: [
          {
            rel: "self",
            href: `${req.baseUrl}/${id}`,
          },
          {
            rel: "company-jobs",
            href: `${req.baseUrl}/${id}/jobs`,
          },
        ],
      };
    });

    res.json(companiesWithLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const createCompany = async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const deleteOneCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findOneAndRemove({ _id: id });
    res.status(200).json(`Deleted ${company}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);

    company.name = req.body.name;
    company.email = req.body.email;
    company.logo = req.body.logo;
    company.locations = req.body.locations;

    company.save();
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const updatePartOfCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const updateFields = req.body;
    const company = await Company.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const getCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    //HATEOAS
    company._doc.links = [
      {
        rel: "self",
        href: `${req.baseUrl}/${id}`,
      },
      {
        rel: "company-jobs",
        href: `${req.baseUrl}/${id}/jobs`,
      },
    ];

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  getAllCompanies,
  createCompany,
  deleteOneCompany,
  updateCompany,
  updatePartOfCompany,
  getCompany,
};

const admin = require("firebase-admin");
const Company = require('./models/company');

const authenticate = async (req, res, next) => {
  const idToken = req.headers.authorization;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

function checkIfAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Forbidden. You need to be an administrator to access this.");
  }
}

function checkIfCompany(req, res, next) {
  if (req.user && req.user.role === "company") {
    next();
  } else {
    res
      .status(403)
      .send("Forbidden. You need to be a registered Company to access this.");
  }
}

function checkIfUser(req, res, next) {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    res
      .status(403)
      .send("Forbidden. You need to be a registered User to access this.");
  }
}

async function verifyCompanyEmail(req, res, next) {
  try {
    const company = await Company.findById(req.companyId); // Notice: We stored the companyId in the request object before this middleware

    if (!company) {
      return res.status(404).send("Company not found");
    }

    // Checking if the email in MongoDB matches the email from Firebase Authentication token
    if (company.email !== req.user.email) {
      // Notice: We decoded the Firebase token and attached it to the request object before this middleware
      return res.status(403).send("Email does not match the company record");
    }

    next();
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  authenticate,
  checkIfAdmin,
  checkIfCompany,
  checkIfUser,
  verifyCompanyEmail
};

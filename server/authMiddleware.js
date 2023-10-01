const admin = require("firebase-admin");
const Company = require("./models/company");
//const User = require("./models/user");

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
    res
      .status(403)
      .send("Forbidden. You need to be an administrator to access this.");
  }
}

function checkIfCompany(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  if (req.user && req.user.role === "company") {
    next();
  } else {
    res
      .status(403)
      .send("Forbidden. You need to be a registered Company to access this.");
  }
}

function checkIfUser(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  if (req.user && req.user.role === "user") {
    next();
  } else {
    res
      .status(403)
      .send("Forbidden. You need to be a registered User to access this.");
  }
}

async function verifyCompanyId(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  }

  try {
    const company = await Company.findById(req.companyId); // The companyId was stored in the request object before this middleware

    if (!company) {
      return res.status(404).send("Company not found");
    }

    // Checking if the _id in MongoDB matches the _id from Firebase Authentication claim
    if (company._id !== req.user._id) {
      // The Firebase token was decoded and attached to the request object before this middleware
      return res.status(403).send("Company and content do not match.");
    }

    next();
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}

async function verifyUserEmail(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  }

  try {
    const user = null; //await User.findById(req.userId); // The companyId was stored in the request object before this middleware

    if (!user) {
      return res.status(404).send("User doesn't exist yet in the backend");
      return res.status(404).send("User not found");
    }

    // Checking if the email in MongoDB matches the email from Firebase Authentication token
    if (user.email !== req.user.email) {
      // The Firebase token was decoded and attached to the request object before this middleware
      return res.status(403).send("Email does not match the user's record");
    }

    next();
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}

// To be used only within HTTP routes, not global middleware
function skipIfAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next("route"); // Skip all remaining middleware ONLY within this route.
  } else {
    next(); // Continue to the next middleware within this route.
  }
}

module.exports = {
  authenticate,
  checkIfAdmin,
  checkIfCompany,
  checkIfUser,
  verifyCompanyId,
  verifyUserEmail,
  skipIfAdmin,
};

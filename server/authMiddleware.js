const admin = require("firebase-admin");

const Admin = require("./models/admin")
const Company = require("./models/company");
const Candidate = require("./models/candidate");
const Job = require("./models/job");
const Application = require("./models/application");


const authenticate = async (req, res, next) => {
  const idToken = req.headers.authorization;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    
    if (!req.user || !req.user.uid) {
      return res.status(400).json({ error: "User UID not found" });
    }
    
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

function checkIfAdmin(req, res, next) {
   if (req.admin) {
     next();
   } else {
     res
       .status(403)
       .send("Forbidden. You need to be an administrator to access this.");
   }
}

function checkIfCompany(req, res, next) {
  if (req.admin || req.company) {
    next();
  } else {
    res
      .status(403)
      .send("Forbidden. You need to be a registered company to access this.");
  }
}

function checkIfCandidate(req, res, next) {
  if (req.admin || req.candidate) {
    next();
  } else {
    res
      .status(403)
      .send("Forbidden. You need to be a registered candidate to access this.");
  }
}

// To be used only within HTTP routes, not global middleware
function skipIfAdmin(req, res, next) {
  if (req.user && req.admin) {
    next("route"); // Skip all remaining middleware ONLY within this route.
  } else {
    next(); // Continue to the next middleware within this route.
  }
}

const verifyCompanyOwnership = async (req, res, next) => {
  if (req.admin) {
    return next();
  }
  
  try {
    const id = req.params.id;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.userId !== req.user.uid) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    // Attach the fetched company object to the request object
    req.company = company;

    next(); // move to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const verifyCandidateOwnership = async (req, res, next) => {
  if (req.admin) {
    return next();
  }

  try {
    const id = req.params.id;
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (candidate.userId !== req.user.uid) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    req.candidate = candidate;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const verifyApplicationVisibility = async (req, res, next) => {
  if (req.admin) {
    return next();
  }

  try {
    const id = req.params.id;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
        console.log("application:" + application);

    const job = await Job.findById(application.jobId);
    const candidate = await Candidate.findById(application.candidateId);
    console.log("job:" + job);
        console.log("candidate:" + candidate);

    if (job.companyId !== req.user.uid && candidate.userId !== req.user.uid) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    req.application = application;
    req.job = job;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const verifyApplicationOwnership = async (req, res, next) => {
  if (req.admin) {
    return next();
  }

  // Fetch the Application based on the req.params.id
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Check if the application's candidateId matches the req.candidate._id
    if (application.candidateId.toString() !== req.candidate._id.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized operation, only the Candidate associated with the Application can modify it.",
      });
    }

    next(); // move to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyJobOwnership = async (req, res, next) => {
  if (req.admin) {
    return next();
  }

  // Check if req.user and req.company are available
  if (!req.user || !req.company) {
    return res.status(400).json({ error: "User or Company data not found" });
  }

  // Fetch the Job based on the req.params.id
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if the job's companyId matches the req.company._id
    if (job.companyId.toString() !== req.company._id.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized operation, only the Company associated with the Job can modify it.",
      });
    }

    next(); // move to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const classifyRequester = async (req, res, next) => {
  console.log("classifyRequester");
  const { uid } = req.user;

  try {
    const admin = await Admin.findOne({ userId: uid });
    if (admin) {
      req.admin = admin;
      return next();
    }
    const company = await Company.findOne({ userId: uid });
    if (company) {
      req.company = company;
      return next();
    }
    const candidate = await Candidate.findOne({ userId: uid });
    if (candidate) {
      req.candidate = candidate;
      return next();
    }
    req.none = true;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error identifying user role" });
  }
};

module.exports = {
  authenticate,
  classifyRequester,
  checkIfAdmin,
  checkIfCompany,
  checkIfCandidate,

  //////////////////
  skipIfAdmin,
  verifyCompanyOwnership,
  verifyCandidateOwnership,
  verifyApplicationVisibility,
  verifyApplicationOwnership,
  verifyJobOwnership,
};

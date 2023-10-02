const Company = require("../models/company");
const Candidate = require("../models/candidate");

const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();

    const candidatesWithLinks = candidates.map((candidate) => {
      const id = candidate._id;
      return {
        ...candidate._doc,
        links: [
          {
            rel: "self",
            href: `${req.baseUrl}/${id}`,
          },
          {
            rel: "candidate-applications",
            href: `${req.baseUrl}/${id}/applications`,
          },
        ],
      };
    });

    res.json(candidatesWithLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const createCandidate = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(400).json({ error: "User UID not found" });
    }

    // Check if the UID is already associated with an existing Company or User
    const existingCompany = await Company.findOne({ userId: req.user.uid });
    const existingCandidate = await Candidate.findOne({ userId: req.user.uid });
    if (existingCompany || existingCandidate) {
      return res.status(400).json({
        error:
          "UID is already associated with an existing Company or Candidate",
      });
    }

    const newCandidate = new Candidate({
      ...req.body,
      userId: req.user.uid,
    });

    await newCandidate.save();

    res.status(201).json(newCandidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const deleteOneCandidate = async (req, res) => {
  try {
    const candidate = req.candidate;
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    await candidate.remove();
    res.status(200).json({ message: `Deleted ${candidate}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const updateCandidate = async (req, res) => {
  try {
    const candidate = req.candidate;
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const updateFields = req.body;
    for (const key in updateFields) {
      candidate[key] = updateFields[key];
    }
    candidate.save();
    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const updatePartOfCandidate = async (req, res) => {
  try {
    const candidate = req.candidate;
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const updateFields = req.body;
    for (const key in updateFields) {
      candidate[key] = updateFields[key];
    }
    await candidate.save();
    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const getCandidate = async (req, res) => {
  try {
    const candidate = req.candidate;

    //HATEOAS
    candidate._doc.links = [
      {
        rel: "self",
        href: `${req.baseUrl}/${id}`,
      },
      {
        rel: "candidate-applications",
        href: `${req.baseUrl}/${id}/applications`,
      },
    ];

    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const getAllCandidateApplications = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const candidate = await Candidate.findById(candidateId).populate(
      "applications"
    );
    if (!candidate) return res.status(404).send("Candidate not found");
    res.send(candidate.applications);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCandidateApplication = async (req, res) => {
  try {
    const { candidateId, applicationId } = req.params;
    const application = await Application.findOne({
      _id: applicationId,
      candidateId: candidateId,
    });
    if (!application)
      return res
        .status(404)
        .send("Application not found for the specified Candidate.");
    res.send(application);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllCandidates,
  createCandidate,
  deleteOneCandidate,
  updateCandidate,
  updatePartOfCandidate,
  getCandidate,
  getAllCandidateApplications,
  getCandidateApplication,
};

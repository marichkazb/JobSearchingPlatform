const Jobs = require('../models/jobs');

//Create a job offering (Create)
const createJob = async (req,res) => {
    try{
        const job = await Jobs.create(req.body);
        res.status(201).json(job);
    }catch(error){
        console.error(error);
        res.status(500).json(error.message);
    }
};

//Get all job offerings (Read)
const getAllJobs = async (req,res) => {
    try{
        const jobs = await Jobs.find();
        res.status(200).json(jobs);
    }
    catch(error){
        console.error(error);
        res.status(500).json(error.message);
    }
};

//Get a specific job offering (Read)
const getJobByID = async (req,res) => {
    try{
        const jobID = req.params.id;
        const job = await Jobs.findById(jobID);
        if(!job){
            return res.status(404).json(error.message);
        }
        res.status(200).json(job);
    }
    catch(error){
        console.error(error);
        res.status(500).json(error.message);
    }
};

//Update a specific job offering (Update)
const updateJobByID = async (req,res) => {
    try{
        const jobID = req.params.id;
        const updateData = req.body;
        const updatedJob = await Jobs.findByIdAndUpdate(jobID, updateData, { new: true });
        if(!updatedJob){
            return res.status(404).json(error.message);
        }
        res.status(200).json(updatedJob);
    }
    catch(error){
        console.error(error);
        res.status(500).json(error.message);
    }
};

//Delete a specific job offering (Delete)
const deleteJobByID = async (req, res) => {
    try{
        const jobID = req.params.id;
        const deletedJob = await Jobs.findByIdAndRemove(jobID);
        if(!deletedJob){
            return res.status(404).json(error.message);
        }
        res.status(204).send();
    }catch(error){
        console.error(error);
        res.status(500).json();
    }
};

//Delete all jobs (Delete)
const deleteAllJobs = async(req, res) => {
    try{
        const deleteAllJobs = await Jobs.deleteMany({});
        if(deleteAllJobs.deletedCount == 0){
            return res.status(404).json(error.message);
        }
        res.status(204).send();
    } catch(error){
        console.error(error);
        res.status(500).json(error.message);
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobByID,
    updateJobByID,
    deleteJobByID,
    deleteAllJobs
};
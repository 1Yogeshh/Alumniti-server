const Job = require("../models/JobPost")

exports.CreateJob = async (req, res) => {
    try {
        const { jobTitle, companyName, location, companyWebsite, jobType, salary, jobDescription, jobApplyLink } = req.body;

    const newJob = new Job({
      jobTitle,
      companyName,
      location,
      companyWebsite,
      jobType,
      salary,
      jobDescription,
      jobApplyLink,
      postedBy: req.user._id // User ID from token
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({ message: "Error creating job post", error });
    }
  }


exports.GetJobs = async (req, res)=>{
    try {
        const jobs= await Job.find().populate('postedBy', 'name role')
        res.status(200).json(jobs)
    } catch (error) {
        res.status(500).json({message:"error"})
    }
}  
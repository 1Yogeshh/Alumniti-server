const express = require('express')
const {register,  login, getAllUsers, approveUser, getUserProfile, updateProfile, getAlumniAndStudents, getUserById}=require('../Controllers/auth');
const { isAdmin } = require('../middleware/auth');
const { isStudentOrAlumni } = require('../middleware/alumniauth');
const { CreateJob, GetJobs } = require('../Controllers/post');
const { CreateEvent, GetEvents } = require('../Controllers/Event');
const { sendmessage, receivemessage } = require('../Controllers/message');
const { CreateCollab, GetCollabs } = require('../Controllers/collab');

const router = express.Router();

//register
router.route("/signup").post(register)

//login
router.route("/login").post(login)

//get admin screen users
router.route("/users").get(isAdmin, getAllUsers)

//prove user by admin
router.route("/approve/:userId").post(isAdmin, approveUser)

//profile admin
router.route("/profile").get(isAdmin, getUserProfile)

//profile
router.route("/profile-alumni").get(isStudentOrAlumni, getUserProfile)

//update profile
router.route("/update").put(isStudentOrAlumni, updateProfile)

//get all same colleges users
router.route('/get-all-users').get(isStudentOrAlumni, getAlumniAndStudents)

//other profiles
router.route('/otherprofile/:userId').get(isStudentOrAlumni, getUserById)

//create job
router.route('/createpost').post(isStudentOrAlumni, CreateJob)

//get a jobs
router.route('/getjobs').get(isStudentOrAlumni, GetJobs)

//create event
router.route('/createevent').post(isStudentOrAlumni, CreateEvent)

//get events
router.route('/getevents').get(isStudentOrAlumni, GetEvents)

//send message
router.route('/send/:recipientId').post(isStudentOrAlumni, sendmessage)

//get message
router.route('/messages/:userId').get(isStudentOrAlumni, receivemessage)

//create collab
router.route('/createcollab').post(isStudentOrAlumni, CreateCollab)

//get collab
router.route('/getcollabs').get(isStudentOrAlumni, GetCollabs)

module.exports=router
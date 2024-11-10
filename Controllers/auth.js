
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register route for student/alumni
exports.register = async (req, res) => {
    const { name, email, password, role, college } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        college,
        isApproved: role === 'admin' ? true : false,
      });
  
      await user.save();
      res.json({ message: 'Registration successful' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

// Login route
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        if (!user.isApproved) return res.status(403).json({ message: 'Account pending approval' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ userId: user._id, role: user.role, college:user.college }, process.env.TOKEN_SECRET, { expiresIn: '1y' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Get all users (for admin dashboard)
exports.getAllUsers = async (req, res) => {
    try {
        const admin = req.user;

        if (!admin || !admin.college) {
            return res.status(400).json({ error: 'Invalid admin information' });
        }

        const users = await User.find({
            role: { $in: ['student', 'alumni'] },
            college: admin.college
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);  // Log the error to the server console
        res.status(500).json({ error: 'Server error', details: error.message }); // Send back the error message
    }
};


// Approve a user (admin functionality)
exports.approveUser = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const admin = req.user;

        if (!admin || !admin.role) {
            return res.status(403).json({ error: 'Authentication failed or invalid user information' });
        }

        // Ensure the requester is an admin
        if (admin.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        // Ensure userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Find the user by ID and update their approval status
        const user = await User.findByIdAndUpdate(userId, { isApproved: true }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User approved successfully', user });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};


// Get the authenticated user's profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user; // Assuming `req.user` contains the user info from the JWT middleware

        // Find the user by ID, excluding the password field
        const user = await User.find(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user); // Return the user profile data
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};


exports.updateProfile = async (req, res) => {
    const { name, education, skills, jobs, about,location,currentjob,portfolio,github,linkdin, img} = req.body;

    try {
        const userId = req.user; // Assuming `req.user` contains the user ID

        const user = await User.findByIdAndUpdate(
            userId,
            { name, education, skills, jobs, about,location,currentjob,portfolio,github,linkdin, img },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).send('User not found');
        }
        await user.save()
        res.send(user);
    } catch (error) {
        console.error('Error updating user profile:', error); // Log the error
        res.status(400).send(error.message); // Handle errors
    }
};

// Get all alumni and students from the same college, excluding admins
exports.getAlumniAndStudents = async (req, res) => {
    try {
        const loggedInUser = req.user; // Assuming req.user contains the logged-in user's info

        if (!loggedInUser || !loggedInUser.college) {
            return res.status(400).json({ error: 'Invalid user information' });
        }

        // Find users from the same college, only for 'student' and 'alumni' roles
        const users = await User.find({
            college: loggedInUser.college,
            role: { $in: ['student', 'alumni'] } ,// Include only students and alumni
            _id: { $ne: loggedInUser } 
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error); // Log the error to the server console
        res.status(500).json({ error: 'Server error', details: error.message }); // Send back the error message
    }
};


// Get user profile by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};


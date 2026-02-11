const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 */

exports.signup = async (req, res) => {
    // Add new fields to the destructuring
    const { name, email, password, role, rollNo, mobileNo, academicYear, department } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const isParent = role.toLowerCase() === 'parent';

        user = await User.create({
            name,
            username: email, 
            email,
            password: hashedPassword,
            role: role.toLowerCase(),
            mobileNo, // Save mobile number
            // Role-specific fields
            rollNo: isParent ? rollNo : null,
            academicYear: !isParent ? academicYear : null,
            department: !isParent ? department : null
        });

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                rollNo: user.rollNo,
                mobileNo: user.mobileNo,
                academicYear: user.academicYear
            }
        });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
// exports.signup = async (req, res) => {
//     const { name, email, password, role, rollNo } = req.body;

//     try {
//         let user = await User.findOne({ where: { email } });
//         if (user) return res.status(400).json({ message: "User already exists" });

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         user = await User.create({
//             name,
//             username: email, 
//             email,
//             password: hashedPassword,
//             role: role.toLowerCase(),
//             rollNo: role.toLowerCase() === 'parent' ? rollNo : null
//         });

//         const token = jwt.sign(
//             { id: user.id, role: user.role }, 
//             process.env.JWT_SECRET || 'secret', 
//             { expiresIn: '24h' }
//         );

//         res.status(201).json({
//             token,
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 role: user.role,
//                 rollNo: user.rollNo
//             }
//         });
//     } catch (err) {
//         console.error("Signup Error:", err.message);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                rollNo: user.rollNo
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        // Ensure field names match your User model (mobileNo vs phone)
        const { username, email, mobileNo, academicYear, department, password } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updates = {
            username: username || user.username,
            email: email || user.email,
            mobileNo: mobileNo || user.mobileNo,
            academicYear: academicYear || user.academicYear,
            department: department || user.department
        };

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        await user.update(updates);

        const updatedUser = user.toJSON();
        delete updatedUser.password;

        res.json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (err) {
        console.error("Profile Update Error:", err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Email or Mobile Number already in use" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// /**
//  * @desc    Get current logged in user
//  * @route   GET /api/auth/me
//  */
// exports.getMe = async (req, res) => {
//     try {
//         const user = await User.findByPk(req.user.id, {
//             attributes: { exclude: ['password'] }
//         });
//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

// /**
//  * @desc    Authenticate user & get token
//  * @route   POST /api/auth/login
//  */
// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // 1. Check if user exists
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid email or password" });
//         }

//         // 2. Verify password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid email or password" });
//         }

//         // 3. Create JWT Payload
//         const payload = {
//             id: user.id,
//             role: user.role,
//             username: user.username
//         };

//         // 4. Sign Token 
//         const token = jwt.sign(
//             payload, 
//             process.env.JWT_SECRET || 'secret', 
//             { expiresIn: '24h' }
//         );

//         // 5. Send Response - Crucial: included rollNo here
//         res.json({
//             token,
//             user: {
//                 id: user.id,
//                 username: user.username,
//                 name: user.name,
//                 role: user.role,
//                 rollNo: user.rollNo // Needed for ParentDashboard
//             }
//         });

//     } catch (err) {
//         console.error("Login Error:", err.message);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// /**
//  * @desc    Register a new user
//  * @route   POST /api/auth/signup
//  */
// exports.signup = async (req, res) => {
//     const { name, email, password, role, rollNo } = req.body;

//     try {
//         let user = await User.findOne({ where: { email } });
//         if (user) return res.status(400).json({ message: "User already exists" });

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create User
//         user = await User.create({
//             name,
//             username: email, 
//             email,
//             password: hashedPassword,
//             role: role.toLowerCase(),
//             rollNo: role.toLowerCase() === 'parent' ? rollNo : null
//         });

//         const token = jwt.sign(
//             { id: user.id, role: user.role }, 
//             process.env.JWT_SECRET || 'secret', 
//             { expiresIn: '24h' }
//         );

//         res.status(201).json({
//             token,
//             user: {
//                 id: user.id,
//                 username: user.username,
//                 name: user.name,
//                 role: user.role,
//                 rollNo: user.rollNo
//             }
//         });
//     } catch (err) {
//         console.error("Signup Error:", err.message);
//         res.status(500).json({ message: "Server Error", error: err.message });
//     }
// };
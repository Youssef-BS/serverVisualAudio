
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User'); 
const nodemailer = require('nodemailer');


async function registerUser(req, res) {
    const { email, password, firstname, lastname, telephone, website, company, vat, street_address, postcode, city, country  } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            firstname,
            lastname,
            telephone,
            website,
            company,
            vat,
            street_address,
            postcode,
            city,
            country
        });

        await sendVerificationEmail(email);
        
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function sendVerificationEmail(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'test2104e@gmail.com',
            pass: 'aazzee12'
        }
    });
    const mailOptions = {
        from: 'test2104e@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        text: 'Please click on the following link to verify your email: <verification_link_here>'
    };

    await transporter.sendMail(mailOptions);
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ messageIncorrectPassword: 'Incorrect password' });
        }
        const token = jwt.sign({ userId: user.id }, "test" , { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    registerUser ,
    login
};

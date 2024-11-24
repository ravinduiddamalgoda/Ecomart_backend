const UserService = require('../services/user.service');

const { generateOTP} = require('../utils/otp.util');
const generatePassword = require('../utils/generatePassword.util');
const email = require('../utils/email.util');
const {createPasswordHash} = require('../services/auth.service');
const {validatePassword} = require('../services/auth.service');
const {signToken} = require('../services/auth.service');

const getUsers = async (req, res) => {
    try {
        const users = await UserService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getUserById = async (req, res) => {
    try {
        console.log(req.params.id);
        const user = await UserService.getUserById(req.params.id);
        console.log(req.body.id);
        if(user){
            user.password = "";
            res.status(200).json(user);
        }else {
            res.status(404).json({ message: 'User not found' });
        }
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const password = generatePassword();
        const data = req.body;
        const user = await UserService.createUser(data.firstName, data.lastName, data.email, password, data.role);

        user.password = ""

        if (user) {
            await email.send(
                [user.email],
                `Welcome to EcoMart - A Sustainable Marketplace`,
                `<h2>Welcome to EcoMart!</h2>
                <p>We're thrilled to have you join our community of sustainability enthusiasts. EcoMart is not just an e-commerce platform; it's a mission to reduce waste, promote reuse, and encourage recycling of goods.</p>
                
                <p>Your account has been successfully created, and you're ready to explore the platform! At EcoMart, you can:</p>
                <ul>
                  <li><strong>Buy:</strong> Find amazing deals on secondhand and recyclable goods.</li>
                  <li><strong>Sell:</strong> List your used or recyclable items for sale or donation.</li>
                  <li><strong>Bid:</strong> Participate in exciting auctions for unique, sustainable items.</li>
                </ul>
                
                <p><strong>How to get started:</strong></p>
                <p>Log in to EcoMart using any 8-character password of your choice. The system will securely set this as your permanent password for future logins.</p>
            
                <p>Thank you for joining us in making a positive impact on the environment. Together, we can reduce waste and build a more sustainable future!</p>
            
                <p>If you have any questions or need assistance, our support team is here to help. Feel free to contact us at <a href="mailto:support@ecomart.com">support@ecomart.com</a>.</p>
            
                <p>Happy buying, selling, and bidding!</p>
                <p>Best regards,</p>
                <p>The EcoMart Team</p>
              `
            );
        }
       

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}


const updateUser = async (req, res) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body.policyName, req.body.department, req.body.level, req.body.policyDescription, req.body.policyContent, req.body.policyLink, req.body.policyCreatedDate);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const deleteUser = async (req, res) => {
    try {
        let user = await UserService.deleteUser(req.params.id);

        if(user){
            email.send([res.email], 
                `Account Deleted`,
                `<h2>Your Account has been Deleted</h2>
                <p>Your Account has been Deleted by the Administrator</p>
                <p>Thank You for working with us</p>
                <br/>
                <small>Policy Management System</small>
                <small>if there is any issue with this email, please contact the administrator</small>`,
                `Your Account has been Deleted by the Administrator.
                Thank You for working with us.

                if there is any issue with this email, please contact the administrator`
            );
        }

        res.status(200).json({ message: 'User Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await UserService.getUserByEmail(req.body.email);
        const password = req.body.password;
        if(!user){
            throw new Error('User not found');
        }
        else{
            if(user.firstLogin){
                // const passwordNw = generatePassword();
                user.password = createPasswordHash(req.body.password);
                // console.log(req.body.password);
                // console.log(user.password);

                user.firstLogin = false;
                user.lastLogin = new Date().toISOString();
                await UserService.updateUser(user._id, user.firstName, user.lastName, user.email, user.password, user.role, user.lastLogin, user.firstLogin, user?.otp);
                email.send([user.email], 
                    `Welcome to Policy Management System`,
                    `<h2>Welcome to Policy Management System</h2>
                    Welcome to Policy Management System. Your Password is : ${req.body.password}`
                );
                
                return res.status(200).json({ message: 'First login, password is saved and please login again.' });
            }else {
                const isPasswordValid = validatePassword(req.body.password, user.password);
                // console.log(user.password);
                // console.log(isPasswordValid);
                if(!isPasswordValid){
                    throw new Error('Invalid Password');
                }
                console.log('valid password');
                try{
                    const optVal = generateOTP(5);
                    console.log(optVal);
                    user.otp = optVal;
                    user.lastLogin = new Date().toISOString();
                    await UserService.updateUser(user._id, user.firstName, user.lastName, user.email, user.password, user.role, user.lastLogin, user.firstLogin, user.otp);
                    email.send([user.email], 
                        `OTP for Login`,
                        `<h2>OTP for Login</h2>
                        <p>Your OTP for Login is : <strong> ${optVal} </strong><p>`,
                        `OTP for Login is : ${optVal}`
                    );
                    // const token = signToken({email: user.email, role: user.role , userId: user._id});
                    // console.log(token);
                    // return res.status(200).json({ token , id: user._id  , role: user.role  , department: user.department , level: user.level });
                    return res.status(200).json({ message: 'OTP Sent to your Email' });
                }catch(e){
                    return res.status(500).json({ message: 'Error sending OTP' });
                }                
            }
        }
        //const user = await UserService.loginUser(req.body.email, req.body.password);
        //res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const optFunc = async (req,res) => {
    try{
        const user = await UserService.getUserByEmail(req.body.email);
        console.log(user);
        if(!user){
            throw new Error('User not found');
        }
        if(user.otp == req.body.otp){
            user.otp = "-1";
            UserService.updateUser(user._id, user.firstName, user.lastName, user.email, user.password, user.role, user.lastLogin, user.firstLogin, user.otp);
            const token = await signToken({email: user.email, role: user.role , userId: user._id});
            console.log(token);
            return res.status(200).json({ token: token?.token , id: user._id  , role: user.role , username : user.firstName + " " + user.lastName });
        }else{
            return res.status(500).json({ message: 'Invalid OTP' });
        }
    }catch(e){
        return res.status(500).json({ message: e.message });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    optFunc
}
import Candidates from "../modals/candidateModal.js"
import Users from "../modals/userModal.js"
import bcrypt, { compareSync, hashSync } from "bcrypt"
import { v4 as uuidv4} from "uuid"

export const renderRegister = async (req,res) =>{
    try{
        res.render('register')

    }catch(err){
        return res.send(err)
    }
}

export const register = async (req,res) =>{
    try {
        const { userName, email, password, phone } = req.body;
        if (!userName) { return res.status(400).json({ message: "User name is mandatory!" }); }
        if (!email) { return res.status(400).json({ message: "User email is mandatory!" }); }
        if (!password) { return res.status(400).json({ message: "User password is mandatory!" }); }
        if (!phone) { return res.status(400).json({ message: "Phone number is mandatory!" }); }
        const isUserAvailable = await Users.findOne({ email }).exec();
        if (isUserAvailable) return res.status(403).json({ message: "User already exist!" });
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = new Users({
            userName, email, password: hashedPassword, phone
        })
        console.log(user);
        await user.save();
        return res.send("Registration Successful");
    } catch (err) {
        return res.send(err)
    }
}
const generateToken = async () =>{
    const token = uuidv4()
    return token
}

export const login = async (req,res) => {
    try{
        const{email, password} =req.body
        if (!email) { return res.status(400).json({ message: "User email is mandatory!" }); }
        if (!password) { return res.status(400).json({ message: "User password is mandatory!" }); }
        const user = await Users.findOne({email}).exec();
        if(!user) return res.send("User does not exist!")
        const isPasswordCorrect = compareSync(password,user.password)
        if(isPasswordCorrect){
            if(!user.accesssToken){
                const token = uuidv4()
                await Users.findOneAndUpdate({email}, { accesssToken : token})
            }
            return res.send("Logged in!")
            
        }else{
            return res.send("Wrong password.")
        }
    }catch(err){
        return res.send(err)
    }
}


export const renderGetToken = async (req,res) =>{
    try{
        res.render('getToken', { token: null })

    }catch(err){
        return res.send(err)
    }
}
export const getToken = async (req,res) =>{
    try {
        const { email, password } = req.body;
        if (!email) return res.json({ message: "Email is required!" })
        if (!password) return res.send("Password is required!")
        const user = await Users.findOne({ email }).exec();
        if (!user) return res.send("User not found!" )
        const isPasswordCorrect = bcrypt.compareSync(password, user.password)
        if (isPasswordCorrect) {
            if (user.accesssToken) {
                res.render('getToken', { token: user.accesssToken })
            } else {
                return res.send("Login first to generate token!" )
            }
        } else {
            return res.json({ message: "Wrong Password!" })
        }

    } catch (err) {
        return res.send(err)
    }
}


export const renderVotingPage = async (req,res) =>{
    try{
        const candidate = await Candidates.find({}).exec();
        if(!candidate) return res.send("Candidates not found!")
        res.render('votingPage', {candidate})

    }catch(err){
        return res.send(err)
    }
}

export const votingPage = async (req,res) =>{
    try{
        const{candidateName, token} =req.body
        const user = await Users.findOne({accesssToken: token}).exec();
        // console.log(user._id);
        const candidate = await Candidates.find({}).exec();

         await Candidates.findOneAndUpdate({candidateName}, {$push: {vote : user._id}}).exec();
       

        await candidate.save();
        return res.send("Voting successful!")

    }catch(err){
        return res.send(err)
    }
}


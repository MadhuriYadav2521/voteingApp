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
        if (!userName) { return res.send("User name is mandatory!"); }
        if (!email) { return res.send("User email is mandatory!"); }
        if (!password) { return res.send("User password is mandatory!"); }
        if (!phone) { return res.send("Phone number is mandatory!"); }
        const isUserAvailable = await Users.findOne({ email }).exec();
        if (isUserAvailable) return res.send("User already exist!");
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = new Users({
            userName, email, password: hashedPassword, phone
        })
        console.log(user);
        
        await user.save();
        return res.redirect('/user/login');
    } catch (err) {
        return res.send(err)
    }
}


export const login = async (req,res) => {
    try{
        const{email, password} =req.body
        if (!email) { return res.send("User email is mandatory!"); }
        if (!password) { return res.send("User password is mandatory!"); }
        const user = await Users.findOne({email}).exec();
        if(!user) return res.send("User does not exist!")
        const isPasswordCorrect = compareSync(password,user.password)
        if(isPasswordCorrect){
           
            // return res.send("Logged in!")
            return res.redirect('/user/userMaster');
            
        }else{
             res.send("Wrong password.")
        }
        
    }catch(err){
        return res.send(err)
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;

        const totalUsers = await Users.countDocuments({});
        const totalPages = Math.ceil(totalUsers / perPage);
        const startIndex = (page - 1) * perPage;

        const user = await Users.find({})
            .skip(startIndex)
            .limit(perPage)
            .exec();

        res.render('userMaster', { user, currentPage: page, totalPages });
    } catch (err) {
        res.send(err);
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
        if (!email) return ressend("Email is required!")
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


// export const renderVotingPage = async (req,res) =>{
//     try{
//         const candidate = await Candidates.find({}).exec();
//         if(!candidate) return res.send("Candidates not found!")
//         res.render('votingPage', {candidate})

//     }catch(err){
//         return res.send(err)
//     }
// }

// export const votingPage = async (req,res) =>{
//     try{
//         const { candidateName, token } = req.body;
//         const user = await Users.findOne({ accesssToken: token }).exec();
    
//         if (!user) return res.status(404).send("User not found.");
    
//         const candidate = await Candidates.findOne({ candidateName }).exec();
    
//         if (!candidate) return res.status(404).send("Candidate not found.");
    
//         if (candidate.vote.includes(user._id.toString()))
//           return res.send("You already voted!");
    
//         Candidates.votes += 1;
//         Candidates.vote.push(user._id.toString());
//         await candidate.save();
    
//         return res.send("Voting successful!");

//     }catch(err){
//         return res.send(err)
//     }
// }

export const renderVotingPage = async (req,res) =>{
    try{
        const id = req.params.id
        const user = await Users.findOne({_id: id}).exec();
        const candidate = await Candidates.find({}).exec();
        if(!candidate) return res.send("Candidates not found!")
        res.render('votingPage', {candidate, user})

    }catch(err){
        return res.send(err)
    }
}

export const votingPage = async (req,res) =>{
    try{
       const id = req.params.id
       const{candidateName} = req.body
       const user = await Users.findOne({_id: id}).exec();
       const candidate = await Candidates.find({}).exec();
       const votedCandidate = candidate.find(candidate => candidate.vote.includes(id));
       if (votedCandidate) {
           return res.send("You have already voted for a candidate!");
       }
       const voting = await Candidates.findOneAndUpdate({ candidateName }, { $push: { vote: id } }).exec();
       await voting.save();
       return res.send("Voting successful!");
    }catch(err){
        return res.send(err)
    }
}

export const renderAdminLogin = async (req,res) => {
    try{
      return res.render('adminLogin')
    }catch(err){
        return res.send(err)
    }
}

export const adminLogin = async (req,res) => {
    try{
        const{userName, password} =req.body
        if (!userName) { return res.send("User name is mandatory!"); }
        if (!password) { return res.send("User password is mandatory!"); }
        if(userName == "admin" && password == "admin")
            return res.redirect('/admin/candidateMaster');
        else{
            return res.send("wrong credentials!")
        }
    }catch(err){
        return res.send(err)
    }
}
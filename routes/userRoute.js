import express from "express"
import { adminLogin, getAllUsers, getToken, login, register, renderAdminLogin, renderGetToken, renderRegister, renderVotingPage, votingPage } from "../controllers/userController.js";
import { addCandidate, renderAddCandidate } from "../controllers/candidateController.js";
import { checksToAddCandidate } from "../middlewares/authMiddleware.js";
import Candidates from "../modals/candidateModal.js"
import Users from "../modals/userModal.js"
const userRoute = express.Router()

userRoute.get('/', async (req, res) => {
    try {
     
        res.render('index')

    } catch (err) {
        return res.send(err);
    }

})
userRoute.get('/user/register',renderRegister)
userRoute.post('/user/register',register)
userRoute.get('/user/userMaster',getAllUsers)
userRoute.get('/user/login', async (req, res) => {
    try {
        // const email = req.body.email
        const user = await Users.findOne({}).limit(1).sort({$natural:-1}).exec();
    
        res.render('login',{user})

    } catch (err) {
        return res.send(err);
    }

})

userRoute.post('/user/login',login)
userRoute.get('/admin/addCandidate',renderAddCandidate)
userRoute.post('/admin/addCandidate',checksToAddCandidate,addCandidate)
userRoute.get('/admin/candidateMaster', async (req,res)=> {
    try{
        const candidate = await Candidates.find({}).exec();
        return res.render('candidateMaster', {candidate})
    }catch(err){
        return res.send(err)
    }
})
userRoute.get('/user/getToken',renderGetToken)
userRoute.post('/user/getToken',getToken)
userRoute.get('/user/votingPage/:id',renderVotingPage)
userRoute.post('/user/votingPage/:id',votingPage)
userRoute.get('/admin/login', async (req, res) => {
    try {
     
        res.render('adminLogin')

    } catch (err) {
        return res.send(err);
    }

})
userRoute.post('/admin/login',adminLogin)





export default userRoute;
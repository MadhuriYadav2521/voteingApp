import express from "express"
import { getToken, login, register, renderGetToken, renderRegister, renderVotingPage, votingPage } from "../controllers/userController.js";
import { addCandidate, renderAddCandidate } from "../controllers/candidateController.js";
import { checksToAddCandidate } from "../middlewares/authMiddleware.js";

const userRoute = express.Router()

userRoute.get('/', async (req, res) => {
    try {
     
        res.render('index')

    } catch (err) {
        return res.send(err);
    }

})
// userRoute.get('user/login,)
userRoute.get('/user/register',renderRegister)
userRoute.post('/user/register',register)
userRoute.get('/user/login', async (req, res) => {
    try {
     
        res.render('login')

    } catch (err) {
        return res.send(err);
    }

})
userRoute.post('/user/login',login)
userRoute.get('/admin/addCandidate',renderAddCandidate)
userRoute.post('/admin/addCandidate',checksToAddCandidate,addCandidate)
userRoute.get('/user/getToken',renderGetToken)
userRoute.post('/user/getToken',getToken)
userRoute.get('/user/votingPage',renderVotingPage)
userRoute.post('/user/votingPage',votingPage)






export default userRoute;
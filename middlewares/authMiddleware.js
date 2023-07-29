
export const checksToAddCandidate = async (req,res,next) =>{
    try{
        const{userName, password} = req.body
        if(!userName){return res.send("User name is required!")}
        if(!password){return res.send("Password is required!")}
        if(userName == "admin" && password== "admin"){
            next();
        }else{
            return res.send("Wrong credentials!")
        }
    }catch(err){
        return res.send(err)
    }
}


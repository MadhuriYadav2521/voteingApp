import Candidates from "../modals/candidateModal.js"

export const renderAddCandidate = async (req,res) =>{
    try{
        res.render('candidates')

    }catch(err){
        return res.send(err)
    }
}

export const addCandidate = async (req,res) =>{
    try {
        const { candidateName } = req.body;
        if (!candidateName) { return res.send("Candidate name is mandatory!"); }
        const isCandidateAvailable = await Candidates.findOne({ candidateName }).exec();
        if (isCandidateAvailable) return res.send("Candidate already exist!");
        const candidate = new Candidates({
            candidateName
        })
        console.log(candidate);
        await candidate.save();
        return res.send("Candidate added successfully!");
    } catch (err) {
        return res.send(err)
    }
}
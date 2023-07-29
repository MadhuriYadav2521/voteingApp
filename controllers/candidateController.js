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
        if (!candidateName) { return res.status(400).json({ message: "Candidate name is mandatory!" }); }
        const isCandidateAvailable = await Candidates.findOne({ candidateName }).exec();
        if (isCandidateAvailable) return res.status(403).json({ message: "Candidate already exist!" });
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
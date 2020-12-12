import {sendEmail} from "../helpers/index.js";

const sendEmailHandler = async (req, res, next) => {
    try{
        const {email,emailBody} = req.body.data;
        sendEmail(email,emailBody).then(response=>console.log(response)).catch(err=>console.log(err));
        res.status(200).json({message:"Email Sent"});
    } catch(err) {
        next(err);
    }
};
  
export default sendEmailHandler;
  
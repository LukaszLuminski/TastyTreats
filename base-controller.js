//jshint esversion:9
// 
// const { User } = require("../models");
//
// module.exports = {
//  ...
//     signup: (req, res) => {
//         const { email, confirmEmail } = req.body;
//         const newUserObj = { email, confirmEmail };
//         const newUser = new User(newUserObj);
//         newUser.save((saveErr) => {
//             if(saveErr) {
//                 return res.status(412).send({
//                     success: false,
//                     message: saveErr
//                 })
//             }
//             return res.status(200).json({
//                 success: true,
//                 message: "signup successful"
//             });
//         });
//     }
// }

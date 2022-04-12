const { Router } = require("express");
const { User } = require("../../models/userSchema");
const { requireLogin } = require("../../token");

const route = Router();

// Get a profile
route.get("/:username", requireLogin, async (req, res) => {
    
    // console.log(req.user)

    const id = req.user.user_id;
    const user = await User.findById(id)

    res.send({
        "profile": {
            "username": user.username,
            "bio": user.bio,
            "image": user.image,
            // "following": false
        }
    })
}) 


module.exports = route
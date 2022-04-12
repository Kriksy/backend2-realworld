const { Router } = require("express");

const { createUser } = require("../../controllers/users");

const route = Router();

const { User } = require("../../models/userSchema");

const jwt = require("jsonwebtoken");

const token = require("../../token.js")
const JWT_SECRET = token.SECRET


// -----GET-----
// route.get("/", (req,res) => {
//     res.send({
//         "user": {
//             "username": "hardcoded",
//             "email": "panos@panos.panos",
//             "password": "123",
//         }
//     })
// })

// CURRENT USER - Fake response - it works -- NO NEED FOR THIS
// route.get("/", (req, res) => {
//     res.send({
//         "user": {
//             "username": req.body.user.username,
//             "email": req.body.user.email,
//             "password": req.body.user.password,
//         }
//     })
// })


// -----POST-----
// route.post("/", async (req, res) => {
//     const createdUser = await createUser({
//         username: req.body.user.username,
//         password: req.body.user.password,
//         email: req.body.user.email,
//     })
//     res.send(createdUser);
// })

// REGISTER USER - Fake response - it works
// route.post("/", async (req, res) => {
//     const createdUser = new User({
//         username: "test3",
//         password: "567",
//         email: "test3@test3.com",
//     })
//     await createdUser.save();
//     res.send(createdUser);
// })

// REGISTER USER - It works
/*
route.post("/", async (req, res) => {
    console.log("register")
    console.log(req.body)
    const user = new User({
        username: req.body.user.username,
        password: req.body.user.password,
        email: req.body.user.email,
    })
    await user.save();
    res.send(user);
})
*/

// REGISTER USER - 2nd ATTEMPT (5/4/21)
route.post("/", async (req, res) => {
    // console.log("register:")
    // console.log(req.body)
    var user = new User(req.body)

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.password = req.body.user.password;
    // user.bio = req.body.user.bio;
    // user.image = req.body.user.image;
    
    // sätter token till en tom sträng (för testen krever det)
    user.token = ""

    // console.log("user:")
    // console.log(user)

    await user.save();
    res.send({ user });
})

module.exports = route;


// -----LOGIN----- 
// LOGIN USER - Fake response - it works
// route.post('/login', (req, res) => {
//     let username = "panos";
//     let email = "email@email.com";
//     res.send(`Username: ${username} Password: ${email}`);
// });

// LOGIN USER - it works!
route.post('/login', async (req, res) => {
    const email = req.body.user.email;
    const password = req.body.user.password;

    const loggedInUser = await User.findOne({ email });
    // console.log(loggedInUser)

    if (!req.body.user.email) {
        return res.status(422).json({ errors: { email: "can't be blank" } });
    }

    if (!req.body.user.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }
    if (loggedInUser.password !== password || loggedInUser.email !== email) {
        res.status(403);
        res.json({
            message: "Invalid login",
        });
        return;
    }
    // console.log(req.body)

    // Använder JWT sign för att skapa en token
    const token = jwt.sign(
        // info som vi sparar i vår token 
        {
            user_id: loggedInUser._id,
            username: loggedInUser.username,
            email: loggedInUser.email,

        },
        JWT_SECRET,
        { expiresIn: "24h", subject: loggedInUser.email }
    );

    // sparar token i databasen
    loggedInUser.token = token
    await loggedInUser.save()

    const user = {
        email: loggedInUser.email,
        username: loggedInUser.username,
        bio: loggedInUser.bio,
        image: loggedInUser.image,
        token: token,
    }
    res.json({ user: user });
    // console.log(user)
    // res.json({
    //     message: "Login succesfull",
    // });

    // res.send(`Password: ${password} Password: ${email}`);

});


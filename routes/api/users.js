const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const validateRegisterInput = require("../../validations/register")
const validateLoginInput = require("../../validations/login")


router.get("/test", (req, res) => {
  res.json({ msg: "This is the users route" });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "success" });
  }
);

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      //Throw a 400 error if the email address already exists
      errors.email = "Email is already taken";
      return res.status(400).json({ email: "Already Taken" });
    } else {
      //Otherwise create a new user
      const newUser = new User({
        handle: req.body.handle,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.send(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkOTdhYzdiODM4ZmQ4OWVhNzRkYzNhMSIsImlhdCI6MTU3MDIyNzE0MiwiZXhwIjoxNTcwMjMwNzQyfQ.aMzG9c6dkLVQ0w-8SnOSm3l7KHFJZ_rlpQPlBlXqY08
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user)
      return res.status(404).json({ email: "This user does not exist" });

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          handle: user.handle,
          email: user.email
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else return res.status(400).json({ password: "Incorrect Password" });
    });
  });
});

module.exports = router;

//register
// {
//   const payload = {id: user.id, name: user.handle}
//   jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600},
//     (err, token) => {
//       res.json({
//         success: true,
//         token: "Bearer " + token
//       })
//     })
// }

//login
// const payload = {
//   id: user.id,
//   name: user.name
// };

// jwt.sign(
//   payload,
//   keys.secretOrKey,
//   { expiresIn: 3600 },
//   (err, token) => {
//     res.json({
//       success: true,
//       token: `Bearer ${token}`
//     });
//   }
// );

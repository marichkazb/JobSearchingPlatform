//authRoutes.js is a temporary solution to attribute roles to users. Will be deleted soon.

const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const admin = require("firebase-admin");

router.post("/setAdmin", (req, res) => {
  const { email, password } = req.body;

  // Authenticate the user
  admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      // Set the user's role as admin
      return admin.auth().setCustomUserClaims(user.uid, { role: "admin" });
    })
    .then(() => {
      res.send(`User's role set to Admin for user with e-mail ${email}`);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.post("/setCompany", (req, res) => {
  const { email, password } = req.body;

  // Authenticate the user
  admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      // Set the user's role as admin
      return admin.auth().setCustomUserClaims(user.uid, { role: "company" });
    })
    .then(() => {
      res.send(`User's role set to Company for user with e-mail ${email}`);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.post("/setUser", (req, res) => {
  const { email, password } = req.body;

  // Authenticate the user
  admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      // Set the user's role as admin
      return admin.auth().setCustomUserClaims(user.uid, { role: "user" });
    })
    .then(() => {
      res.send(`User's role set to User for user with e-mail ${email}`);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

module.exports = router;

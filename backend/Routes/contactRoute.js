const express = require("express");
const ContactModel = require("../Models/contactModel.js");

const app = express();
app.use(express.json()); 
app.post("/contactUs", async (req, res) => {
    try {
        const newContact = new ContactModel(req.body);
        await newContact.save();
        console.log("Nje kontakt i ri u shtua:", newContact);
        res.status(200).send(newContact);
    } catch (err) {
        console.log("Nuk u shtua kontakti:", err);
        res.status(500).send("Nuk u shtua");
    }
});

module.exports = app;

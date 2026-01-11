const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
         required: true,
    },
    email:{
        type: String,
         required: true,
    },
    sms:{
        type: String,
        required: true, 
    }
})
const Contact = mongoose.model("Contact", contactSchema)
module.exports = Contact
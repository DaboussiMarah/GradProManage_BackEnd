const mongoose = require('mongoose')
const encadrementSchema = new mongoose.Schema ({
    nomprojet : {
        type : String ,
        required : true
    },
    resume : {
        type:String ,
        unique : true ,
        required : true 

    },
    technologie : {
        type : String ,
        required : true

    },
    nombinome : {
        type : String ,
        required : true

    },
    idenseignant : {
        type : String ,
        required : false

    },
    idetudiant : {
        type : String ,
        required : false

    },

    etatvalidation : {
        type : Boolean ,
        required : false

    },
    


}) 

module.exports=mongoose.model("encadrement",encadrementSchema)
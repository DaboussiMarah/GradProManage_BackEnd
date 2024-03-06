const mongoose = require('mongoose')
const etudiantSchema = new mongoose.Schema ({
    lastname : {
        type : String ,
        required : false
    },
    firstname : {
        type : String ,
        required : false
    },
    email : {
        type:String ,
        unique : true ,
        required : true 

    },
    departement : {
        type : String ,
        required : true

    }
}) 

module.exports=mongoose.model("etudiant",etudiantSchema)
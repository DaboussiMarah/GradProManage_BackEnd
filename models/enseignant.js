const mongoose = require('mongoose')
const enseignantSchema = new mongoose.Schema ({


    cin : {
        type : String ,
        required : true
    },
    lastname : {
        type : String ,
        required : true
    },
    firstname : {
        type : String ,
        required : true
    },
    email : {
        type:String ,
        unique : true ,
        required : true 

    },
    password : {
        type:String ,
        unique : true ,
        required : true 

    },
    poste : {
        type : String ,
        required : true

    },

    encadrements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Encadrement'
      }],
   
    
}) 

module.exports=mongoose.model("enseignant",enseignantSchema)
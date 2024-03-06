 const express = require ('express')
const router = express.Router();

const bcrypt = require ('bcryptjs')

const jwt = require ('jsonwebtoken')

const User = require ('../models/user')
const Admin = require ('../models/admin')
const Etudiant = require ('../models/etudiant')
const Enseignant = require ('../models/enseignant')
const Encadrement = require('../models/encadrement');




router.post("/enseignant/login", async (req, res) => {
    const enseignant = await Enseignant.findOne({ email: req.body.email });

    if (!enseignant) {
        return res.status(404).send({
            message: "Enseignant introuvable."
        });
    }

    if (!(req.body.password == enseignant.password)) {
        return res.status(400).send({
            message: "Mot de passe incorrect."
        });
    }

    // Include email, role, and _id in the JWT payload
    const token = jwt.sign({
        role: "enseignant",
        email: enseignant.email,
        _id: enseignant._id
    }, "secret key");

    // Configuration des cookies avec le jeton JWT
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // Durée de validité du cookie en millisecondes (ici, 24 heures)
    });

    // Réponse indiquant que la connexion a été effectuée avec succès, incluant le jeton, le rôle, le nom, l'email, et l'id
    res.send({
        message: "Connexion effectuée avec succès.",
        token: token,
        role: "enseignant",
        email: enseignant.email,
        _id: enseignant._id
    });
});





router.post('/user/register', async (req, res) => {
    // Récupération des données du corps de la requête
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;

    // Génération d'un sel (salt) pour le hachage du mot de passe
    const salt = await bcrypt.genSalt(10);

    // Hachage du mot de passe avec le sel
    const hashedPassword = await bcrypt.hash(password, salt);

    // Recherche d'un enregistrement existant avec l'adresse e-mail fournie
    const record = await User.findOne({ email: email });

    // Vérification si l'adresse e-mail existe déjà
    if (record) {
        return res.status(400).send({
            message: "L'adresse e-mail existe déjà."
        });
    } else {
        // Création d'un nouvel objet Admin avec les données fournies
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        // Enregistrement de l'administrateur dans la base de données
        await user.save();

        // Réponse indiquant que l'inscription a été effectuée avec succès
        res.send({
            message: "Inscription effectuée avec succès. Aucun JWT généré."
        });
    }
});





//////////////////login user
router.post("/user/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).send({
            message: "user introuvable."
        });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).send({
            message: "Mot de passe incorrect."
        });
    }

    // Include name and email in the JWT payload
    const token = jwt.sign({
        _id: user._id,
        role: "user",
        name: user.name,
        email: user.email  // Include the email property
    }, "secret key");

    // Configuration des cookies avec le jeton JWT
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // Durée de validité du cookie en millisecondes (ici, 24 heures)
    });

    

    // Réponse indiquant que la connexion a été effectuée avec succès, incluant le jeton, le rôle, le nom et l'email
    res.send({
        message: "Connexion effectuée avec succès.",
        token: token,
        role: "user",
        name: user.name,
        email: user.email
    });
});


//////////////////login admin
router.post("/admin/login", async (req, res) => {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
        return res.status(404).send({
            message: "Admin introuvable."
        });
    }

    if (!(await bcrypt.compare(req.body.password, admin.password))) {
        return res.status(400).send({
            message: "Mot de passe incorrect."
        });
    }

    // Include name and email in the JWT payload
    const token = jwt.sign({
        _id: admin._id,
        role: "admin",
        name: admin.name,
        email: admin.email  // Include the email property
    }, "secret key");

    // Configuration des cookies avec le jeton JWT
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // Durée de validité du cookie en millisecondes (ici, 24 heures)
    });

    

    // Réponse indiquant que la connexion a été effectuée avec succès, incluant le jeton, le rôle, le nom et l'email
    res.send({
        message: "Connexion effectuée avec succès.",
        token: token,
        role: "admin",
        name: admin.name,
        email: admin.email
    });
});

router.get ('/admin',async(req,res)=> {
   try {
    const cookie = req.cookies ['jwt']
    const claims = jwt.verify (cookie , "secret")
    if (!claims){
        return res.status(401).send({
            message: "non authentifié"
        })
        
    }
    const admin = await Admin.findOne({_id:claims._id})

    const {password,...data}= await admin.toJSON()
    console.log('Data envoyée côté serveur:', data);
   

    res.send(data)
    


   }catch (err){
    return res.status(401).send({


        message : 'non authentifiéé',
        
    })

   }
})






/////////CRUD OPERATIONS OF STUDENTS///////////

//ADD STUEDENT//
router.post('/ajouter_etudiant', async(req, res) => {
    try {
        const etudiant = await Etudiant.create(req.body)
 
        res.status(200).json("ajout effectué avec succes");
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//DELETE STUDENT//
router.delete('/supprimer_etudiant/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const etudiant = await Etudiant.findByIdAndDelete(id);
        if(!etudiant){
            return res.status(404).json({message: `etudiant inexistant ${id}`})
        }
        res.status(200).json("suppression effectué avec succes");
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})






// UPDATE SUTUDENT //
router.put('/modifier_etudiant/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const etudiant = await Etudiant.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!etudiant){
            return res.status(404).json({message: `etudiant introuvable avec ce id ${id}`})
        }
        const etudiantModifié = await Etudiant.findById(id);
        res.status(200).json(etudiantModifié);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})




//GET ALL STUDENTS//
router.get('/etudiants', async(req, res) => {
    try {
        const etudiants = await Etudiant.find({});
        res.status(200).json(etudiants);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})




//GET STUDENT BY ID///
router.get('/etudiant/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const etudiant = await Etudiant.findById(id);
        res.status(200).json(etudiant);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})










////////CRUD OPERATIONS OF TEACHERS///////////

//ADD TEACHER//
router.post('/ajouter_enseignant', async(req, res) => {
    try {
        const enseignant = await Enseignant.create(req.body)
 
        res.status(200).json("ajout effectué avec succes");
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//DELETE TEACHER//
router.delete('/supprimer_enseignant/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const enseignat = await Enseignant.findByIdAndDelete(id);
        if(!enseignat){
            return res.status(404).json({message: `enseignant inexistant ${id}`})
        }
        res.status(200).json("suppression effectué avec succes");
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})





// UPDATE TEACHER //
router.put('/modifier_enseignant/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const enseignant = await Enseignant.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!enseignant){
            return res.status(404).json({message: `enseignant introuvable avec ce id ${id}`})
        }
        const enseignantModifié = await Enseignant.findById(id);
        res.status(200).json(enseignantModifié);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})




//GET ALL TEACHERS//
router.get('/enseignants', async(req, res) => {
    try {
        const enseignants = await Enseignant.find({});
        res.status(200).json(enseignants);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})




//GET TEACHER BY ID///
router.get('/enseignant/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const enseignant = await Enseignant.findById(id);
        res.status(200).json(enseignant);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


router.post('/ajouter_cc', async (req, res) => {
    try {
      const encadrement = await Encadrement.create(req.body);
  
      // Récupérez l'ID de l'enseignant à partir du corps de la requête
      const enseignantId = req.body.idenseignant;
  
      // Ajoutez l'ID de l'encadrement à la liste des encadrements de l'enseignant
      await Enseignant.findByIdAndUpdate(
        enseignantId,
        { $push: { encadrements: encadrement._id } },
        { new: true }
      );
  
      res.status(200).json({ message: `Ajout effectué avec succès avec l'ID ${encadrement._id}` });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  });

  

  router.get('/encadrements/:enseignantId', async (req, res) => {
    try {
      // Récupérez l'ID de l'enseignant depuis les paramètres de la requête
      const enseignantId = req.params.enseignantId;
  
      // Recherchez les cahiers de charge associés à l'enseignant dans la base de données
      const encadrements = await Encadrement.find({ idenseignant: enseignantId });
  
      res.status(200).json(encadrements);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  });
  


  
  router.delete('/supprimer_cc/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const encadrement = await Encadrement.findByIdAndDelete(id);
        if(!encadrement){
            return res.status(404).json({message: `cahier de charge inexistant ${id}`})
        }
        res.status(200).json("suppression effectué avec succes");
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})













  







module.exports = router
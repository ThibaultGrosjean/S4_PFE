/** Node modules : 

npm install express
npm install body-parser 
npm install express-validator 
npm install mysql 


**/

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');


const app = express();

const enseignantController = require('./controllers/EnseignantController');
const statutController = require('./controllers/StatutController');

const port = 8888;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


app.get('/enseignants/get', enseignantController.getAllEnseignants);

app.get('/enseignants/get/:id', enseignantController.getEnseignant);

app.post('/enseignants/create', enseignantController.addEnseignant);

app.post('/enseignants/copy/:id', enseignantController.copyEnseignant);

app.put('/enseignants/edit/:id', enseignantController.editEnseignant);

app.delete('/enseignants/delete/:id', enseignantController.deleteEnseignant);


app.get('/statuts/get', statutController.getAllStatuts);

app.get('/statuts/get/:id', statutController.getStatut);

app.post('/statuts/create/',statutController.validator, statutController.addStatut);

app.post('/statuts/copy/:id',statutController.validator, statutController.copyStatut);

app.put('/statuts/edit/:id',statutController.validator, statutController.editStatut);

app.delete('/statuts/delete/:id', statutController.deleteStatut);


app.listen(port, () => {
    console.log(`Écoute sur le port : ${port}`);
});
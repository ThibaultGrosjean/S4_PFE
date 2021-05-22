/** Node modules : 

npm install express
npm install body-parser 
npm install express-validator 
npm install mysql 


**/

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const enseignantController = require('./controllers/EnseignantController');
const statutController = require('./controllers/StatutController');

const port = 8888;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/enseignants', enseignantController.getAllEnseignants);

app.get('/enseignants/:id', enseignantController.getEnseignant);

app.post('/enseignants', enseignantController.addEnseignant);

app.put('/enseignants/:id', enseignantController.editEnseignant);

app.delete('/enseignants/:id', enseignantController.deleteEnseignant);


app.get('/statuts', statutController.getAllStatuts);

app.get('/statuts/:id', statutController.getStatut);

app.post('/statuts',statutController.validator, statutController.addStatut);

app.put('/statuts/:id',statutController.validator, statutController.editStatut);

app.delete('/statuts/:id', statutController.deleteStatut);



app.listen(port, () => {
    console.log(`Écoute sur le port : ${port}`);
});
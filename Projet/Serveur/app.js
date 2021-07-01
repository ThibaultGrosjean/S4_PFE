/** Node modules : 

npm install express
npm install body-parser 
npm install express-validator 
npm install mysql 
npm install cors

**/

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');


const app = express();

const enseignantController = require('./controllers/EnseignantController');
const statutController = require('./controllers/StatutController');
const projetController = require('./controllers/ProjetController');
const elementController = require('./controllers/ElementController');
const intervenantController = require('./controllers/IntervenantController');
const formationController = require('./controllers/FormationController');
const periodeController = require('./controllers/PeriodeController');
const volumeHebdomadaireController = require('./controllers/VolumeHebdomadaireControllers');
const volumeGlobaleController = require('./controllers/VolumeGlobaleControllers');
const groupeIntervenantController = require('./controllers/GroupeIntervenantControllers');

const port = 8888;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


app.get('/enseignants/get', enseignantController.getAllEnseignants);

app.get('/enseignants/get/:id', enseignantController.getEnseignant);

app.get('/enseignants/projets/:idProjet/get', enseignantController.getEnseignantByProjetNotInIntervenant);

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


app.get('/projets/get', projetController.getAllProjets);

app.get('/projets/get/:id', projetController.getProjet);

app.get('/projets/non-archive/get', projetController.getProjetArchive);

app.put('/projets/create/:name',projetController.validator, projetController.addProjet);

app.post('/projets/copy/:id',projetController.validator, projetController.copyProjet);

app.put('/projets/edit/:id',projetController.validator, projetController.editProjet);

app.delete('/projets/delete/:id', projetController.deleteProjet);


app.get('/elements/get', elementController.getAllElements);

app.get('/elements/get/:id', elementController.getElement);

app.get('/elements/get/level/:id', elementController.getAllLevelElements);

app.post('/elements/create/',elementController.validator, elementController.addElement);

app.post('/elements/copy/:id',elementController.validator, elementController.copyElement);

app.put('/elements/edit/:id',elementController.validator, elementController.editElement);

app.delete('/elements/delete/:id', elementController.deleteElement);

app.delete('/elements/hierarchie/delete/:id', elementController.deleteHierarchie);


app.get('/intervenants/get', intervenantController.getAllIntervenants);

app.get('/intervenants/get/:id', intervenantController.getIntervenant);

app.get('/intervenants/projets/get/:id', intervenantController.getIntervenantsByProjet);

app.get('/intervenants/projets/:idProjet/module/:idModule/get', intervenantController.getIntervenantsByProjetNotInModule);

app.post('/intervenants/create/',intervenantController.validator, intervenantController.addIntervenant);

app.put('/intervenants/edit/:id',intervenantController.validator, intervenantController.editIntervenant);

app.delete('/intervenants/delete/:id', intervenantController.deleteIntervenant);


app.get('/formations/get', formationController.getAllFormations);

app.get('/formations/get/:id', formationController.getFormation);

app.get('/formations/projets/get/:id', formationController.getFormationByProjet);

app.post('/formations/create/',formationController.validator, formationController.addFormation);

app.put('/formations/edit/:id',formationController.validator, formationController.editFormation);

app.delete('/formations/delete/:id', formationController.deleteFormation);


app.get('/periodes/get', periodeController.getAllPeriodes);

app.get('/periodes/get/:id', periodeController.getPeriode);

app.post('/periodes/create/',periodeController.validator, periodeController.addPeriode);

app.put('/periodes/edit/:id',periodeController.validator, periodeController.editPeriode);

app.delete('/periodes/delete/:id', periodeController.deletePeriode);


app.get('/volumes-hebdomadaires/get', volumeHebdomadaireController.getAllVolumeHebdomadaires);

app.get('/volumes-hebdomadaires/get/:id', volumeHebdomadaireController.getVolumeHebdomadaire);

app.get('/volumes-hebdomadaires/module/get', volumeHebdomadaireController.getVolumesHebdoByModule);

app.post('/volumes-hebdomadaires/create/',volumeHebdomadaireController.validator, volumeHebdomadaireController.addVolumeHebdomadaire);

app.post('/volumes-hebdomadaires/create/:module/nbsemaine/:semaineDeb/:semaineFin',volumeHebdomadaireController.validator, volumeHebdomadaireController.addVolumesHebdomadaires);

app.post('/volumes-hebdomadaires/copy/:id',volumeHebdomadaireController.validator, volumeHebdomadaireController.copyVolumeHebdomadaire);

app.put('/volumes-hebdomadaires/edit/:id',volumeHebdomadaireController.validator, volumeHebdomadaireController.editVolumeHebdomadaire);

app.put('/volumes-hebdomadaires/edit/:value/elements/:id/:type',volumeHebdomadaireController.validator, volumeHebdomadaireController.editTypeValueElementVolumeHebdomadaire);

app.delete('/volumes-hebdomadaires/semestre/:id/nbsemaine/:semaineDeb/:semaineFin/delete', volumeHebdomadaireController.deleteAllVolumesHebdomadairesBySemaine);

app.delete('/volumes-hebdomadaires/formation/delete/:id', volumeHebdomadaireController.deleteAllVolumesHebdomadairesByFormation);

app.delete('/volumes-hebdomadaires/delete/element/:element', volumeHebdomadaireController.deleteAllVolumesHebdomadaires);

app.delete('/volumes-hebdomadaires/delete/:id', volumeHebdomadaireController.deleteVolumeHebdomadaire);


app.get('/volumes-globaux/get', volumeGlobaleController.getAllVolumeGlobales);

app.get('/volumes-globaux/get/:id', volumeGlobaleController.getVolumeGlobale);

app.post('/volumes-globaux/create/',volumeGlobaleController.validator, volumeGlobaleController.addVolumeGlobale);

app.post('/volumes-globaux/copy/:id',volumeGlobaleController.validator, volumeGlobaleController.copyVolumeGlobale);

app.put('/volumes-globaux/edit/:id',volumeGlobaleController.validator, volumeGlobaleController.editVolumeGlobale);

app.delete('/volumes-globaux/formation/delete/:id', volumeGlobaleController.deleteAllVolumesGlobauxByFormation);

app.delete('/volumes-globaux/delete/:id', volumeGlobaleController.deleteVolumeGlobale);


app.get('/groupes-intervenants/get', groupeIntervenantController.getAllGroupeIntervenants);

app.get('/groupes-intervenants/get/:id', groupeIntervenantController.getGroupeIntervenant);

app.get('/groupes-intervenants/module/get', groupeIntervenantController.getIntervenantByModule);

app.post('/groupes-intervenants/create/',groupeIntervenantController.validator, groupeIntervenantController.addGroupeIntervenant);

app.post('/groupes-intervenants/create/module/:module/intervenant/:intervenant/nbsemaine/:semaineDeb/:semaineFin',groupeIntervenantController.validator, groupeIntervenantController.addVolumesHebdomadaires);

app.post('/groupes-intervenants/copy/:id',groupeIntervenantController.validator, groupeIntervenantController.copyGroupeIntervenant);

app.put('/groupes-intervenants/edit/:id',groupeIntervenantController.validator, groupeIntervenantController.editGroupeIntervenant);

app.put('/groupes-intervenants/edit/:value/elements/:id/:type/intervenant/:intervenant',groupeIntervenantController.validator, groupeIntervenantController.editTypeValueElementGroupeIntervenant);

app.delete('/groupes-intervenants/semestre/:id/nbsemaine/:semaineDeb/:semaineFin/delete', groupeIntervenantController.deleteAllGroupesIntervenantsBySemaine);

app.delete('/groupes-intervenants/formation/delete/:id', groupeIntervenantController.deleteAllGroupesIntervenantsByFormation);

app.delete('/groupes-intervenants/delete/element/:element/intervenant/:intervenant', groupeIntervenantController.deleteAllGroupesIntervenants);

app.delete('/groupes-intervenants/delete/:id', groupeIntervenantController.deleteGroupeIntervenant);


app.listen(port, () => {
    console.log(`Écoute sur le port : ${port}`);
});
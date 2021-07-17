/** Node modules : 

npm install express
npm install body-parser 
npm install express-validationResult 
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
const bilanController = require('./controllers/BilanController');

const port = 8888;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


app.get('/enseignants/get', enseignantController.getAllEnseignants);

app.get('/enseignants/get/:id', enseignantController.getEnseignant);

app.get('/enseignants/statuts/get/:id', enseignantController.getEnseignantByStatut);

app.get('/enseignants/projets/:idProjet/get', enseignantController.getEnseignantByProjetNotInIntervenant);

app.post('/enseignants/create', enseignantController.validationResult, enseignantController.addEnseignant);

app.post('/enseignants/copy/:id', enseignantController.copyEnseignant);

app.patch('/enseignants/edit/:id', enseignantController.validationResult, enseignantController.editEnseignant);

app.delete('/enseignants/delete/:id', enseignantController.deleteEnseignant);


app.get('/statuts/get', statutController.getAllStatuts);

app.get('/statuts/get/:id', statutController.getStatut);

app.post('/statuts/create/',statutController.validationResult, statutController.addStatut);

app.post('/statuts/copy/:id',statutController.validationResult, statutController.copyStatut);

app.patch('/statuts/edit/:id',statutController.validationResult, statutController.editStatut);

app.delete('/statuts/delete/:id', statutController.deleteStatut);


app.get('/projets/get', projetController.getAllProjets);

app.get('/projets/get/:id', projetController.getProjet);

app.post('/projets/create/:name',projetController.validationResult, projetController.addProjet);

app.post('/projets/copy/:id', projetController.copyProjet);

app.patch('/projets/edit/:projetId/verrou/:verrou', projetController.verrouFormationProjet);

app.patch('/projets/edit/:id',projetController.validationResult, projetController.editProjet);

app.delete('/projets/delete/:id', projetController.deleteProjet);


app.get('/elements/get', elementController.getAllElements);

app.get('/elements/modules/projets/get/:id', elementController.getAllElementsModules);

app.get('/elements/get/:id', elementController.getElement);

app.get('/elements/hierarchie/get/:id', elementController.getHierarchieByRoot);

app.get('/elements/hierarchie/racine/get/', elementController.getAllRacineHierarchie);

app.get('/elements/children/get/:id', elementController.getChildrenElement);

app.post('/elements/create/',elementController.validationResult, elementController.addElement);

app.post('/elements/copy/:id/parent/:parent', elementController.copyElement);

app.patch('/elements/edit/:id',elementController.validationResult, elementController.editElement);

app.delete('/elements/delete/:id', elementController.deleteElement);

app.delete('/elements/hierarchie/delete/:id', elementController.deleteHierarchie);


app.get('/intervenants/get', intervenantController.getAllIntervenants);

app.get('/intervenants/get/:id', intervenantController.getIntervenant);

app.get('/intervenants/projets/get/:id', intervenantController.getIntervenantsByProjet);

app.get('/intervenants/groupes-intervenants/projets/:idProjet/module/:idModule/get', intervenantController.getIntervenantsForGrpIntervByProjetNotInModule);

app.get('/intervenants/volumes-globaux/projets/:idProjet/module/:idModule/get', intervenantController.getIntervenantsForVolGlobByProjetNotInModule);

app.post('/intervenants/create/',intervenantController.validationResult, intervenantController.addIntervenant);

app.post('/intervenants/copy/projets/:projetId/new-projet/:newProjetId', intervenantController.copyIntervenantByProjet);

app.patch('/intervenants/edit/:id',intervenantController.validationResult, intervenantController.editIntervenant);

app.delete('/intervenants/delete/:id', intervenantController.deleteIntervenant);


app.get('/formations/get', formationController.getAllFormations);

app.get('/formations/get/:id', formationController.getFormation);

app.get('/formations/projets/get/:id', formationController.getFormationByProjet);

app.post('/formations/create/',formationController.validationResult, formationController.addFormation);

app.post('/formations/copy/:id/projet/:projet/element/:element',formationController.validationResult, formationController.copyFormation);

app.patch('/formations/edit/:id',formationController.validationResult, formationController.editFormation);

app.delete('/formations/delete/:id', formationController.deleteFormation);


app.get('/periodes/get', periodeController.getAllPeriodes);

app.get('/periodes/get/:id', periodeController.getPeriode);

app.get('/periodes/element/get/:id', periodeController.getPeriodeByElementId);

app.post('/periodes/create/',periodeController.validationResult, periodeController.addPeriode)

app.post('/periodes/copy/:id/parent/:parent', periodeController.copyPeriode);

app.patch('/periodes/edit/:id',periodeController.validationResult, periodeController.editPeriode);

app.delete('/periodes/element/delete/:id', periodeController.deletePeriodeByElement);

app.delete('/periodes/delete/:id', periodeController.deletePeriode);


app.get('/volumes-hebdomadaires/get', volumeHebdomadaireController.getAllVolumeHebdomadaires);

app.get('/volumes-hebdomadaires/get/:id', volumeHebdomadaireController.getVolumeHebdomadaire);

app.get('/volumes-hebdomadaires/module/get', volumeHebdomadaireController.getAllVolumesHebdoByModule);

app.get('/volumes-hebdomadaires/module/get/:id', volumeHebdomadaireController.getVolumeHebdoByModule);

app.post('/volumes-hebdomadaires/create/',volumeHebdomadaireController.validationResult, volumeHebdomadaireController.addVolumeHebdomadaire);

app.post('/volumes-hebdomadaires/create/:module/nbsemaine/:semaineDeb/:semaineFin',volumeHebdomadaireController.validationResult, volumeHebdomadaireController.addVolumesHebdomadaires);

app.post('/volumes-hebdomadaires/copy/:id/parent/:parent', volumeHebdomadaireController.copyVolumeHebdomadaire);

app.patch('/volumes-hebdomadaires/edit/:id',volumeHebdomadaireController.validationResult, volumeHebdomadaireController.editVolumeHebdomadaire);

app.patch('/volumes-hebdomadaires/edit/:value/elements/:id/:type',volumeHebdomadaireController.validationResult, volumeHebdomadaireController.editTypeValueElementVolumeHebdomadaire);

app.delete('/volumes-hebdomadaires/semestre/:id/nbsemaine/:semaineDeb/:semaineFin/delete', volumeHebdomadaireController.deleteAllVolumesHebdomadairesBySemaine);

app.delete('/volumes-hebdomadaires/formation/delete/:id', volumeHebdomadaireController.deleteAllVolumesHebdomadairesByFormation);

app.delete('/volumes-hebdomadaires/delete/element/:element', volumeHebdomadaireController.deleteAllVolumesHebdomadaires);

app.delete('/volumes-hebdomadaires/delete/:id', volumeHebdomadaireController.deleteVolumeHebdomadaire);


app.get('/volumes-globaux/get', volumeGlobaleController.getAllVolumeGlobales);

app.get('/volumes-globaux/get/:id', volumeGlobaleController.getVolumeGlobale);

app.post('/volumes-globaux/create/',volumeGlobaleController.validationResult, volumeGlobaleController.addVolumeGlobale);

app.post('/volumes-globaux/module/:module/intervenant/:intervenant/create',volumeGlobaleController.validationResult, volumeGlobaleController.addVolumeGlobaleByModule);

app.post('/volumes-globaux/copy/:id', volumeGlobaleController.copyVolumeGlobale);

app.patch('/volumes-globaux/edit/:id',volumeGlobaleController.validationResult, volumeGlobaleController.editVolumeGlobale);

app.patch('/volumes-globaux/edit/:value/elements/:id/:type',volumeGlobaleController.validationResult, volumeGlobaleController.editTypeValueElementVolumesGlobaux);

app.delete('/volumes-globaux/formation/delete/:id', volumeGlobaleController.deleteAllVolumesGlobauxByFormation);

app.delete('/volumes-globaux/delete/element/:element/intervenant/:intervenant', volumeGlobaleController.deleteAllVolumesGlobaux);

app.delete('/volumes-globaux/delete/:id', volumeGlobaleController.deleteVolumeGlobale);


app.get('/groupes-intervenants/get', groupeIntervenantController.getAllGroupeIntervenants);

app.get('/groupes-intervenants/get/:id', groupeIntervenantController.getGroupeIntervenant);

app.get('/groupes-intervenants/module/get', groupeIntervenantController.getAllGroupeIntervenantByModule);

app.get('/groupes-intervenants/module/get/:id', groupeIntervenantController.getGroupeIntervenantByModule);

app.post('/groupes-intervenants/create/',groupeIntervenantController.validationResult, groupeIntervenantController.addGroupeIntervenant);

app.post('/groupes-intervenants/create/module/:module/intervenant/:intervenant/nbsemaine/:semaineDeb/:semaineFin',groupeIntervenantController.validationResult, groupeIntervenantController.addGroupesIntervenants);

app.post('/groupes-intervenants/copy/:id/parent/:parent/enseignant/:enseignant/projet/:projet', groupeIntervenantController.copyGroupeIntervenant);

app.patch('/groupes-intervenants/edit/:id',groupeIntervenantController.validationResult, groupeIntervenantController.editGroupeIntervenant);

app.patch('/groupes-intervenants/edit/:value/elements/:id/:type/intervenant/:intervenant',groupeIntervenantController.validationResult, groupeIntervenantController.editTypeValueElementGroupeIntervenant);

app.delete('/groupes-intervenants/semestre/:id/nbsemaine/:semaineDeb/:semaineFin/delete', groupeIntervenantController.deleteAllGroupesIntervenantsBySemaine);

app.delete('/groupes-intervenants/formation/delete/:id', groupeIntervenantController.deleteAllGroupesIntervenantsByFormation);

app.delete('/groupes-intervenants/delete/element/:element/intervenant/:intervenant', groupeIntervenantController.deleteAllGroupesIntervenants);

app.delete('/groupes-intervenants/delete/:id', groupeIntervenantController.deleteGroupeIntervenant);


app.get('/bilan/general/projets/get/:id', bilanController.getAllBilanByProjetIntervenant);

app.get('/bilan/sous-total/projets/get/:id', bilanController.getAllBilanSousTotal);

app.get('/bilan/groupe-sous-total/limite/get/:id', bilanController.getAllGroupeSousTotalByIdLimite);

app.get('/bilan/limite-sous-total/projet/get/:id', bilanController.getAllLimiteSousTotalByProjet);

app.get('/bilan/limite-sous-total/nom/:nom/projet/get/:id', bilanController.getAllLimiteSousTotalByProjetAndName);

app.get('/bilan/groupe-sous-total/element/:element/projet/get/:id', bilanController.getAllGroupeSousTotalByProjetAndElement);

app.post('/bilan/limite-sous-total/create/',bilanController.validationResult, bilanController.addLimiteSousTotal);

app.post('/bilan/groupe-sous-total/create/',bilanController.validationResult, bilanController.addGroupeSousTotal);

app.post('/bilan/limite-sous-total/copy/:id/projet/:projet',bilanController.validationResult, bilanController.copyLimiteSousTotal);

app.post('/bilan/groupe-sous-total/copy/:id/limite/:limite', bilanController.copyGroupeSousTotalByLimite);

app.patch('/bilan/limite-sous-total/edit/:id',bilanController.validationResult, bilanController.editLimiteSousTotal);

app.delete('/bilan/groupe-sous-total/delete/:id', bilanController.deleteGroupeSousTotal);

app.delete('/bilan/limite-sous-total/delete/:id', bilanController.deleteLimiteSousTotal);


app.listen(port, () => {
    console.log(`Écoute sur le port : ${port}`);
});
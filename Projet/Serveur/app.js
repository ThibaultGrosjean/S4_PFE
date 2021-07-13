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
const bilanController = require('./controllers/BilanController');

const port = 8888;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


app.get('/enseignants/get', enseignantController.getAllEnseignants);

app.get('/enseignants/get/:id', enseignantController.getEnseignant);

app.get('/enseignants/statuts/get/:id', enseignantController.getEnseignantByStatut);

app.get('/enseignants/projets/:idProjet/get', enseignantController.getEnseignantByProjetNotInIntervenant);

app.post('/enseignants/create', enseignantController.addEnseignant);

app.post('/enseignants/copy/:id', enseignantController.copyEnseignant);

app.patch('/enseignants/edit/:id', enseignantController.editEnseignant);

app.delete('/enseignants/delete/:id', enseignantController.deleteEnseignant);


app.get('/statuts/get', statutController.getAllStatuts);

app.get('/statuts/get/:id', statutController.getStatut);

app.post('/statuts/create/',statutController.validator, statutController.addStatut);

app.post('/statuts/copy/:id',statutController.validator, statutController.copyStatut);

app.patch('/statuts/edit/:id',statutController.validator, statutController.editStatut);

app.delete('/statuts/delete/:id', statutController.deleteStatut);


app.get('/projets/get', projetController.getAllProjets);

app.get('/projets/get/:id', projetController.getProjet);

app.post('/projets/create/:name',projetController.validator, projetController.addProjet);

app.post('/projets/copy/:id',projetController.validator, projetController.copyProjet);

app.patch('/projets/edit/:projetId/verrou/:verrou', projetController.verrouFormationProjet);

app.patch('/projets/edit/:id',projetController.validator, projetController.editProjet);

app.delete('/projets/delete/:id', projetController.deleteProjet);


app.get('/elements/get', elementController.getAllElements);

app.get('/elements/modules/projets/get/:id', elementController.getAllElementsModules);

app.get('/elements/get/:id', elementController.getElement);

app.get('/elements/hierarchie/get/:id', elementController.getHierarchieByRoot);

app.get('/elements/children/get/:id', elementController.getChildrenElement);

app.post('/elements/create/',elementController.validator, elementController.addElement);

app.post('/elements/copy/:id/parent/:parent',elementController.validator, elementController.copyElement);

app.patch('/elements/edit/:id',elementController.validator, elementController.editElement);

app.delete('/elements/delete/:id', elementController.deleteElement);

app.delete('/elements/hierarchie/delete/:id', elementController.deleteHierarchie);


app.get('/intervenants/get', intervenantController.getAllIntervenants);

app.get('/intervenants/get/:id', intervenantController.getIntervenant);

app.get('/intervenants/projets/get/:id', intervenantController.getIntervenantsByProjet);

app.get('/intervenants/groupes-intervenants/projets/:idProjet/module/:idModule/get', intervenantController.getIntervenantsForGrpIntervByProjetNotInModule);

app.get('/intervenants/volumes-globaux/projets/:idProjet/module/:idModule/get', intervenantController.getIntervenantsForVolGlobByProjetNotInModule);

app.post('/intervenants/create/',intervenantController.validator, intervenantController.addIntervenant);

app.post('/intervenants/copy/projets/:projetId/new-projet/:newProjetId', intervenantController.copyIntervenantByProjet);

app.patch('/intervenants/edit/:id',intervenantController.validator, intervenantController.editIntervenant);

app.delete('/intervenants/delete/:id', intervenantController.deleteIntervenant);


app.get('/formations/get', formationController.getAllFormations);

app.get('/formations/get/:id', formationController.getFormation);

app.get('/formations/projets/get/:id', formationController.getFormationByProjet);

app.post('/formations/create/',formationController.validator, formationController.addFormation);

app.post('/formations/copy/:id/projet/:projet/element/:element',formationController.validator, formationController.copyFormation);

app.patch('/formations/edit/:id',formationController.validator, formationController.editFormation);

app.delete('/formations/delete/:id', formationController.deleteFormation);


app.get('/periodes/get', periodeController.getAllPeriodes);

app.get('/periodes/get/:id', periodeController.getPeriode);

app.get('/periodes/element/get/:id', periodeController.getPeriodeByElementId);

app.post('/periodes/create/',periodeController.validator, periodeController.addPeriode)

app.post('/periodes/copy/:id/parent/:parent',periodeController.validator, periodeController.copyPeriode);

app.patch('/periodes/edit/:id',periodeController.validator, periodeController.editPeriode);

app.delete('/periodes/element/delete/:id', periodeController.deletePeriodeByElement);

app.delete('/periodes/delete/:id', periodeController.deletePeriode);


app.get('/volumes-hebdomadaires/get', volumeHebdomadaireController.getAllVolumeHebdomadaires);

app.get('/volumes-hebdomadaires/get/:id', volumeHebdomadaireController.getVolumeHebdomadaire);

app.get('/volumes-hebdomadaires/module/get', volumeHebdomadaireController.getAllVolumesHebdoByModule);

app.get('/volumes-hebdomadaires/module/get/:id', volumeHebdomadaireController.getVolumeHebdoByModule);

app.post('/volumes-hebdomadaires/create/',volumeHebdomadaireController.validator, volumeHebdomadaireController.addVolumeHebdomadaire);

app.post('/volumes-hebdomadaires/create/:module/nbsemaine/:semaineDeb/:semaineFin',volumeHebdomadaireController.validator, volumeHebdomadaireController.addVolumesHebdomadaires);

app.post('/volumes-hebdomadaires/copy/:id/parent/:parent',volumeHebdomadaireController.validator, volumeHebdomadaireController.copyVolumeHebdomadaire);

app.patch('/volumes-hebdomadaires/edit/:id',volumeHebdomadaireController.validator, volumeHebdomadaireController.editVolumeHebdomadaire);

app.patch('/volumes-hebdomadaires/edit/:value/elements/:id/:type',volumeHebdomadaireController.validator, volumeHebdomadaireController.editTypeValueElementVolumeHebdomadaire);

app.delete('/volumes-hebdomadaires/semestre/:id/nbsemaine/:semaineDeb/:semaineFin/delete', volumeHebdomadaireController.deleteAllVolumesHebdomadairesBySemaine);

app.delete('/volumes-hebdomadaires/formation/delete/:id', volumeHebdomadaireController.deleteAllVolumesHebdomadairesByFormation);

app.delete('/volumes-hebdomadaires/delete/element/:element', volumeHebdomadaireController.deleteAllVolumesHebdomadaires);

app.delete('/volumes-hebdomadaires/delete/:id', volumeHebdomadaireController.deleteVolumeHebdomadaire);


app.get('/volumes-globaux/get', volumeGlobaleController.getAllVolumeGlobales);

app.get('/volumes-globaux/get/:id', volumeGlobaleController.getVolumeGlobale);

app.post('/volumes-globaux/create/',volumeGlobaleController.validator, volumeGlobaleController.addVolumeGlobale);

app.post('/volumes-globaux/module/:module/intervenant/:intervenant/create',volumeGlobaleController.validator, volumeGlobaleController.addVolumeGlobaleByModule);

app.post('/volumes-globaux/copy/:id',volumeGlobaleController.validator, volumeGlobaleController.copyVolumeGlobale);

app.patch('/volumes-globaux/edit/:id',volumeGlobaleController.validator, volumeGlobaleController.editVolumeGlobale);

app.patch('/volumes-globaux/edit/:value/elements/:id/:type',volumeGlobaleController.validator, volumeGlobaleController.editTypeValueElementVolumesGlobaux);

app.delete('/volumes-globaux/formation/delete/:id', volumeGlobaleController.deleteAllVolumesGlobauxByFormation);

app.delete('/volumes-globaux/delete/element/:element/intervenant/:intervenant', volumeGlobaleController.deleteAllVolumesGlobaux);

app.delete('/volumes-globaux/delete/:id', volumeGlobaleController.deleteVolumeGlobale);


app.get('/groupes-intervenants/get', groupeIntervenantController.getAllGroupeIntervenants);

app.get('/groupes-intervenants/get/:id', groupeIntervenantController.getGroupeIntervenant);

app.get('/groupes-intervenants/module/get', groupeIntervenantController.getAllGroupeIntervenantByModule);

app.get('/groupes-intervenants/module/get/:id', groupeIntervenantController.getGroupeIntervenantByModule);

app.post('/groupes-intervenants/create/',groupeIntervenantController.validator, groupeIntervenantController.addGroupeIntervenant);

app.post('/groupes-intervenants/create/module/:module/intervenant/:intervenant/nbsemaine/:semaineDeb/:semaineFin',groupeIntervenantController.validator, groupeIntervenantController.addVolumesHebdomadaires);

app.post('/groupes-intervenants/copy/:id/parent/:parent/enseignant/:enseignant/projet/:projet',groupeIntervenantController.validator, groupeIntervenantController.copyGroupeIntervenant);

app.patch('/groupes-intervenants/edit/:id',groupeIntervenantController.validator, groupeIntervenantController.editGroupeIntervenant);

app.patch('/groupes-intervenants/edit/:value/elements/:id/:type/intervenant/:intervenant',groupeIntervenantController.validator, groupeIntervenantController.editTypeValueElementGroupeIntervenant);

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

app.post('/bilan/limite-sous-total/create/',bilanController.validatorLimite, bilanController.addLimiteSousTotal);

app.post('/bilan/groupe-sous-total/create/',bilanController.validatorGroupe, bilanController.addGroupeSousTotal);

app.post('/bilan/limite-sous-total/copy/:id/projet/:projet',bilanController.validatorGroupe, bilanController.copyLimiteSousTotal);

app.post('/bilan/groupe-sous-total/copy/:id/limite/:limite',bilanController.validatorGroupe, bilanController.copyGroupeSousTotalByLimite);

app.patch('/bilan/limite-sous-total/edit/:id',bilanController.validatorLimite, bilanController.editLimiteSousTotal);

app.delete('/bilan/groupe-sous-total/delete/:id', bilanController.deleteGroupeSousTotal);

app.delete('/bilan/limite-sous-total/delete/:id', bilanController.deleteLimiteSousTotal);


app.listen(port, () => {
    console.log(`Écoute sur le port : ${port}`);
});
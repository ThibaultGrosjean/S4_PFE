const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
const utilisateurController = require('./controllers/UtilisateurController');

const port = 8888;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


app.get('/enseignants/get', utilisateurController.verifToken, enseignantController.getAllEnseignants);

app.get('/enseignants/get/:id', utilisateurController.verifToken, enseignantController.getEnseignant);

app.get('/enseignants/statuts/get/:id', utilisateurController.verifToken, enseignantController.getEnseignantByStatut);

app.get('/enseignants/projets/:idProjet/get', utilisateurController.verifToken, enseignantController.getEnseignantByProjetNotInIntervenant);

app.post('/enseignants/create', utilisateurController.verifToken, enseignantController.validationResult, enseignantController.addEnseignant);

app.post('/enseignants/copy/:id', utilisateurController.verifToken, enseignantController.copyEnseignant);

app.patch('/enseignants/edit/:id', utilisateurController.verifToken, enseignantController.validationResult, enseignantController.editEnseignant);

app.delete('/enseignants/delete/:id', utilisateurController.verifToken, enseignantController.deleteEnseignant);


app.get('/statuts/get', utilisateurController.verifToken, statutController.getAllStatuts);

app.get('/statuts/limite/get/:id', utilisateurController.verifToken, statutController.getAllStatutsLimite);

app.get('/statuts/get/:id', utilisateurController.verifToken, statutController.getStatut);

app.post('/statuts/create/', utilisateurController.verifToken, statutController.validationResult, statutController.addStatut);

app.post('/statuts/copy/:id', utilisateurController.verifToken, statutController.validationResult, statutController.copyStatut);

app.patch('/statuts/edit/:id', utilisateurController.verifToken, statutController.validationResult, statutController.editStatut);

app.delete('/statuts/delete/:id', utilisateurController.verifToken, statutController.deleteStatut);


app.get('/projets/get', utilisateurController.verifToken, projetController.getAllProjets);

app.get('/projets/get/:id', utilisateurController.verifToken, projetController.getProjet);

app.post('/projets/create/:name', utilisateurController.verifToken, projetController.validationResult, projetController.addProjet);

app.post('/projets/copy/:id', utilisateurController.verifToken, projetController.copyProjet);

app.patch('/projets/edit/:projetId/verrou/:verrou', utilisateurController.verifToken, projetController.verrouFormationProjet);

app.patch('/projets/edit/:id', utilisateurController.verifToken, projetController.validationResult, projetController.editProjet);

app.delete('/projets/delete/:id', utilisateurController.verifToken, projetController.deleteProjet);


app.get('/elements/hebdomadaire/get', utilisateurController.verifToken, elementController.getAllElementsHebdo);

app.get('/elements/globale/get', utilisateurController.verifToken, elementController.getAllElementsGlobale);

app.get('/elements/modules/projets/get/:id', utilisateurController.verifToken, elementController.getAllElementsModules);

app.get('/elements/get/:id', utilisateurController.verifToken, elementController.getElement);

app.get('/elements/hierarchie/get/:id', utilisateurController.verifToken, elementController.getHierarchieByRoot);

app.get('/elements/hierarchie/racine/get/', utilisateurController.verifToken, elementController.getAllRacineHierarchie);

app.get('/elements/children/get/:id', utilisateurController.verifToken, elementController.getChildrenElement);

app.post('/elements/create/', utilisateurController.verifToken,elementController.validationResult, elementController.addElement);

app.post('/elements/copy/:id/parent/:parent', utilisateurController.verifToken, elementController.copyElement);

app.patch('/elements/edit/:id', utilisateurController.verifToken,elementController.validationResult, elementController.editElement);

app.delete('/elements/delete/:id', utilisateurController.verifToken, elementController.deleteElement);

app.delete('/elements/hierarchie/delete/:id', utilisateurController.verifToken, elementController.deleteHierarchie);


app.get('/intervenants/get', utilisateurController.verifToken, intervenantController.getAllIntervenants);

app.get('/intervenants/get/:id', utilisateurController.verifToken, intervenantController.getIntervenant);

app.get('/intervenants/projets/get/:id', utilisateurController.verifToken, intervenantController.getIntervenantsByProjet);

app.get('/intervenants/groupes-intervenants/projets/:idProjet/module/:idModule/get', utilisateurController.verifToken, intervenantController.getIntervenantsForGrpIntervByProjetNotInModule);

app.get('/intervenants/volumes-globaux/projets/:idProjet/module/:idModule/get', utilisateurController.verifToken, intervenantController.getIntervenantsForVolGlobByProjetNotInModule);

app.post('/intervenants/create/', utilisateurController.verifToken,intervenantController.validationResult, intervenantController.addIntervenant);

app.post('/intervenants/copy/projets/:projetId/new-projet/:newProjetId', utilisateurController.verifToken, intervenantController.copyIntervenantByProjet);

app.patch('/intervenants/edit/:id', utilisateurController.verifToken,intervenantController.validationResult, intervenantController.editIntervenant);

app.delete('/intervenants/delete/:id', utilisateurController.verifToken, intervenantController.deleteIntervenant);


app.get('/formations/get', utilisateurController.verifToken, formationController.getAllFormations);

app.get('/formations/get/:id', utilisateurController.verifToken, formationController.getFormation);

app.get('/formations/projets/get/:id', utilisateurController.verifToken, formationController.getFormationByProjet);

app.post('/formations/create/', utilisateurController.verifToken,formationController.validationResult, formationController.addFormation);

app.post('/formations/copy/:id/projet/:projet/element/:element', utilisateurController.verifToken,formationController.validationResult, formationController.copyFormation);

app.patch('/formations/edit/:id', utilisateurController.verifToken,formationController.validationResult, formationController.editFormation);

app.delete('/formations/delete/:id', utilisateurController.verifToken, formationController.deleteFormation);


app.get('/periodes/get', utilisateurController.verifToken, periodeController.getAllPeriodes);

app.get('/periodes/get/:id', utilisateurController.verifToken, periodeController.getPeriode);

app.get('/periodes/element/get/:id', utilisateurController.verifToken, periodeController.getPeriodeByElementId);

app.post('/periodes/create/', utilisateurController.verifToken,periodeController.validationResult, periodeController.addPeriode)

app.post('/periodes/copy/:id/parent/:parent', utilisateurController.verifToken, periodeController.copyPeriode);

app.patch('/periodes/edit/:id', utilisateurController.verifToken,periodeController.validationResult, periodeController.editPeriode);

app.delete('/periodes/element/delete/:id', utilisateurController.verifToken, periodeController.deletePeriodeByElement);

app.delete('/periodes/delete/:id', utilisateurController.verifToken, periodeController.deletePeriode);


app.get('/volumes-hebdomadaires/get', utilisateurController.verifToken, volumeHebdomadaireController.getAllVolumeHebdomadaires);

app.get('/volumes-hebdomadaires/get/:id', utilisateurController.verifToken, volumeHebdomadaireController.getVolumeHebdomadaire);

app.get('/volumes-hebdomadaires/module/get', utilisateurController.verifToken, volumeHebdomadaireController.getAllVolumesHebdoByModule);

app.get('/volumes-hebdomadaires/module/get/:id', utilisateurController.verifToken, volumeHebdomadaireController.getVolumeHebdoByModule);

app.post('/volumes-hebdomadaires/create/', utilisateurController.verifToken,volumeHebdomadaireController.validationResult, volumeHebdomadaireController.addVolumeHebdomadaire);

app.post('/volumes-hebdomadaires/create/:module/nbsemaine/:semaineDeb/:semaineFin', utilisateurController.verifToken,volumeHebdomadaireController.validationResult, volumeHebdomadaireController.addVolumesHebdomadaires);

app.post('/volumes-hebdomadaires/copy/:id/parent/:parent', utilisateurController.verifToken, volumeHebdomadaireController.copyVolumeHebdomadaire);

app.patch('/volumes-hebdomadaires/edit/:id', utilisateurController.verifToken, volumeHebdomadaireController.validationResult, volumeHebdomadaireController.editVolumeHebdomadaire);

app.patch('/volumes-hebdomadaires/edit/:value/elements/:id/:type', utilisateurController.verifToken,volumeHebdomadaireController.validationResult, volumeHebdomadaireController.editTypeValueElementVolumeHebdomadaire);

app.delete('/volumes-hebdomadaires/semestre/:id/nbsemaine/:semaineDeb/:semaineFin/delete', utilisateurController.verifToken, volumeHebdomadaireController.deleteAllVolumesHebdomadairesBySemaine);

app.delete('/volumes-hebdomadaires/formation/delete/:id', utilisateurController.verifToken, volumeHebdomadaireController.deleteAllVolumesHebdomadairesByFormation);

app.delete('/volumes-hebdomadaires/delete/element/:element', utilisateurController.verifToken, volumeHebdomadaireController.deleteAllVolumesHebdomadaires);

app.delete('/volumes-hebdomadaires/delete/:id', utilisateurController.verifToken, volumeHebdomadaireController.deleteVolumeHebdomadaire);


app.get('/volumes-globaux/get', utilisateurController.verifToken, volumeGlobaleController.getAllVolumeGlobales);

app.get('/volumes-globaux/get/:id', utilisateurController.verifToken, volumeGlobaleController.getVolumeGlobale);

app.post('/volumes-globaux/create', utilisateurController.verifToken,volumeGlobaleController.validationResult, volumeGlobaleController.addVolumeGlobale);

app.post('/volumes-globaux/module/:module/intervenant/:intervenant/create', utilisateurController.verifToken,volumeGlobaleController.validationResult, volumeGlobaleController.addVolumeGlobaleByModule);

app.post('/volumes-globaux/copy/:id', utilisateurController.verifToken, volumeGlobaleController.copyVolumeGlobale);

app.patch('/volumes-globaux/edit/:id', utilisateurController.verifToken, volumeGlobaleController.validationResult, volumeGlobaleController.editVolumeGlobale);

app.patch('/volumes-globaux/edit/:value/elements/:id/:type', utilisateurController.verifToken,volumeGlobaleController.validationResult, volumeGlobaleController.editTypeValueElementVolumesGlobaux);

app.delete('/volumes-globaux/formation/delete/:id', utilisateurController.verifToken, volumeGlobaleController.deleteAllVolumesGlobauxByFormation);

app.delete('/volumes-globaux/delete/element/:element/intervenant/:intervenant', utilisateurController.verifToken, volumeGlobaleController.deleteAllVolumesGlobaux);

app.delete('/volumes-globaux/delete/:id', utilisateurController.verifToken, volumeGlobaleController.deleteVolumeGlobale);


app.get('/groupes-intervenants/get', utilisateurController.verifToken, groupeIntervenantController.getAllGroupeIntervenants);

app.get('/groupes-intervenants/get/:id', utilisateurController.verifToken, groupeIntervenantController.getGroupeIntervenant);

app.get('/groupes-intervenants/module/get', utilisateurController.verifToken, groupeIntervenantController.getAllGroupeIntervenantByModule);

app.get('/groupes-intervenants/module/get/:id', utilisateurController.verifToken, groupeIntervenantController.getGroupeIntervenantByModule);

app.post('/groupes-intervenants/create/', utilisateurController.verifToken,groupeIntervenantController.validationResult, groupeIntervenantController.addGroupeIntervenant);

app.post('/groupes-intervenants/create/module/:module/intervenant/:intervenant/nbsemaine/:semaineDeb/:semaineFin', utilisateurController.verifToken,groupeIntervenantController.validationResult, groupeIntervenantController.addGroupesIntervenants);

app.post('/groupes-intervenants/copy/:id/parent/:parent/enseignant/:enseignant/projet/:projet', utilisateurController.verifToken, groupeIntervenantController.copyGroupeIntervenant);

app.patch('/groupes-intervenants/edit/:id', utilisateurController.verifToken, groupeIntervenantController.validationResult, groupeIntervenantController.editGroupeIntervenant);

app.patch('/groupes-intervenants/edit/:value/elements/:id/:type/intervenant/:intervenant', utilisateurController.verifToken,groupeIntervenantController.validationResult, groupeIntervenantController.editTypeValueElementGroupeIntervenant);

app.delete('/groupes-intervenants/semestre/:id/nbsemaine/:semaineDeb/:semaineFin/delete', utilisateurController.verifToken, groupeIntervenantController.deleteAllGroupesIntervenantsBySemaine);

app.delete('/groupes-intervenants/formation/delete/:id', utilisateurController.verifToken, groupeIntervenantController.deleteAllGroupesIntervenantsByFormation);

app.delete('/groupes-intervenants/delete/element/:element/intervenant/:intervenant', utilisateurController.verifToken, groupeIntervenantController.deleteAllGroupesIntervenants);

app.delete('/groupes-intervenants/delete/:id', utilisateurController.verifToken, groupeIntervenantController.deleteGroupeIntervenant);


app.get('/bilan/general/projets/get/:id', utilisateurController.verifToken, bilanController.getAllBilanByProjetIntervenant);

app.get('/bilan/sous-total/projets/get/:id', utilisateurController.verifToken, bilanController.getAllBilanSousTotal);

app.get('/bilan/groupe-sous-total/limite/get/:id', utilisateurController.verifToken, bilanController.getAllGroupeSousTotalByIdLimite);

app.get('/bilan/limite-sous-total/projet/get/:id', utilisateurController.verifToken, bilanController.getAllLimiteSousTotalByProjet);

app.get('/bilan/limite-sous-total/nom/:nom/projet/get/:id', utilisateurController.verifToken, bilanController.getAllLimiteSousTotalByProjetAndName);

app.get('/bilan/groupe-sous-total/element/:element/projet/get/:id', utilisateurController.verifToken, bilanController.getAllGroupeSousTotalByProjetAndElement);

app.post('/bilan/limite/create/', utilisateurController.verifToken,bilanController.validationResult, bilanController.addLimite);

app.post('/bilan/limite-sous-total/create/', utilisateurController.verifToken,bilanController.validationResult, bilanController.addLimiteSousTotal);

app.post('/bilan/groupe-sous-total/create/', utilisateurController.verifToken,bilanController.validationResult, bilanController.addGroupeSousTotal);

app.post('/bilan/limite-sous-total/copy/:id/projet/:projet', utilisateurController.verifToken,bilanController.validationResult, bilanController.copyLimiteSousTotal);

app.post('/bilan/groupe-sous-total/copy/:id/limite/:limite', utilisateurController.verifToken, bilanController.copyGroupeSousTotalByLimite);

app.post('/bilan/limite-statut/copy/:id/limite/:newLimite', utilisateurController.verifToken, bilanController.copyLimiteStatut);

app.patch('/bilan/limite/edit/:id', utilisateurController.verifToken,bilanController.validationResult, bilanController.editLimite);

app.patch('/bilan/limite-sous-total/edit/:id', utilisateurController.verifToken,bilanController.validationResult, bilanController.editLimiteSousTotal);

app.patch('/bilan/limite-statut/edit/statut/:statut/limite/:limite', utilisateurController.verifToken,bilanController.validationResult, bilanController.editLimiteStatut);

app.delete('/bilan/groupe-sous-total/delete/:id', utilisateurController.verifToken, bilanController.deleteGroupeSousTotal);

app.delete('/bilan/limite-sous-total/delete/:id', utilisateurController.verifToken, bilanController.deleteLimiteSousTotal);


app.post('/inscription',utilisateurController.validationResult, utilisateurController.addUtilisateur);

app.post('/connexion',utilisateurController.validationResult, utilisateurController.connexion);


utilisateurController

app.listen(port, () => {
    console.log(`Écoute sur le port : ${port}`);
});
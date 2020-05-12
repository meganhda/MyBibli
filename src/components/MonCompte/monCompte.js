import React from "react";
import './monCompte.css';
import { MDBTableBody, MDBTable, MDBBtn } from "mdbreact";
import axios from 'axios';
import { Redirect} from 'react-router';


class MyAccount extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            noSession: false,//booleen qui permet de verifier si la session de l'utilisateur est active, initialisé a "faux"
            informations: [],//va contenir les informations de l'utilisateur
            loading: true,//booleen initialisé comme vrai, qui va changer lors de la récupération des données
            error:'',//va contenir l'erreur en cas d'erreur
            firstName: undefined,//va contenir la nouvelle valeur du prenom entrée pour le champs "prenom"
            lastName:undefined,//va contenir la nouvelle valeur du nom entrée pour le champs "nom"
        }
        this.checkSession = this.checkSession.bind(this);
    }

    //Vérifie que la session est active
    checkSession () {
        axios.get("http://localhost:8888/API/Session/session.php", {withCredentials: true})

        .then(function(response){
        console.log(response);
        })

        .catch((error) => {
        if(error.response && error.response.status=== 404){
            this.setState({noSession: true});//s'il n'y a pas de session active, change la valeur du booleen comme "vrai"
            console.log(error);
        }
        });
    }

    //methode qui permet d'attribuer à "firstName" la valeur entrée au clavier par l'utilisateur
    handleChangeFirstName = (event) => {
        this.setState({
            firstName: event.target.value
        })
    }

    //methode qui permet d'attribuer à "lastName" la valeur entrée au clavier par l'utilisateur
    handleChangeLastName = (event) => {
        this.setState({
            lastName: event.target.value
        })
    }

    //methode qui permet d'envoyer les données au fichier PHP "modifier_firstname.php" afin d'enregistrer la nouvelle donnée, lorque l'utilisateur appuie sur le bouton "modifier" a cote du prenom
    handleSubmitFirstName = (firstName) => e => {
        let formData = new FormData();
        formData.append("firstname",firstName);
        const url = "http://localhost:8888/API/MonCompte/modifier_firstname.php"
        axios.post(url, formData, {withCredentials: true})
        
        //succes modification prénom
        .then(function(response){
          console.log(response.status, response)
          alert('Modification du prénom enregistrée');
        })
    
        //echec modification prénom
        .catch((error)=>{
          console.log(error)
          if (error.response && error.response.status === 403){
            console.log(error);
            alert('Echec modification');
          }
        });
    
        setTimeout(() => {
          this.setState({
            error: '',
          });
        }, 2000);
              
        e.preventDefault();
      }

      //methode qui permet d'envoyer les données au fichier PHP "modifier_lastname.php" afin d'enregistrer la nouvelle donnée, lorque l'utilisateur appuie sur le bouton "modifier" a cote du nom
      handleSubmitLastName = (lastName) => e => {
        let formData = new FormData();
        formData.append("lastname",lastName);
        const url = "http://localhost:8888/API/MonCompte/modifier_lastname.php"
        axios.post(url, formData, {withCredentials: true})
        
        //succes modification nom
        .then(function(response){
          console.log(response.status, response)
          alert('Modification du nom enregistrée');
        })
    
        //echec modification nom
        .catch((error)=>{
          console.log(error)
          if (error.response && error.response.status === 403){
            console.log(error);
            alert('Echec modification');
          }
        });
    
        setTimeout(() => {
          this.setState({
            error: '',
          });
        }, 2000);
              
        e.preventDefault();
      }
      

      //methode qui permet de récuperer les linformations de l'utilisateur via le fichier "mon_compte.php"     
    async componentDidMount() {
        const url = "http://localhost:8888/API/MonCompte/mon_compte.php";
        const response = await fetch(url,{credentials: 'include'});
        const data = await response.json();
        this.setState({
            informations: data.results.profile[0], //"informations" contient les données reçues par le back-end 
            loading: false //booleen "loading" changé comme "faux"
        })
        console.log(data.results.profile);
    }

    render() {
        const { firstName, lastName, informations } = this.state;
        const {noSession} = this.state;

        //appel à la methode qui verifie la session
        this.checkSession ();

        //s'il n'y a pas de session active, redirection vers la page de connexion
        if(noSession){
          return <Redirect to="/"/>;
        }

        //si le temps de récupération des données a afficher est long
        if(this.state.loading){
            return <div>chargement...</div>;
        }

        //affichage des informations de l'utilisateur
        //affichage des champs a remplir si l'utilisateur veut modifier ses donnees
        //affichage des boutons "modifier"
        return(
            <div>
                <h1 className = "titleMyAccount">Mes informations personnelles</h1>
                <MDBTable hover bordered maxHeight="350px">
                    <MDBTableBody>  
                        <tr>
                            <td>Adresse email : {informations.email}</td>
                        </tr>
                        <tr>
                            <td>Prénom : 
                              <br></br>
                                <input className="inputModif" value={firstName} defaultValue={informations.firstname} onChange={e => this.handleChangeFirstName(e)}/>          
                            <MDBBtn color="dark" onClick={this.handleSubmitFirstName(this.state.firstName)}>Modifier</MDBBtn>
                            </td>   
                        </tr>
                        <tr>
                            <td>Nom : 
                              <br></br>
                                <input className="inputModif" value={lastName} defaultValue={informations.lastname} onChange={e => this.handleChangeLastName(e)}/>         
                            <MDBBtn color="dark" onClick={this.handleSubmitLastName(this.state.lastName)}>Modifier</MDBBtn></td>
                        </tr>
                    </MDBTableBody>
            </MDBTable>
            </div>
        )
    }   
}

export default MyAccount;
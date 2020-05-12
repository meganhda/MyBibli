import React, {Component} from 'react';
import "./historique.css";
import { MDBTableBody, MDBTableHead, MDBTable } from "mdbreact";
import axios from 'axios';
import { Redirect} from 'react-router';

class Historic extends Component{

    constructor(props){
        super(props);
        this.state = {
            noSession: false,//booleen qui permet de verifier si la session de l'utilisateur est active, initialisé a "faux"
            loading: true,//booleen initialisé comme vrai, qui va changer lors de la récupération des données
            historic: [],//va contenir les anciens prêts
            error: '',//va contenir l'erreur en cas d'erreur
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

    //methode qui permet de récupérer les anciens prêts effectués via le fichier "liste_historique.php"
    async componentDidMount() {
        const url = "http://localhost:8888/API/MesLivres/liste_historique.php";
        const response = await fetch(url,{credentials: 'include'});
        const data = await response.json();
        this.setState({historic: data.results.livres, loading: false})//"historic" contient les données reçues par le back-end
        console.log(data.results.livres);
      }


    render() {

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

        //s'il n'y a pas de prêt déjà enregistré dans la base de données
        if (this.state.historic.length === 0){
            return (
              <div>
                <h1 className="titleMyHistoric"> Mon historique des prêts </h1>
                <div className="noHistoric">
                  Aucun prêt effectué.
                </div>
              </div>  
            );
        } 

        //affichage d'un tableau avec les prêts déja effectués, grâce a la fonction map qui va parcourir "historic"
        return(
            <div> 

                <h1 className="titleMyHistoric"> Mon historique des prêts </h1>

                <br></br>

                <MDBTable hover bordered scrollY maxHeight="400px">
                    <MDBTableHead>
                    <tr>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Emprunteur</th>
                    <th>Date d'emprunt</th>
                    <th>Date de rendu</th>
                    </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                    {
                        this.state.historic.map(livre => (
                        <tr key={livre.id} >
                            <td>{livre.title}</td>
                            <td>{livre.author}</td>
                            <td>{livre.borrower}</td>
                            <td>{livre.date1}</td>
                            <td>{livre.date2}</td>
                        </tr>
                        ))
                    }
                    </MDBTableBody>
                </MDBTable>

            </div>
        );
    }
}
        
 export default Historic;
        
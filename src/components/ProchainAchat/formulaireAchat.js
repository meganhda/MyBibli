/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Redirect} from 'react-router';
import './formulaireAchat.css';
import {
  MDBContainer, MDBRow, MDBCard, MDBCardBody,
} from 'mdbreact';
import axios from 'axios';

class NextPurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noSession: false,//booleen qui permet de verifier si la session de l'utilisateur est active, initialisé a "faux"
      title: null,//va contenir la valeur entrée pour le champs "titre" du formulaire
      author: null,//va contenir la valeur entrée pour le champs "auteur" du formulaire
      registeredPurchase: false,//initialise le statut de redirection comme faux
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

  //methode qui permet d'attribuer à "title" et "author" les valeurs entrées au clavier par l'utilisateur
  change = async e => {
    await this.setState({
      [e.target.id]: e.target.value,
    });
  }

  //methode qui permet d'envoyer les données au fichier PHP "ajout_prochain_achat.php" afin d'enregistrer le nouvel achat, lorque l'utilisateur appuie sur le bouton "valider"
  handleSubmitPurchase = e => {

    const {
      title, author,
    } = this.state;

    //cas ou tous les champs sont remplis
    if (title && author) {

        
        console.log(this.state);
        let formData = new FormData();
        formData.append("title",this.state.title);
        formData.append("author",this.state.author);
        const url = "http://localhost:8888/API/AjouterAchat/ajout_prochain_achat.php";
        axios.post(url,formData, {withCredentials: true})

        //succes enregistrer prochain achat
        .then(function(response){
          this.setState({registeredPurchase:true});
          console.log(response);
          alert('Livre enregistré dans vos prochains achats');
        }.bind(this))

        //echec enregistrer prochain achat
        .catch((error) => {
          if (error.response && error.response.status === 403){
            console.log(error);
            alert('Erreur: Ce livre existe déjà dans votre bibliothèque !');
          }
        }); 

        
    } else {
      //cas ou les champs ne sont pas remplis
      this.setState({
        error: 'Veuillez saisir tous les champs !',
      });
    }
    setTimeout(() => {
      this.setState({
        error: '',
      });
    }, 2000);
          
    e.preventDefault();
  }

  render() {
    const { error } = this.state;
    const container = {height: 800};
    const {registeredPurchase} = this.state;
    const {noSession} = this.state;

    //appel à la methode qui verifie la session
    this.checkSession ();

    //s'il n'y a pas de session active, redirection vers la page de connexion
    if(noSession){
      return <Redirect to="/"/>;
    }
    
    //redirection vers la page des prochains achats si le prochain achat a été enregistré correctement
    if(registeredPurchase){
      return <Redirect to="/prochainAchat"/>;
    }

    //affichage du formulaire de prochaina achat a completer par l'utilisateur
    //affichage du bouton "valider" en fin de formulaire
    return (
      <MDBContainer style={container} className="containerAchat">
        <MDBRow>
          <div className="colAchat">
            <MDBCard>
              <MDBCardBody>
                <form onSubmit={this.handleSubmitPurchase} className="form">
                  <div className="text-center">
                    <h2 className="dark-grey-text mb-5">
                      Ajouter un prochain achat
                    </h2>
                  </div>
                  <div className="grey-text">
                    <label htmlFor="title" className="grey-text">
                      Titre
                    </label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Titre"
                      className="form-control"
                      onChange={this.change}
                      required
                    />

                    <br />

                    <label htmlFor="author" className="grey-text">
                      Auteur
                    </label>
                    <input
                      type="text"
                      id="author"
                      placeholder="Auteur"
                      className="form-control"
                      onChange={this.change}
                      required
                    />

                  </div>
                  <div className="text-center py-4 mt-3">
                    <button className="btn btn-primary" onClick={this.handleSubmitPurchase} type="submit">Valider</button>
                    {
                     error && (
                     <p className="error">{error}</p>
                     )
                    }
                  </div>

                </form>

              </MDBCardBody>
            </MDBCard>
          </div>
        </MDBRow>
      </MDBContainer>

    );
  }
}

export default NextPurchase;

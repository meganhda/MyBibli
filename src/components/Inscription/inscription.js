/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import './inscription.css';



import {
  MDBContainer, MDBRow, MDBCard, MDBCardBody,
} from 'mdbreact';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastname: null,//va contenir la valeur entrée pour le champs "nom" du formulaire
      firstname: null,//va contenir la valeur entrée pour le champs "prenom" du formulaire
      password: null,//va contenir la valeur entrée pour le champs "mot de passe" du formulaire
      passwordBis: null,//va contenir la valeur entrée pour le champs "mot de passe de confirmation" du formulaire
      email: null,//va contenir la valeur entrée pour le champs "adresse mail" du formulaire
      isSignedUp: false, //initialise le statut d'inscription comme faux
      error: '',//va contenir l'erreur en cas d'erreur

    };
  }

  //methode qui permet d'attribuer à "lastname", "firstname", "password", "passwordBis" et "email" les valeurs entrées au clavier par l'utilisateur
  change = async e => {
    await this.setState({
      [e.target.id]: e.target.value,
    });
  }

  //methode qui permet d'envoyer les données au fichier PHP "inscription_back.php" afin de verifier l'inscription de l'utilisateur, lorque celui-ci appuie sur le bouton "valider"
  handleSubmitSignUp = e => {
    const {
      lastname, firstname, email, password, passwordBis,
    } = this.state;

    //cas ou tous les champs sont remplis
    if (lastname && firstname && password && email && passwordBis)
    {
      //verification que tous les champs soient correctement remplis

      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        this.setState({
          error: 'Veuillez saisir une adresse mail valide !',
        });
      } else if (password.length < 6) {
        this.setState({
          error: 'Veuillez saisir un mot de passe avec au moins 6 caractères !',
        });
      } else if (password !== passwordBis) {
        this.setState({
          error: 'Le mot de passe de confirmation ne correspond pas !',
        });
      } 
      else
      //si tous les champs sont correctement remplis
      {
        console.log(this.state);
        let formData = new FormData();
        formData.append("firstname",this.state.firstname);
        formData.append("lastname",this.state.lastname);
        formData.append("email",this.state.email);
        formData.append("password",this.state.password);
        const url = "http://localhost:8888/API/inscription/inscription_back.php";
        axios.post(url,formData)

        //succès inscription
        .then(function(response) {  
          this.setState({isSignedUp: true});//change le statut d'inscrption comme vrai, redirection dans le render
          console.log("inscription réussie", response);
          alert('Formulaire validé');
        }.bind(this))

        //echec inscription
        .catch((error) => {
          if (error.response && error.response.status === 403){
            this.setState({
            error: 'L’adresse e-mail '+email+' est déjà prise.',
            });
          }
          console.log("formulaire non valide", error);
        }); 
      }
    }
    else 
    {
      //cas ou tous les champs ne sont pas remplis
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
    const container = {height: 750};
    const {isSignedUp} = this.state;

    if (isSignedUp){
      //redirection vers la page de connexion
      return <Redirect to="/"/>;
    }

    //affichage du formulaire d'inscription a completer par l'utilisateur
    return (
      <MDBContainer style={container} className="containerInscription">
        <MDBRow>
          <div className="colInscription">
            <MDBCard>
              <MDBCardBody>
                <form onSubmit={this.handleSubmitSignUp} className="form">
                  <div className="text-center">
                    <h2 className="dark-grey-text mb-5">
                      Inscription
                    </h2>
                  </div>
                  <div className="grey-text">
                    <label htmlFor="lastName" className="grey-text">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      placeholder="Nom"
                      className="form-control"
                      onChange={this.change}
                      required
                    />

                    <br />

                    <label htmlFor="firstname" className="grey-text">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      placeholder="Prénom"
                      className="form-control"
                      onChange={this.change}
                      required
                    />

                    <br />

                    <label htmlFor="email" className="grey-text">
                      Adresse mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="mail@exemple.com"
                      onChange={this.change}
                      required
                    />

                    <br />
                    <label htmlFor="password" className="grey-text">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={this.change}
                      className="form-control"
                      placeholder="Veuillez saisir un mot de passe"
                      required
                    />

                    <br />
                    <label htmlFor="passwordBis" className="grey-text">
                      Mot de passe de confirmation
                    </label>
                    <input
                      type="password"
                      id="passwordBis"
                      className="form-control"
                      placeholder="Veuillez confirmer votre mot de passe"
                      onChange={this.change}
                      required
                    />


                  </div>
                  <div className="text-center py-4 mt-3">
                    <button className="btn btn-primary" onClick={this.handleSubmitSignUp} type="submit">S&apos;inscrire</button>
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

export default SignUp;

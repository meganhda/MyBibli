import React from 'react';

import { Link } from 'react-router-dom';
import { Redirect} from 'react-router';
import {
  MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBModalFooter,
} from 'mdbreact';
import './connexion.css';
import axios from 'axios';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,//va contenir la valeur entrée pour le champs "mot de passe" du formulaire
      email: null,//va contenir la valeur entrée pour le champs "adresse mail" du formulaire
      loggedIn: false, //initialise le statut de connexion comme faux
      error: '',//va contenir l'erreur en cas d'erreur

    };
  }

  //methode qui permet d'attribuer à "email" et "password" les valeurs entrées au clavier par l'utilisateur
  change = async e => {
    await this.setState({
      [e.target.id]: e.target.value,
    });
  }

  //methode qui permet d'envoyer les données au fichier PHP "login.php" afin de verifier l'identification de l'utilisateur, lorque celui-ci appuie sur le bouton "valider"
  handleSubmitLogIn = e => {
    const { email, password } = this.state;

    //cas ou tous les champs sont remplis
    if (password && email) {
      
      console.log(this.state);
      let formData = new FormData();
      formData.append("email",this.state.email);
      formData.append("password",this.state.password);
      const url = "http://localhost:8888/API/Connexion/login.php";
      axios.post(url, formData, {withCredentials: true})

      //succès connexion
      .then(function(response) {  
        this.setState({loggedIn: true});//si la connexion marche, change le statut de connexion comme vrai, redirection dans le render
        console.log("connexion réussie - email et mot de passe valides", response);
      }.bind(this))

      //echec connexion
      .catch((error) => {
        if(error.response && error.response.status === 403){
          this.setState({
            error: error.response.data,
            });
        }
        console.log("login non réussi");

      });


    } else {
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
    const {loggedIn } = this.state;

    if(loggedIn){
      //redirection vers la page d'acceuil si la connexion est réussie
      return <Redirect to="/accueil"/>;
    }
  
    //affichage du formulaire de connexion a completer par l'utilisateur
    return (
      <div>
        <h1 className="myBibli">MyBibli</h1>
        <MDBContainer className="containerConnexion">
          <MDBRow>
            <MDBCard>
              <MDBCardBody className="mx-4">
                <form onSubmit={this.handleSubmitLogIn}>
                  <div className="text-center">
                    <h2 className="dark-grey-text mb-5">
                      Connexion
                    </h2>
                  </div>
                  <label htmlFor="email" className="grey-text">
                    Adresse mail
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      onChange={this.change}
                    />
                  </label>

                  <br />
                  <label htmlFor="password" className="grey-text">
                    Mot de passe
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      onChange={this.change}
                    />
                  </label>

                  <p className="font-small blue-text d-flex justify-content-end pb-3">

                  </p>
                  <div className="text-center mb-3">
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmitLogIn}>Se connecter</button>
                    {
                     error && (
                     <p className="error">{error}</p>
                     )
                    }
                  </div>
                  <p className="font-small dark-grey-text text-right d-flex justify-content-center mb-3 pt-2" />
                </form>
              </MDBCardBody>
              <MDBModalFooter className="mx-5 pt-3 mb-1">
                <p className="font-small grey-text d-flex justify-content-end">
                    
                  <Link to="/inscription" className="blue-text ml-1">
                    S&apos;inscrire
                  </Link>
                </p>


              </MDBModalFooter>
            </MDBCard>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default Login;

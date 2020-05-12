/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import './ajoutLivre.css';
import axios from 'axios';
import { Redirect} from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  



import {
  MDBContainer, MDBRow, MDBCard, MDBCardBody,
} from 'mdbreact';

class AddBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noSession: false,//booleen qui permet de verifier si la session de l'utilisateur est active, initialisé a "faux"
      title: null,//va contenir la valeur entrée pour le champs "titre" du formulaire
      author: null,//va contenir la valeur entrée pour le champs "auteur" du formulaire
      year: null,//va contenir la valeur entrée pour le champs "année de sortie" du formulaire
      date: null,//va contenir la valeur entrée pour le champs "date d'achat" du formulaire
      edition: null,//va contenir la valeur entrée pour le champs "edition" du formulaire
      typeBook: null,//va contenir la valeur entrée pour le champs "type" du formulaire
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

  //methode qui permet d'attribuer à "title", "author", "year", "date", "edition" et "typeBook" les valeurs entrées au clavier par l'utilisateur
  change = async e => {
    await this.setState({
      [e.target.id]: e.target.value,
    });
  }

//methode qui permet d'envoyer les données au fichier PHP "ajout_livre_back.php" afin d'enregistrer le livre, lorque l'utilisateur appuie sur le bouton "valider"
  handleSubmitBook = e => {

    const {
      title, author, year, date, edition, typeBook,
    } = this.state;

    if (title && author && year && date && edition && typeBook ) {

        
        console.log(this.state);
        let formData = new FormData();
        formData.append("title",this.state.title);
        formData.append("author",this.state.author);
        formData.append("year",this.state.year);
        formData.append("date",this.state.date);
        formData.append("edition",this.state.edition);
        formData.append("typeBook",this.state.typeBook);
        const url = "http://localhost:8888/API/AjouterLivre/ajout_livre_back.php";
        axios.post(url,formData, {withCredentials: true})

        //succès ajout livre
        .then(function(response){
          console.log(response);
          toast.success(' Livre ajouté à votre bibliothèque', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
          
          })
        
        //echec ajout livre
        .catch((error) => {
          if (error.response && error.response.status === 403){
            console.log(error);
            toast.warn('Attention : ce livre existe déjà dans votre bibliothèque', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              });
            
          }
        }); 

        
    } else {
      //cas ou les champs ne sont pas correctement remplis
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
    const container = {height: 1000};
    const {noSession} = this.state;
    

    //appel à la methode qui verifie la session
    this.checkSession ();

     //s'il n'y a pas de session active, redirection vers la page de connexion
     if(noSession){
      return <Redirect to="/"/>;
    }

    return (
      <MDBContainer style={container} className="containerInscription">
        <MDBRow>
          <div className="colInscription">
            <MDBCard>
              <MDBCardBody>
                <form onSubmit={this.handleSubmitBook} className="form">
                  <div className="text-center">
                    <h2 className="dark-grey-text mb-5">
                      Ajouter un livre
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

                    <br />

                    <label htmlFor="year" className="grey-text">
                      Année de sortie
                    </label>
                    <input
                      type="number"
                      id="year"
                      className="form-control"
                      placeholder="Année"
                      onChange={this.change}
                      required
                    />

                    <br />

                    <label htmlFor="date" className="grey-text">
                      Date d&apos;achat
                    </label>
                    <input
                      type="date"
                      id="date"
                      placeholder="jj/mm/aa"
                      className="form-control"
                      onChange={this.change}
                      required
                    />

                    <br />

                    <label htmlFor="edition" className="grey-text">
                      Edition
                    </label>
                    <input
                      type="text"
                      id="edition"
                      placeholder="Edition"
                      className="form-control"
                      onChange={this.change}
                      required
                    />

                    <br />

                    <label htmlFor="typeBook" className="grey-text">
                      Type
                    </label>
                    <input
                      type="text"
                      id="typeBook"
                      placeholder="Type"
                      className="form-control"
                      onChange={this.change}
                      required
                    />


                  </div>
                  <div className="text-center py-4 mt-3">
                    <button className="btn btn-primary" onClick={this.handleSubmitBook} type="submit">Valider</button>
                    <ToastContainer />
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

export default AddBook;
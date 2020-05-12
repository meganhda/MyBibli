import React from 'react';
import { MDBTable, MDBTableBody, MDBTableHead, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody,MDBModalFooter, } from 'mdbreact';
import './mesLivres.css';
import axios from 'axios';
import { Redirect} from 'react-router';

class MyBooks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      noSession: false,//booleen qui permet de verifier si la session de l'utilisateur est active, initialisé a "faux"
      loading: true,//booleen initialisé comme vrai, qui va changer lors de la récupération des données
      books: [],//va contenir les livres de l'utilisateur
      modal: false,//booleen qui va permettre d'ouvrir/fermer une fenetre lorsque l'utilisateur appuie sur "modifier"
      title: '',//va contenir la valeur entrée pour le champs "titre" du formulaire de modification
      author: '',//va contenir la valeur entrée pour le champs "auteur" du formulaire de modification
      year: '',//va contenir la valeur entrée pour le champs "année de sortie" du formulaire de modification
      date: '',//va contenir la valeur entrée pour le champs "date d'achat" du formulaire de modification
      edition: '',//va contenir la valeur entrée pour le champs "edition" du formulaire de modification
      typeBook: '',//va contenir la valeur entrée pour le champs "type" du formulaire de modification
      id: '',//va contenir l'id du livre selectionné par l'utilisateur lorsqu'il appuiera sur les boutons "modifier"/"supprimer"
      error: '',//va contenir l'erreur en cas d'erreur
      idBook: null,//va contenir l'id du livre a modifier
    }
    this.checkSession = this.checkSession.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.editBook = this.editBook.bind(this);
    this.openModalBook = this.openModalBook.bind(this);
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

  //methode qui permet d'ouvrir une fenetre contenant un formulaire pré-rempli des informations du livre selectionné par l'utilisateur, lorsque celui-ci appuie sur "modifier"
  openModalBook = (id, title, author, year, date, edition, typeBook) => e => {
    this.setState({
      modal: true,
      idBook: id,
      title: title,
      author: author,
      year: year,
      date: date,
      edition: edition,
      typeBook: typeBook
    });
  }

  //methode qui permet de fermer la fenetre de modification, lorsque l'utilisateur appuie sur "annuler"
  closeModalBook = () => {
  this.setState({
    modal: false,
    });
  }

  //methode qui permet d'attribuer à "title", "author", "year", "date", "edition" et "typeBook" les nouvelles valeurs entrées au clavier par l'utilisateur lors de la modification d'un livre
  change = e => {
    this.setState ({
      [e.target.name]: e.target.value
    });
  };

  //methode qui permet d'envoyer les données au fichier PHP "modif_livre.php" afin d'enregistrer les nouvelles donnees d'un livre, lorque l'utilisateur appuie sur le bouton "enregistrer" de la fenetre de modification
  editBook = (title, author, year, date, edition, typeBook) => e => {
    const { idBook, books } = this.state;
    let newBooks = books;
    console.log(idBook,'idBookSubmit');
    this.setState({
      modal: false,
    })
    let formData = new FormData();
    formData.append("id",idBook);
    formData.append("title",title);
    formData.append("author",author);
    formData.append("year",year);
    formData.append("date",date);
    formData.append("edition",edition);
    formData.append("typeBook",typeBook);
    const url = "http://localhost:8888/API/MesLivres/modif_livre.php"
    axios.post(url, formData, {withCredentials: true})
    
    //succes modification livre
    .then(function(response){
      console.log(response.status, response)
      alert('Modifications enregistrées, veuillez recharger la page');
      const tmp = books;
      newBooks = tmp.filter(livre => livre.id !== idBook);
    })

    //echec modification livre
    .catch((error)=>{
      console.log(error)
      if (error.response && error.response.status === 403){
        console.log(error);
        alert('Echec modification');
      }
    });
    
    setTimeout(() => {
      this.setState({
        books: newBooks
      })
    }, 500);

    setTimeout(() => {
      this.setState({
        error: '',
      });
    }, 2000);
          
    e.preventDefault();
  }

  //methode qui permet d'envoyer au fichier PHP "supprimer_livre.php" l'id du livre a supprimer, lorsque l'utilisateur appuie sur le bouton "supprimer"
  handleDelete = (id) => e => {
    const { books } = this.state;
    let newBooks = books;
    let formData = new FormData();
    formData.append("id",id);
    const url = "http://localhost:8888/API/MesLivres/supprimer_livre.php"
    axios.post(url, formData, {withCredentials: true})
    
    //succes suppression livre
    .then(function(response){
      console.log(response);
      const tmp = books;
      newBooks = tmp.filter(livre => livre.id !== id);
      alert('Livre supprimé de votre bibliothèque');
    })

    //echec suppression livre
    .catch((error)=>{
      console.log(error)
      if (error.response.status === 403){
        console.log(error);
        alert('Echec de la suppression');
      }
    });

    setTimeout(() => {
      this.setState({
        books: newBooks
      })
    }, 500);
    

    setTimeout(() => {
      this.setState({
        error: '',
      });
    }, 2000);
          
    e.preventDefault();
  }


  //methode qui permet de récuperer les livres de l'utilisateur via le fichier "liste_livres.php"
  async componentDidMount() {
    const url = "http://localhost:8888/API/MesLivres/liste_livres.php";

    const response = await fetch(url,{credentials: 'include'});
    const data = await response.json();
    this.setState({books: data.results.livres, loading: false})//"books" contient les données reçues par le back-end et booleen "loading" changé comme "faux"
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

    //si l'utilisateur n'a pas de livres deja ajoutés a sa bibliotheque
    if (this.state.books.length === 0){
      return (
        <div>
          <h1 className="myBibli"> Mes livres </h1>
          <div className="noBook">
            Vous n'avez actuellement aucun livre dans votre bibliothèque.
          </div>
        </div>
      );
    }

    //sinon:
    //affichage d'un tableau avec les livres de l'utilisateur, grâce a la fonction map qui va parcourir "books"
    //affichage des boutons "supprimer" et "modifier" sur chaque ligne du tableau
    //ouverture d'une fenetre avec le formulaire de modification 
    return (
      <div>
        <h1 className="myBibli"> Mes livres </h1>
        <br></br>
        <h2> Vous avez {this.state.books.length} livre(s) dans votre bibliothèque:</h2>
        <br></br>
        <MDBTable hover bordered scrollY maxHeight="400px">
          <MDBTableHead>
            <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Année de sortie</th>
            <th>Date d'achat</th>
            <th>Edition</th>
            <th>Type</th>
            <th>Statut</th>
            <th></th>
            <th></th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {
              this.state.books.map(livre => (
                <tr key={livre.id} >
                  <td>{livre.title}</td>
                  <td>{livre.author}</td>
                  <td>{livre.year}</td>
                  <td>{livre.date}</td>
                  <td>{livre.edition}</td>
                  <td>{livre.typeBook}</td>
                  <td>{livre.status}</td>
                  <td><MDBBtn onClick={this.openModalBook(livre.id, livre.title, livre.author, livre.year, livre.date, livre.edition, livre.typeBook)} color="dark">Modifier</MDBBtn>
                    <MDBModal isOpen={this.state.modal}>
                      <MDBModalHeader>Modifications du livre</MDBModalHeader>
                      <MDBModalBody>
                      <label htmlFor="title" className="grey-text">
                            Titre
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={this.state.title}
                            className="form-control"
                            onChange={e => this.change(e)}

                            />

                            <br/>

                            <label htmlFor="author" className="grey-text">
                            Auteur
                          </label>
                          <input
                            type="text"
                            name="author"
                            value={this.state.author}
                            className="form-control"
                            onChange={e => this.change(e)}

                            />

                            <br/>


                      <label htmlFor="year" className="grey-text">
                            Année de sortie
                          </label>
                          <input
                            type="number"
                            name="year" 
                            className="form-control"
                            value={this.state.year}
                            onChange={e => this.change(e)}
                            
                          />

                          <br />

                          <label htmlFor="date" className="grey-text">
                            Date d&apos;achat
                          </label>
                          <input
                            type="date"
                            name="date"
                            value={this.state.date}
                            className="form-control"
                            onChange={e => this.change(e)}
                            
                          />

                          <br />

                          <label htmlFor="edition" className="grey-text">
                            Edition
                          </label>
                          <input
                            type="text"
                            name="edition"
                            value={this.state.edition}
                            className="form-control"
                            onChange={e => this.change(e)}
                            
                          />

                          <br />

                          <label htmlFor="typeBook" className="grey-text">
                            Type
                          </label>
                          <input
                            type="text"
                            name="typeBook"
                            value={this.state.typeBook}
                            className="form-control"
                            onChange={e => this.change(e)}
                            
                          />
                      </MDBModalBody>
                      <MDBModalFooter>
                        <MDBBtn color="danger" onClick={this.closeModalBook}>Annuler</MDBBtn>
                        <MDBBtn onClick={this.editBook(this.state.title, this.state.author, this.state.year, this.state.date, this.state.edition, this.state.typeBook)} color="dark">Enregistrer</MDBBtn>
                      </MDBModalFooter>
                    </MDBModal>
                  
                  </td>
                  <td><MDBBtn onClick={this.handleDelete(livre.id)} color="danger">Supprimer</MDBBtn></td>
                </tr>
              ))
            }
          </MDBTableBody>
        </MDBTable>

      </div>
    );
  }
}

export default MyBooks;
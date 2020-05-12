import React, { Fragment } from "react";
import { MDBBtn, MDBTableBody, MDBTableHead, MDBTable, MDBModal, MDBModalHeader, MDBModalBody,MDBModalFooter,} from "mdbreact";
import './mesProchainsAchats.css';
import axios from 'axios';
import { Redirect} from 'react-router';


class NextPurchasePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      noSession: false,//booleen qui permet de verifier si la session de l'utilisateur est active, initialisé a "faux"
      loading: true,//booleen initialisé comme vrai, qui va changer lors de la récupération des données
      purchases: [],//va contenir les prochains achats de l'utilisateur
      year: '',//va contenir la valeur entrée pour le champs "année de sortie" du formulaire de validation d'achat
      date: '',//va contenir la valeur entrée pour le champs "date d'achat" du formulaire de validation d'achat
      edition: '',//va contenir la valeur entrée pour le champs "edition" du formulaire de validation d'achat
      typeBook: '',//va contenir la valeur entrée pour le champs "type" du formulaire de validation d'achat
      modal: false,//booleen qui va permettre d'ouvrir/fermer une fenetre lorsque l'utilisateur appuie sur "acheté"
      id: '',//va contenir l'id du livre selectionné par l'utilisateur lorsqu'il appuiera sur les boutons "acheté/supprimer"
      error: '',//va contenir l'erreur en cas d'erreur
      idPurchase: null,//va contenir l'id du livre acheté
    }
    this.checkSession = this.checkSession.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.buyBook = this.buyBook.bind(this);
    this.openModalBuy = this.openModalBuy.bind(this);
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

  //methode qui permet d'ouvrir une fenetre contenant un formulaire a completer par l'utilisateur, lorsque celui-ci appuie sur "acheté"
  openModalBuy = (id) => e => {
    this.setState({
      modal: true,
      idPurchase: id
    });
  }

  //methode qui permet de fermer la fenetre d'achat, lorsque l'utilisateur appuie sur "annuler"
  closeModalBuy = () => {
  this.setState({
    modal: false,
    });
  }

  //methode qui permet d'attribuer à "year", "date", "edition" et "typeBook" les nouvelles valeurs entrées au clavier par l'utilisateur lors de l'achat d'un livre
  change = e => {
    this.setState ({
      [e.target.name]: e.target.value
    });
  };

  //methode qui permet d'envoyer les données au fichier PHP "transfert_prochain_achat.php" afin d'enregistrer les donnees d'un livre, lorque l'utilisateur appuie sur le bouton "enregistrer" de la fenetre d'achat
  buyBook = (year, date, edition, typeBook) => e => {
    const { idPurchase, purchases } = this.state;
    let newBooks = purchases;
    console.log(idPurchase,'idPurchaseSubmit');
    this.setState({
      modal: false,
    })
    let formData = new FormData();
    formData.append("id",idPurchase);
    formData.append("year",year);
    formData.append("date",date);
    formData.append("edition",edition);
    formData.append("typeBook",typeBook);
    const url = "http://localhost:8888/API/MesProchainsAchats/transfert_prochain_achat.php"
    axios.post(url, formData, {withCredentials: true})
    
    //succes achat livre
    .then(function(response){
      console.log(response.status, response)
      alert('Livre transféré dans votre bibliothèque');
      const tmp = purchases;
      newBooks = tmp.filter(livre => livre.id !== idPurchase);
    })

  //echec achat livre
  .catch((error)=>{
    console.log(error)
    if (error.response && error.response.status === 403){
      console.log(error);
      alert(error.response.data);
    }
  });

  setTimeout(() => {
    this.setState({
      purchases: newBooks
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
  const { purchases } = this.state;
  let newBooks = purchases;
  let formData = new FormData();
  formData.append("id",id);
  const url = "http://localhost:8888/API/MesLivres/supprimer_livre.php"
  axios.post(url, formData, {withCredentials: true})
  
  .then(function(response){
    const tmp = purchases;
    newBooks = tmp.filter(livre => livre.id !== id);
    alert('Livre supprimé de vos prochains achats');
  })

  .catch((error)=>{
    console.log(error)
    if (error.response.status === 403){
      console.log(error);
      alert('Echec de la suppression');
    }
  });

  setTimeout(() => {
    this.setState({
      purchases: newBooks
    })
  }, 500);
  

  setTimeout(() => {
    this.setState({
      error: '',
    });
  }, 2000);
        
  e.preventDefault();
}


//methode qui permet de récuperer les prochains achats de l'utilisateur via le fichier "liste_achat.php"
async componentDidMount() {
    const url = "http://localhost:8888/API/MesProchainsAchats/liste_achat.php";
    const response = await fetch(url,{credentials: 'include'});
    const data = await response.json();
    this.setState({purchases: data.results.livres, loading: false})//"purchases" contient les données reçues par le back-end 
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

    //si l'utilisateur n'a pas de prochains achats prevus
    //affichage du bouton qui redirige vers le formulaire de prochain achat
    if (this.state.purchases.length === 0){
        return (
          <div>
            <h1 className="titleMyPurchases"> Mes prochains achats </h1>
            <div className="noPurchase">
              Vous n'avez actuellement aucun achat prévu.
            </div>
            <div className="buttonAchat">
                <Fragment>
                    <MDBBtn href="/formulaireProchainAchat" color="dark"> 
                      Ajouter un prochain achat
                    </MDBBtn>
                </Fragment>
            </div>
          </div>  
        );
    } 

  //sinon:
  //affichage d'un tableau avec les prochains achats de l'utilisateur, grâce a la fonction map qui va parcourir "purchases"
  //affichage des boutons "supprimer" et "acheté" sur chaque ligne du tableau
  //ouverture d'une fenetre avec le formulaire d'achat
  //affichage du bouton qui redirige vers le formulaire de prochain achat
    return (
        <div>
          <h1 className="titleMyPurchases"> Mes prochains achats </h1>
          <h2> Vous avez {this.state.purchases.length} prochain(s) achat(s) programmé(s):</h2>
          <br></br>
          <MDBTable hover bordered scrollY maxHeight="350px">
            <MDBTableHead>
              <tr>
              <th>Titre</th>
              <th>Auteur</th>
              <th></th>
              <th></th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {
                this.state.purchases.map(livre => (
                  <tr key={livre.id} onChange={this.Change}>
                    <td>{livre.title}</td>
                    <td>{livre.author}</td>
                    <td>
                      <MDBBtn onClick={this.openModalBuy(livre.id)} color="dark">Acheté</MDBBtn>
                      <MDBModal isOpen={this.state.modal}>
                        <MDBModalHeader>Informations complèmentaires</MDBModalHeader>
                        <MDBModalBody>
                            <label htmlFor="year" className="grey-text">
                          Année de sortie
                        </label>
                        <input
                          type="number"
                          name="year"
                          value={this.state.year}
                          className="form-control"
                          placeholder="Année"
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
                          placeholder="jj/mm/aa"
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
                          placeholder="Edition"
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
                          placeholder="Type"
                          className="form-control"
                          onChange={e => this.change(e)}
                          
                        />
                        </MDBModalBody>
                        <MDBModalFooter>
                          <MDBBtn color="danger" onClick={this.closeModalBuy}>Annuler</MDBBtn>
                          <MDBBtn onClick={this.buyBook(this.state.year, this.state.date, this.state.edition, this.state.typeBook)} color="dark">Valider l'achat</MDBBtn>
                        </MDBModalFooter>
                      </MDBModal>
                    </td>
                    <td><MDBBtn onClick={this.handleDelete(livre.id)} color="danger">Supprimer</MDBBtn></td>
                  </tr>
                ))
              }
            </MDBTableBody>
          </MDBTable>
          <div className="buttonAchat">
                <Fragment>
                    <MDBBtn href="/formulaireProchainAchat" color="dark"> 
                      Ajouter un prochain achat
                    </MDBBtn>
                </Fragment>
            </div>
        </div>
      );
    }
}

export default NextPurchasePage;
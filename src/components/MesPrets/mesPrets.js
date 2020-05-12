import React, { Fragment } from "react";
import { MDBBtn, MDBTableBody, MDBTableHead, MDBTable, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter} from "mdbreact";
import './mesPrets.css';
import axios from 'axios';
import { Redirect} from 'react-router';

class MyLends extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      noSession: false,//booleen qui permet de verifier si la session de l'utilisateur est active, initialisé a "faux"
      loading: true,//booleen initialisé comme vrai, qui va changer lors de la récupération des données
      lends: [],//va contenir les prets en cours de l'utilisateur
      returnDate: '',//va contenir la valeur entrée pour le champs "date de rendu" du formulaire, lorsuque l'utilisateur appuie sur le bouton "rendu"
      modal: false,//booleen qui va permettre d'ouvrir/fermer une fenetre lorsque l'utilisateur appuie sur "rendu"
      id: '',//va contenir l'id du livre selectionné par l'utilisateur lorsqu'il appuiera sur le  bouton "rendu"
      error:'',//va contenir l'erreur en cas d'erreur
      idLend: null,//va contenir l'id du livre rendu
    }
    this.checkSession = this.checkSession.bind(this);
    this.returnBook = this.returnBook.bind(this);
    this.openModalLend = this.openModalLend.bind(this);
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

  //methode qui permet d'ouvrir une fenetre avec un champs pour remplir la date de rendu du livre prêté
  openModalLend = (id) => e => {
    this.setState({
      modal: true,
      idLend: id
    });
  }

  //methode qui permet de fermer la fenetre de rendu d'un livre
  closeModalLend = () => {
  this.setState({
    modal: false,
  });
}


//methode qui permet d'attribuer à "returnDate" la valeur entrée au clavier par l'utilisateur lors du rendu d'un prêt
change = e => {
  this.setState ({
    [e.target.name]: e.target.value
  });
};

//methode qui permet d'envoyer les données au fichier PHP "rendu_pret.php" afin de modifier le statut du livre prêté, lorque l'utilisateur appuie sur le bouton "enregistrer" de la fenetre de rendu
returnBook = (returnDate) => e => {

  const { idLend, lends } = this.state;
  let newBooks = lends;
  console.log(idLend,'idBookSubmit');
  this.setState({
    modal: false,
  })
  let formData = new FormData();
  formData.append("id",idLend);
  formData.append("returnDate",returnDate);
  const url = "http://localhost:8888/API/GererPrets/rendu_pret.php"
  axios.post(url, formData, {withCredentials: true})
  
  //succes rendu livre
  .then(function(response){
    console.log(response);
    const tmp = lends;
    newBooks = tmp.filter(livre => livre.id !== idLend);
    alert('Succès : Livre à nouveau marqué comme disponible');
  })

  //echec rendu livre
  .catch((error)=>{
    console.log(error)
    if (error.response && error.response.status === 403){
      console.log(error);
      alert('Echec du rendu');
    }
  });

  setTimeout(() => {
    this.setState({
      lends: newBooks
    })
  }, 500);
  

  setTimeout(() => {
    this.setState({
      error: '',
    });
  }, 2000);
        
  e.preventDefault();

}

//methode qui permet de récuperer les livres en cours de prêts de l'utilisateur via le fichier "liste_prets.php"     
async componentDidMount() {
    const url = "http://localhost:8888/API/GererPrets/liste_prets.php";
    const response = await fetch(url,{credentials: 'include'});
    const data = await response.json();
    this.setState({lends: data.results.livres, loading: false})//"lends" contient les données reçues par le back-end 
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

    //si l'utilisateur n'a pas de prêts en cours:
    //affichage d'un bouton "nouveau prêt" qui redirige vers le formulaire de prêt
    //affichage d'un bouton "historique des prêts" qui redirige vers l'historique des prêts
    if (this.state.lends.length === 0){
        return (
          <div>
            <h1 className="titleMyLends"> Mes prêts </h1>
            <div className="noLend">
              Vous n'avez actuellement aucun prêt en cours.
            </div>
            <div className="buttonGere">
                <Fragment>
                    <MDBBtn href="/formulaireGerePret" color="dark"> 
                        Nouveau prêt
                    </MDBBtn>
                </Fragment>
            </div>
            <div className="buttonHistoric">
                <Fragment>
                    <MDBBtn href="/historique" color="dark"> 
                        Historique des prêts
                    </MDBBtn>
                </Fragment>
                
          </div>  
          </div>  
        );
    } 

    //sinon:
    //affichage d'un tableau avec les prêts en cours de l'utilisateur, grâce a la fonction map qui va parcourir "lends"
    //affichage d'un bouton "rendu" sur chaque ligne du tableau
    //affichage d'un bouton "nouveau prêt" qui redirige vers le formulaire de prêt
    //affichage d'un bouton "historique des prêts" qui redirige vers l'historique des prêts
    //ouverture d'une fenetre avec le formulaire de rendu lorsque l'utilisateur appuie sur "rendu"
    return (
        <div>
          <h1 className="titleMyLends"> Mes prêts </h1>
          <br></br>
          <h2> Vous avez {this.state.lends.length} prêt(s) en cours:</h2>
          <br></br>
          <MDBTable hover bordered scrollY maxHeight="350px">
            <MDBTableHead>
              <tr>
              <th>Titre</th>
              <th>Auteur</th>
              <th>Emprunteur</th>
              <th>Date d'emprunt</th>
              <th></th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {
                this.state.lends.map(livre => (
                  <tr key={livre.id} >
                    <td>{livre.title}</td>
                    <td>{livre.author}</td>
                    <td>{livre.borrower}</td>
                    <td>{livre.borrowDate}</td>
                    <td><MDBBtn onClick={this.openModalLend(livre.id)} color="dark">Rendu</MDBBtn>
                        <MDBModal isOpen={this.state.modal}>
                          <MDBModalHeader>Date de rendu</MDBModalHeader>
                          <MDBModalBody>
                            <input
                              type="date"
                              name="returnDate"
                              placeholder="jj/mm/aa"
                              className="form-control"
                              onChange={e => this.change(e)}
                            />
                          </MDBModalBody>
                          <MDBModalFooter>
                            <MDBBtn color="danger" onClick={this.closeModalLend}>Annuler</MDBBtn>
                            <MDBBtn color="dark" onClick={this.returnBook(this.state.returnDate)}>Enregistrer</MDBBtn>
                          </MDBModalFooter>
                        </MDBModal>
                    
                    
                    </td>
                  </tr>
                ))
              }
            </MDBTableBody>
          </MDBTable>
          <div className="buttonGere">
                <Fragment>
                    <MDBBtn href="/formulaireGerePret" color="dark"> 
                        Nouveau prêt
                    </MDBBtn>
                </Fragment>
                
          </div>
          <div className="buttonHistoric">
                <Fragment>
                    <MDBBtn href="/historique" color="dark"> 
                        Historique des prêts
                    </MDBBtn>
                </Fragment>
                
          </div>  
        </div>
      );
    }
}

export default MyLends;
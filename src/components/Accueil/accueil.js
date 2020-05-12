import React, {Component} from 'react';
import {
    MDBContainer,MDBCol, MDBBtn, 
  } from 'mdbreact';
import "./accueil.css";
import axios from 'axios';
import {  MDBDropdown,
  MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,  } from "mdbreact";
import { Redirect} from 'react-router';
import { Link } from 'react-router-dom';



class HomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
          noSession: false,//booleen qui permet de verifier si la session de l'utilisateur est active, initialisé a "faux"
      search:'',//va contenir la valeur entrée dans la barre de recherche
      filter: [],//va contenir les resultats de la recherche
      error:'',//va contenir l'erreur en cas d'erreur
        }
        this.checkSession = this.checkSession.bind(this);
        this.searchTitle = this.searchTitle.bind(this);
        this.searchAuthor = this.searchAuthor.bind(this);
        this.searchYear= this.searchYear.bind(this);
        this.searchEdition = this.searchEdition.bind(this);
        this.searchTypeBook = this.searchTypeBook.bind(this);
    }

    //fonction qui permet de fermer la session via le ficher PHP "logout.php" lorsque l'utilisateur appuie sur "se deconnecter"
    handleLogOut () {
      axios.get("http://localhost:8888/API/MonCompte/logout.php", {withCredentials: true})
    
      //succes deconnexion
      .then(function(response){
        console.log("successful logout", response);
        this.setState({logOut: true});//booleen de connexion changé comme "vrai"
      }.bind(this))
    
      //echec deconnexion
      .catch((error) => {
        if(error.response && error.response.status=== 403){
          console.log(error);
        }
      });
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
   
      //methode qui permet d'attribuer à "search" la valeur entrée au clavier par l'utilisateur
  change = e => {
    this.setState({
      [e.target.id]: e.target.value,
      });
  }  

  //Recherche avec le filtre par titre
  searchTitle = (search) => e => {
    console.log(search);
    let formData = new FormData();
    formData.append("title",search);
    const url = "http://localhost:8888/API/Accueil/recherche_titre.php"
    axios.post(url, formData, {withCredentials: true})

    .then(response => response.data)
    
    .then((data) => {
      this.setState({filter: data.results.livres});//"filter" contient les données reçues par le back-end 
      console.log(this.state.filter)
    })
      
    
    setTimeout(() => {
      this.setState({
        error: '',
      });
    }, 2000);
          
    e.preventDefault();
  }
  
  //Recherche avec le filtre par auteur
  searchAuthor = (search) => e => {
    console.log(search);
    let formData = new FormData();
    formData.append("author",search);
    const url = "http://localhost:8888/API/Accueil/recherche_author.php"
    axios.post(url, formData, {withCredentials: true})


    .then(response => response.data)
    
    .then((data) => {
      this.setState({filter: data.results.livres});//"filter" contient les données reçues par le back-end 
      console.log(this.state.filter)
    })
      
    
    setTimeout(() => {
      this.setState({
        error: '',
      });
    }, 2000);
          
    e.preventDefault();
  }

  //Recherche avec le filtre par année de sortie
  searchYear = (search) => e => {
    console.log(search);
    let formData = new FormData();
    formData.append("year",search);
    const url = "http://localhost:8888/API/Accueil/recherche_year.php"
    axios.post(url, formData, {withCredentials: true})

    .then(response => response.data)
    
    .then((data) => {
      this.setState({filter: data.results.livres});//"filter" contient les données reçues par le back-end 
      console.log(this.state.filter)
    })
      
    
    setTimeout(() => {
      this.setState({
        error: '',
      });
    }, 2000);
          
    e.preventDefault();
  }

  //Recherche avec le filtre par edition
  searchEdition = (search) => e => {
    console.log(search);
    let formData = new FormData();
    formData.append("edition",search);
    const url = "http://localhost:8888/API/Accueil/recherche_edition.php"
    axios.post(url, formData, {withCredentials: true})

    .then(response => response.data)
    
    .then((data) => {
      this.setState({filter: data.results.livres});//"filter" contient les données reçues par le back-end 
      console.log(this.state.filter)
    })
      
    
    setTimeout(() => {
      this.setState({
        error: '',
      });
    }, 2000);
          
    e.preventDefault();
  }

  //Recherche avec le filtre par type de livre
  searchTypeBook = (search) => e => {
    console.log(search);
    let formData = new FormData();
    formData.append("typeBook",search);
    const url = "http://localhost:8888/API/Accueil/recherche_typeBook.php"
    axios.post(url, formData, {withCredentials: true})

    .then(response => response.data)
    
    .then((data) => {
      this.setState({filter: data.results.livres});//"filter" contient les données reçues par le back-end 
      console.log(this.state.filter)
    })
      
    
    setTimeout(() => {
      this.setState({
        error: '',
      });
    }, 2000);
          
    e.preventDefault();
  }


    render() {
        const container = {height:270};
        const {noSession} = this.state;
        const bgRed = {backgroundColor: 'rgb(83, 4, 4)'}
        const{logOut} = this.state;

        //appel à la methode qui verifie la session
        this.checkSession ();

        //s'il n'y a pas de session active, redirection vers la page de connexion
        if(noSession){
            return <Redirect to="/"/>;
          }
          //Redirection vers page de connexion quand l'utilisateur se deconnecte
  if(logOut){
    return <Redirect to="/"/>;
  };
  


 //affichage du menu vertical qui redirige vers les differentes pages
        //affichage de la barre de recherche
        //affichage des filtres qui font appel aux differentes fonctions
        return(
            <div>
            <h1 className="myBibliBis">MyBibli</h1>
            <div className="searchPosition">
              <MDBCol>
                <div className="active-pink-3 active-pink-4 mb-4">
                  <input className="form-control" id="search" type="text" placeholder="Indiquez votre recherche..."  onChange={this.change}/>
                </div>
              </MDBCol>
            </div>
            <br></br>
            <div >
            <ul className="ulFilter">
            <li className="liFilter">Puis sélectionnez un filtre :  </li>
            <li className="liFilter">
              <MDBBtn  onClick={this.searchTitle(this.state.search)} color="dark" size="lg">Titre</MDBBtn>
            </li>
            <li className="liFilter">
              <MDBBtn  onClick={this.searchAuthor(this.state.search)} color="dark" size="lg">Auteur</MDBBtn>
              </li>
            <li className="liFilter">
              <MDBBtn  onClick={this.searchYear(this.state.search)} color="dark" size="lg">Année de sortie</MDBBtn>
            </li>
            <li className="liFilter">
              <MDBBtn  onClick={this.searchEdition(this.state.search)} color="dark" size="lg">Edition</MDBBtn>
            </li>
            <li className="liFilter">
              <MDBBtn  onClick={this.searchTypeBook(this.state.search)} color="dark" size="lg">Type de livre</MDBBtn>
            </li>

            </ul>
            <ul className="resultsSearch"> 
                  { this.state.filter ? this.state.filter.map(livre => (
                      <li className=".liResults" key={livre.id}>{livre.title}, {livre.author}, {livre.typeBook}, sorti en {livre.year}, édition {livre.edition}, acheté le: {livre.date}, statut: {livre.status}</li>
                  )) : <em>Chargement...</em>}
                </ul>

        </div>
        
        <MDBDropdown className="drop">
                <MDBDropdownToggle  style={bgRed}>
                  <div >Contact</div>
                </MDBDropdownToggle>
                <MDBDropdownMenu basic>
                  <MDBDropdownItem href="mailto:mybibli.sup@gmail.com">mybibli.sup@gmail.com</MDBDropdownItem>  
                </MDBDropdownMenu>
              </MDBDropdown>

        <MDBDropdown  className="dropdownn">
      <MDBDropdownToggle style={bgRed}>
       Mon Compte
      </MDBDropdownToggle>
      <MDBDropdownMenu basic>
        <MDBDropdownItem>
        <Link to="/gererMonCompte">
                    Gérer mon compte
                    </Link>
                    </MDBDropdownItem>
        <MDBDropdownItem onClick = {this.handleLogOut}><Link to="/">
                    Se déconnecter
                    </Link>
                    </MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
            
        <MDBContainer style={container} className="containerAcceuil">
        
          <div className="sidenav">
          <br></br>
            <a href="/mesLivres">Mes livres</a>
            <br></br>
            <a href="/ajoutlivre">Ajouter un livre</a>
            <br></br>
            <a href="/mesPrets">Gérer mes prêts</a>
            <br></br>
            <a href="/prochainAchat">Mes prochains achats</a>
          </div>      
        </MDBContainer>
      </div>
      
        );
    }
}

export default HomePage;
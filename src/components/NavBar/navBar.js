import React, { Component } from "react";
import { Link } from 'react-router-dom';

import { MDBNavbar,  MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,  } from "mdbreact";
import axios from "axios";
import { Redirect} from 'react-router';


class NavbarPage extends Component {
state = {
  isOpen: false,//booleen menu deroulant initialise a "faux"
  logOut: false,//booleen de deconnexion initialise a "faux"
};

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

//fonction qui permet d'ouvrir/fermer les menus deroulants lorsque l'utilisateur appuie sur "contact" ou "mon compte"
toggleCollapse = () => {
  this.setState({ isOpen: !this.state.isOpen });//change la valeur de "isOpen"
}

render() {
  const bgRed = {backgroundColor: 'rgb(83, 4, 4)'}
  const{logOut} = this.state;

  //Redirection vers page de connexion quand l'utilisateur se deconnecte
  if(logOut){
    return <Redirect to="/"/>;
  };

  //affichage du menu avec redirections vers les pages correspondantes
  return (
      <MDBNavbar style={bgRed} dark expand="md" scrolling fixed="top">

        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
          <MDBNavbarNav left>
          <MDBNavItem active  className="M">
              <MDBNavLink to="/accueil"><strong>MyBibli</strong></MDBNavLink>
            </MDBNavItem>
            <MDBNavItem active>
              <MDBNavLink to="/mesLivres">Mes livres</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/ajoutLivre">Ajouter un livre</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/mesPrets">Gérer mes prêts</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/prochainAchat">Mes prochains achats</MDBNavLink>
            </MDBNavItem>
            </MDBNavbarNav>
            

            <MDBNavbarNav right>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <div className="d-none d-md-inline">Contact</div>
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default">
                  <MDBDropdownItem href="mailto:mybibli.sup@gmail.com">mybibli.sup@gmail.com</MDBDropdownItem>
                  
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>

            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <div className="d-none d-md-inline">Mon compte</div>
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default">
                <MDBDropdownItem >
                 <Link to="/gererMonCompte">
                    Gérer mon compte
                    </Link>
                    </MDBDropdownItem>
                  <MDBDropdownItem  onClick = {this.handleLogOut} >
                  <Link to="/">
                    Se déconnecter
                    </Link>
                    </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
        
    
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

export default NavbarPage;

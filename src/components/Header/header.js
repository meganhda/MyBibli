import React from 'react';
import NavBar from '../NavBar/navBar';
//import './header.css';

const Header = ({ location }) => {
  const { pathname } = location;
  return (
    <>
      {
                  /* le header est partout sauf sur les pages citées ci dessous */
                  pathname !== '/' && pathname !== '/inscription' && pathname !== '/erreur404' && pathname !== '/accueil' &&(
                    /* le header est composé seulement de la bar de navigation importer par le component suivant */
                  <header>
                    <NavBar />
                  </header>
                  )
              }
    </>
  );
};

export default Header;

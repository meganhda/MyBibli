import React from 'react';
//import './footer.css';
import { MDBContainer, MDBFooter } from "mdbreact";
const Footer = ({ location }) => {
  const { pathname } = location;
  return (
    <>
      {
                /* le footer est partout sauf sur les pages citées ci dessous */
                pathname !== '/' && pathname !== '/inscription' && pathname !== '/erreur404' && (
                <footer className="footer">
                  <MDBFooter color="cyan" className="font-small darken-3 pt-0">
      
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright:{" "}
          <a href="http://localhost:3000/accueil"> MyBibli </a>
        </MDBContainer>
      </div>
    </MDBFooter>
                </footer>
                )
            }
    </>
  );
};

export default Footer;

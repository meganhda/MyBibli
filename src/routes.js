import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './container/App/App';
import Login from './components/Connexion/connexion';
import Erreur404 from './components/Erreur404/erreur404';
import SignUp from './components/Inscription/inscription';
import MyAccount from './components/MonCompte/monCompte';
import HomePage from './components/Accueil/accueil';
import AddBook from './components/AjoutLivre/ajoutLivre';
import LendBook from './components/GerePret/formulaireGerePret';
import NextPurchase from './components/ProchainAchat/formulaireAchat';
import MyLends from './components/MesPrets/mesPrets';
import MyBooks from './components/MesLivres/mesLivres';
import NextPurchasePage from './components/MesProchainsAchats/mesProchainsAchats';
import Historic from './components/Historique/historique';

/* permet la redirection entre les pages*/
const AppRoutes = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <App {...props}>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/inscription" component={SignUp} />
      <Route exact path="/accueil" component={HomePage} />
      <Route exact path="/ajoutLivre" component={AddBook} />
      <Route exact path="/formulaireGerePret" component={LendBook} />
      <Route exact path="/formulaireProchainAchat" component={NextPurchase} />
      <Route exact path="/mesPrets" component={MyLends} />
      <Route exact path="/mesLivres" component={MyBooks} />
      <Route exact path="/gererMonCompte" component={MyAccount} />
      <Route exact path="/prochainAchat" component={NextPurchasePage} />
      <Route exact path="/historique" component={Historic} />
     <Route component={Erreur404} />
      </Switch>
  </App>
);

export default AppRoutes;

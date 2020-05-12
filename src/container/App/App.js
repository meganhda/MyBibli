/* eslint-disable react/require-default-props */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Proptypes from 'prop-types';
// eslint-disable-next-line import/extensions
import Header from '../../components/Header/header.js';
import Footer from '../../components/Footer/footer';
import './App.css';

// eslint-disable-next-line no-irregular-whitespace
const App = ({ children, location }) => (
  <>
    <Header location={location} />
    <main>
      {children}
    </main>
    <Footer location={location} />
  </>
);

App.propTypes = {
  // eslint-disable-next-line react/require-default-props
  children: Proptypes.node,
  // eslint-disable-next-line react/no-unused-prop-types
  titleHeader: Proptypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  titleFooter: Proptypes.string,
};


export default App;

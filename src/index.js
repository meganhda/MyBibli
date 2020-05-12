import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import AppRoutes from './routes';

ReactDOM.render(
  <BrowserRouter>
    <Route component={AppRoutes} />
  </BrowserRouter>,
  document.getElementById('root'),
);

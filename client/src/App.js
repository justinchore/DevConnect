import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard.js';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';

//Redux
import { Provider } from 'react-redux'; //connects react and redux
import store from './store';
import { loadUser } from './actions/auth';

import './App.css';



const App = () => { 
  useEffect(() => {
    if(localStorage.token) {
        console.log('Checking token')    
        setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
  }, []); //only runs once with brackets -> without its a loop
  return(
     <Provider store={store}>
        <Router>
        <Fragment>
          <Navbar/>
          <Route exact path='/' component={Landing}/>
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register}/>
              <Route exact path="/login" component={Login}/>
              <PrivateRoute exact path="/dashboard" component={Dashboard}/>
              <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
            </Switch>
          </section>
        </Fragment>
        </Router>
     </Provider>
  )}

export default App;

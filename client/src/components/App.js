// Rendering layout control - React Router
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import Header from './Header';
import Landing from './Landing';
import CharitySearch from './CharitySearch';
import Charity from './Charity';
import DashboardAct from './DashboardAct';
import DashboardLoc from './DashboardLoc';

class App extends Component {

    render() {
        
        return (
            <div>
                <BrowserRouter> 
                    <div className="container-fluid" style={{padding:0}}>
                        <Header style={{position:"relative"}}/>
                        <Route exact={true} path="/" component={AdminLogin} />
                        <Route exact={true} path="/home" component={Landing} /> 
                        {/* <Route exact={true} path="/" component={Landing} /> */}
                        <Route exact={true} path="/charitySearch" component={CharitySearch} />
                        <Route path="/charity/:ABN" component={Charity} />
                        <Route path="/charities/dashboardAct" component={DashboardAct} />
                        <Route path="/charities/dashboardLoc" component={DashboardLoc} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
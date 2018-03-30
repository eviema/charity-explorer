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
import About from './About';
import Contact from './Contact';
import Footer from './Footer';

class App extends Component {

    render() {
        
        return (
            <div>
                <BrowserRouter> 
                    <div className="container-fluid" style={{padding:0}}>
                        <Header />
                        <Route exact={true} path="/" component={AdminLogin} />
                        <Route path="/home" component={Landing} /> 
                        {/* <Route exact={true} path="/" component={Landing} /> */}
                        <Route path="/charitySearch" component={CharitySearch} />
                        <Route path="/charity/:ABN" component={Charity} />
                        <Route path="/charities/dashboardAct" component={DashboardAct} />
                        <Route path="/charities/dashboardLoc" component={DashboardLoc} />
                        {/* <Route path="/about" component={About}/> */}
                        <Route path="/contact" component={Contact}/>
                        <Footer />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
// Rendering layout control - React Router
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './Header';
import Landing from './Landing';
import CharitySearchResults from './CharitySearchResults';
import Charity from './Charity';
import CauseExplorer from './CauseExplorer';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';
import Tips from './Tips';

class App extends Component {

    render() {
        
        return (
            <div>
                <BrowserRouter> 
                    <div className="container-fluid" style={{padding:0}}>
                        <Header />
                        <Route exact={true} path="/" component={Landing} />
                        <Route path="/charitySearchResults" component={CharitySearchResults} />
                        <Route path="/charity/:ABN" component={Charity} />
                        <Route path="/causeExplorer" component={CauseExplorer} />
                        <Route path="/tipsForDonors" component={Tips} />
                        <Route path="/about" component={About}/>
                        <Route path="/contact" component={Contact}/>
                        <Footer />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import spinner from '../assets/spinner.gif';
import { Card, CardBody, CardImage, CardTitle, CardText, Breadcrumb, BreadcrumbItem, Container, Col, Row } from 'mdbreact';

class CharitySearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cause: '',
            location: '',
            causes: [],
            locations: [],
            charities: [],
            doneCharitySearch: false,
            loading: false,
        }
        this.handleInputChangeOfCause = this.handleInputChangeOfCause.bind(this);
        this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axios.get('/api/causes-all')
            .then((res) => {
                var mainActivities = [];
                res.data.forEach((entry) => {
                    mainActivities.push(
                        {
                            value: entry["Main_Activity"],
                            label: entry["Main_Activity"]
                        }
                    );
                })
                this.setState({
                    causes: mainActivities
                });
            })
            .catch(function(e) {
                console.log("ERROR", e);
            });

        axios.get('/api/locations-all')
            .then((res) => {
                var locationsData = [];
                res.data.forEach((entry) => {
                    locationsData.push(
                        {
                            value: entry["Town_City"] + " " + entry["State"] + " " + entry["Postcode"],
                            label: entry["Town_City"] + " " + entry["State"] + " " + entry["Postcode"]
                        }
                    );
                })
                this.setState({
                    locations: locationsData
                });
            })
            .catch(function(e) {
                console.log("ERROR", e);
            });
    }

    handleInputChangeOfCause = (cause) => {
        this.setState({ 
            cause,
            doneCharitySearch: false
        });
    }

    handleInputChangeOfLocation = (location) => {
        this.setState({ 
            location,
            doneCharitySearch: false 
        });
    }


    handleSubmit(event) {

        this.setState({
            loading: true
        });

        axios.get('/api/charities/' 
                + this.state.location.value + '/' 
                + this.state.cause.value)
            .then((res) => {
                var charitiesMatched = [];
                res.data.forEach((entry) => {
                    charitiesMatched.push(
                        {
                            ABN: entry["ABN"],
                            name: entry["Charity_Name"],
                            desc: entry["Charity_activities_and_outcomes_helped_achieve_charity_purpose"],
                            suburb: entry["Town_City"],
                            postcode: entry["Postcode"],
                            cause: entry["Main_Activity"],
                            amtDonations: entry["Donations_and_bequests"],
                            amtGovGrants: entry["Government_grants"],
                        }
                    );
                })
                this.setState({
                    charities: charitiesMatched,
                    doneCharitySearch: true,
                    loading: false
                });
            })
            .catch(function(e) {
                console.log("ERROR", e);
            });

        event.preventDefault();
    }

    render() {
        
        var { cause } = this.state;
        var valueCause = cause && cause.value;

        var { location } = this.state;
        var valueLocation = location && location.value;

        var charityListItems = this.state.charities.map((charity, index) =>          
            <li key={index} className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex align-items-stretch p-3">

                <Card cascade>
                    <CardImage tag="div">
                        <div className="#26c6da cyan lighten-1 p-4">
                            <h5 className="h4-responsive">{charity.name}</h5>
                        </div>
                    </CardImage>
                    <CardBody>
                        <CardTitle>{charity.cause}</CardTitle>
                        <CardText>
                            {charity.desc.length <= 200 ? charity.desc : charity.desc.slice(0,200).concat("... ")}
                            <br />
                            {/* <a className="btn btn-default" href={`/charity/${charity.ABN}`} >
                                Learn more 
                                <i class="fa fa-angle-double-right pl-2"></i>
                            </a> */}                            
                        </CardText>
                    </CardBody>
                </Card>

            </li>
        );

        var pageStyle = {
            background: "url(https://images.unsplash.com/photo-1514395462725-fb4566210144?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c669e38dae80f85c8f713d178c3eca6e&auto=format&fit=crop&w=1051&q=80)",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "80vh",
        }

        var searchBoxStyle = {
            background: "rgba(236, 239, 241, 0.85)",
            padding: "2rem",
            margin: "2rem",
        }

        return(
            <div style={pageStyle}>
                <Breadcrumb>
                    <BreadcrumbItem><a href="/home"><i class="fa fa-home fa-lg"></i></a></BreadcrumbItem>
                    <BreadcrumbItem active>Search for charities</BreadcrumbItem>
                </Breadcrumb>
                <form className="pt-3 mx-2" > 
                    <div className="my-5"></div>
                    <div style={searchBoxStyle} className="m-3">
                        <div className="row">
                            <div className="col-10 col-sm-10 col-md-10 col-lg-10 col-xl-6">
                                <h5 className="mb-3 h5">Which charitable cause has personal significance to you? </h5>         
                                <Select name="cause"
                                    placeholder="Enter your charitable cause of interest..."
                                    value={valueCause}
                                    onChange={this.handleInputChangeOfCause}
                                    options={this.state.causes} />
                                <Link to="/charities/dashboardAct"
                                    className="my-2 w-50 small" style={{color:"#01579B", textShadow: "1px 1px 8px #fff"}}>
                                    Still unsure about which cause to choose? Click here to continue exploring...
                                </Link> 

                                <h5 className="my-3 h5">And your location?</h5>
                                <Select name="location"
                                    placeholder="Enter your location..."
                                    value={valueLocation}
                                    onChange={this.handleInputChangeOfLocation}
                                    options={this.state.locations} />
                            </div>
                        </div>
                        
                        <button type="submit" onClick={this.handleSubmit}
                            className="btn btn-default mt-5 col-8 col-sm-8 col-md-4 col-lg-3 col-xl-3">
                            Search for Charities
                        </button>
                        {this.state.loading && 
                                <img src={spinner} className="mt-5" alt="loading..." style={{height: 30, paddingLeft:30}}/>
                        }

                        <p />
                        {this.state.doneCharitySearch && this.state.charities.length === 0 &&
                        this.state.cause !== '' && this.state.location !== '' &&
                            <h6>
                                Sorry, no charities supporting {this.state.cause.value} in {this.state.location.value}.
                                <p />
                                Please modify your search.
                            </h6>
                        }
                        {this.state.doneCharitySearch && this.state.charities.length === 0 &&
                        this.state.cause === '' && this.state.location === '' &&
                            <h6>
                                Choose a cause and a location so that we can find the right charities for you!
                            </h6>
                        }

                    </div>
                                       
                </form>
                
                <p></p>
                
                <div className="mx-3 px-3 my-5">

                    {/* {this.state.doneCharitySearch && this.state.charities.length > 0 &&
                        <h5 className="mb-3 p-2" style={{color:"#000", background:"rgba(29, 233, 182, 0.85)"}}>
                            Found {this.state.charities.length} charities for you:
                        </h5>
                    }   */ } 

                    <ul className="row card-group list-unstyled">{charityListItems}</ul>

                </div>

                <footer className="page-footer stylish-color-dark font-small">
                    <Container className="py-5">
                    <Row className="text-center d-flex justify-content-center">
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/home">Home</a></h6>
                        </Col>
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/charities/dashboardAct">Charitable causes</a></h6>
                        </Col>
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/charitySearch">Charities</a></h6>
                        </Col>
                        {/* <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/about">About</a></h6>
                        </Col> */}
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/contact">Contact</a></h6>
                        </Col>
                    </Row>
                    </Container>
                    <div className="footer-copyright text-center py-4">
                        <Container fluid>
                            &copy; {(new Date().getFullYear())} DonateNow
                            <br />
                            Powered by ACE Solutions
                        </Container>
                    </div>
                </footer>
                
            </div>
            
        )
    }

}

export default CharitySearch;
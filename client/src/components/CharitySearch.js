import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import spinner from '../assets/spinner.gif';
import { Button, Card, CardBody, CardImage, CardTitle, CardText, Breadcrumb, BreadcrumbItem } from 'mdbreact';

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
                            <Button href={`/charity/${charity.ABN}`} >
                                Learn more 
                                <i class="fa fa-angle-double-right pl-2"></i>
                            </Button>                            
                        </CardText>
                    </CardBody>
                </Card>

            </li>
        );

        var pageStyle = {
            backgroundImage: "url(https://images.unsplash.com/photo-1518398046578-8cca57782e17?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=959228001844e0370bcb348f9d1e000a&auto=format&fit=crop&w=1050&q=80)",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "75vh",
        }

        var searchBoxStyle = {
            background: "rgba(236, 239, 241, 0.75)",
            padding: "2rem",
            margin: "2rem",
        }

        return(
            <div style={pageStyle}>
                <Breadcrumb>
                    <BreadcrumbItem><a href="/home"><i class="fa fa-home fa-lg"></i></a></BreadcrumbItem>
                    <BreadcrumbItem active>Search for charities</BreadcrumbItem>
                </Breadcrumb>
                <form className="pt-5 mx-4" > 
                    <div className="my-5"></div>
                    <div style={searchBoxStyle} className="m-5">
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
                        
                        <Button rounded color="cyan"
                                type="submit" onClick={this.handleSubmit}
                                className="mt-5 col-8 col-sm-8 col-md-4 col-lg-3 col-xl-3">
                            Search for Charities!
                        </Button>
                        {this.state.loading && 
                                <img src={spinner} alt="loading..." style={{height: 30, paddingLeft:30}}/>
                        }
                    </div>
                                       
                </form>
                
                <p></p>
                
                <div className="mx-5 px-3 my-5">

                    <div className="mb-3" style={{color:"white"}}>
                        {this.state.doneCharitySearch && this.state.charities.length > 0 &&
                            <h5>
                                Found {this.state.charities.length} charities for you:
                            </h5>
                        }
                        {this.state.doneCharitySearch && this.state.charities.length === 0 &&
                        this.state.cause !== '' && this.state.location !== '' &&
                            <h5>
                                Sorry, there are no charities that support {this.state.cause.value} in {this.state.location.value}
                            </h5>
                        }
                        {this.state.doneCharitySearch && this.state.charities.length === 0 &&
                        this.state.cause === '' && this.state.location === '' &&
                            <h5>
                                Choose a cause and a location so that we can find the right charities for you!
                            </h5>
                        }
                    </div>    

                    <ul className="row card-group list-unstyled">{charityListItems}</ul>

                </div>
                
            </div>
            
        )
    }

}

export default CharitySearch;
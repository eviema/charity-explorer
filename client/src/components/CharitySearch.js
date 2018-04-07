import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios';
import spinner from '../assets/spinner.gif';
import { Card, CardBody, CardImage, CardTitle, CardText, 
        Breadcrumb, BreadcrumbItem, 
        Container, Col, Row } from 'mdbreact';
import searchBackground from '../assets/searchBackground.jpg';
import Pagination from "react-js-pagination";

class CharitySearch extends Component {
    constructor(props) {

        super(props);

        const causeCurrent = props.location.state !== undefined 
        ? {
            value: props.location.state.cause,
            label: props.location.state.cause
        } : {};

        const locationCurrent = props.location.state !== undefined 
        ? {
            value: props.location.state.location,
            label: props.location.state.location
        } : {};
        
        this.state = {
            cause: causeCurrent,
            location: locationCurrent,
            causes: [],
            locations: [],
            charities: [],
            currentPage: 1,
            charitiesPerPage: 6,
            doneCharitySearch: false,
            loading: false,
            isMobileDevice: false,
        }
        this.handleInputChangeOfCause = this.handleInputChangeOfCause.bind(this);
        this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClickOnPageNumber = this.handleClickOnPageNumber.bind(this);
        this.handleClickToSearch = this.handleClickToSearch.bind(this);
    }

    componentDidMount() {
        
        axios.get('/api/causes-all')
            .then((res) => {
                var mainActivities = [];
                res.data.forEach((entry) => {
                    var currentCause = entry["Main_Activity"];
                    var found = mainActivities.some((cause) => {
                        return cause.value === currentCause;
                    });
                    if (!found) {
                        mainActivities.push(
                            {
                                value: currentCause,
                                label: currentCause
                            }
                        );
                    }
                    
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
                locationsData.push(
                    {
                        value: 'Greater Melbourne',
                        label: 'Greater Melbourne'
                    }
                );
                res.data.forEach((entry) => {
                    var locationString = entry["Town_City"] + " " + entry["State"] + " " + entry["Postcode"];
                    locationsData.push(
                        {
                            value: locationString,
                            label: locationString
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

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

    }

    resize() {
        this.setState({
          isMobileDevice: window.innerWidth <= 768
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
            loading: true,
            doneCharitySearch: false,
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

    handleClickOnPageNumber(currentPageNumber) {        
        this.setState({
            currentPage: currentPageNumber
        });
        window.scrollTo(0, 0);
    }

    handleClickToSearch() {
        this.setState({
            doneCharitySearch: false
        });
        window.scrollTo(0, 0);
    }

    render() {
        
        var { cause } = this.state;
        var valueCause = cause && cause.value;

        var { location } = this.state;
        var valueLocation = location && location.value;

        const { charities, currentPage, charitiesPerPage } = this.state;

        const indexOfLastCharity = currentPage * charitiesPerPage;
        const indexOfFirstCharity = indexOfLastCharity - charitiesPerPage;
        const currentCharities = charities.slice(indexOfFirstCharity, indexOfLastCharity);

        const renderCharities = currentCharities.map((charity, index) => {
            return (
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
        });

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(charities.length * 1.0 / charitiesPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderErrorMessage = 
            (valueCause !== undefined && valueLocation !== undefined) 
            ? 
            <h6>
                Sorry, no charities supporting {this.state.cause.value} in {this.state.location.value}.
                <p />
                Please modify your search.
            </h6>
            : 
            <h6>
                Please choose a cause and a location so that we can find the right charity for you!
            </h6>
            ;

        var pageStyle = this.state.isMobileDevice 
            ? {
                background: `url(${searchBackground})`,
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "scroll",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "90vh",
            } : {
                background: `url(${searchBackground})`,
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "90vh",
            }
        
         var searchBoxStyle = {
            background: "rgba(236, 239, 241, 0.85)",
            padding: "2rem",
            margin: "2rem",
        }

        return(
            <div>
                <Breadcrumb className="small mb-0">
                    <BreadcrumbItem><a href="/home"><i className="fa fa-home"></i></a></BreadcrumbItem>
                    <BreadcrumbItem><a href="/charities/dashboardAct">Explore charitable causes</a></BreadcrumbItem>
                    <BreadcrumbItem active>Search for charities</BreadcrumbItem>
                </Breadcrumb>

                {
                    (!this.state.doneCharitySearch || this.state.charities.length === 0) &&
                
                    <form className="pt-3 px-2" style={pageStyle}> 
                        <div style={searchBoxStyle} className="m-3">
                            <div className="row">
                                <div className="col-10 col-sm-10 col-md-10 col-lg-10 col-xl-6">
                                    <h5 className="mb-3 h5">Which charitable cause has personal significance to you? </h5>         
                                    <Select name="cause"
                                        placeholder="Enter your charitable cause of interest..."
                                        value={valueCause}
                                        onChange={this.handleInputChangeOfCause}
                                        options={this.state.causes} />
                                    <a href="/charities/dashboardAct"
                                        className="my-2 w-50 small" style={{textShadow: "1px 1px 8px #fff"}}>
                                        Still unsure about which cause to choose? Click here to continue exploring...
                                    </a> 

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

                            {
                                this.state.doneCharitySearch && charities.length === 0 &&
                                <div><p></p>{renderErrorMessage}</div>
                            }

                        </div>
                                        
                    </form>

                }

                {
                    this.state.doneCharitySearch && this.state.charities.length > 0 &&
                    <div className="m-3 px-3">

                        <button type="button" onClick={this.handleClickToSearch}
                            className="btn btn-default mb-2">
                            Back to search
                        </button>

                        <h5 className="my-3">
                            <strong>{valueCause}</strong> in <strong>{valueLocation}</strong>
                        </h5>
                        
                        <div className="row d-flex align-items-center justify-content-between px-3">
                            <h6 className="small mb-0">
                                Showing {(currentPage - 1) * charitiesPerPage + 1} to {Math.min(currentPage * charitiesPerPage, charities.length)} of {charities.length} results
                            </h6> 

                            <div>
                                <Pagination
                                    hideDisabled
                                    activePage={currentPage}
                                    itemsCountPerPage={charitiesPerPage}
                                    totalItemsCount={charities.length}
                                    pageRangeDisplayed={5}
                                    onChange={this.handleClickOnPageNumber}
                                />
                            </div>
                        </div>
                        
                        <ul className="row card-group list-unstyled">{renderCharities}</ul>
                        
                        <div className="row d-flex justify-content-between px-3">
                            <h6 className="small mb-0">
                                Showing {(currentPage - 1) * charitiesPerPage + 1} to {Math.min(currentPage * charitiesPerPage, charities.length)} of {charities.length} results
                            </h6>

                            <div>
                                <Pagination
                                    hideDisabled
                                    activePage={currentPage}
                                    itemsCountPerPage={charitiesPerPage}
                                    totalItemsCount={charities.length}
                                    pageRangeDisplayed={5}
                                    onChange={this.handleClickOnPageNumber}
                                />
                            </div>
                        </div>

                        <button type="button" onClick={this.handleClickToSearch}
                            className="btn btn-default mb-2">
                            Back to search
                        </button>
                    </div>
                }
                
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
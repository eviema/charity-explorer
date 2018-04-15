import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios';
import spinner from '../assets/spinner.gif';
import { Card, CardBody, CardImage, CardTitle, CardText, 
        Breadcrumb, BreadcrumbItem, 
        Container, Col, Row } from 'mdbreact';
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

        const conditions = [
            {
                value: 'amtAllLow',
                label: 'Lowest amount of income received'
            },
            {
                value: 'amtAllHigh',
                label: 'Highest amount of income received'
            },/* 
            {
                value: 'amtDonationsLow',
                label: 'Amount of donations and bequests received (low - high)'
            },
            {
                value: 'amtDonationsHigh',
                label: 'Amount of donations and bequests received (high - low)'
            },
            {
                value: 'amtGrantsLow',
                label: 'Amount of government grants received (low - high)'
            },
            {
                value: 'amtGrantsHigh',
                label: 'Amount of government grants received (high - low)'
            }, */
        ];
        
        this.state = {
            cause: causeCurrent,
            location: locationCurrent,
            causes: [],
            locations: [],
            charities: [],
            currentPage: 1,
            charitiesPerPage: 6,
            doneCharitySearch: false,
            sortByConditions: conditions,
            sortByCondCurrent: {},
            loading: false,
            isMobileDevice: false,
        }
        this.handleInputChangeOfCause = this.handleInputChangeOfCause.bind(this);
        this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClickOnPageNumber = this.handleClickOnPageNumber.bind(this);
        this.handleClickToSearch = this.handleClickToSearch.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }

    componentDidMount() {

        window.scrollTo(0, 0);
        
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

        if (this.state.cause.value !== undefined && this.state.location.value !== undefined) {
            this.handleSubmit();
        }

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

    }

    resize() {
        this.setState({
          isMobileDevice: window.innerWidth <= 768
        });
    }

    handleInputChangeOfCause = (chosenCause) => {
        const cause = chosenCause === null ? {} : chosenCause;
        this.setState({ 
            cause,
            doneCharitySearch: false
        });
    }

    handleInputChangeOfLocation = (chosenLocation) => {
        const location = chosenLocation === null ? {} : chosenLocation;
        this.setState({ 
            location,
            doneCharitySearch: false 
        });
    }

    handleSubmit() {
        console.log(this.state.cause.value, this.state.location.value)
        if (this.state.cause.value !== undefined && this.state.cause.value !== '' 
            && this.state.location.value !== undefined && this.state.location.value !== '') {
            this.setState({
                loading: true,
                doneCharitySearch: false,
            });
    
            axios.get('/api/charities/' + this.state.location.value + '/' + this.state.cause.value)
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
                                council: entry["Municipality"],
                                cause: entry["Main_Activity"],
                                amtDonations: entry["Donations_and_bequests"],
                                amtGovGrants: entry["Government_grants"],
                            }
                        );
                    })
    
                    // sort charity results by total amount received
                    const charitiesSortedByTotalAmt = [].concat(charitiesMatched)
                        .sort((charity1, charity2) => {
                            const charity1TotalAmt = charity1.amtDonations + charity1.amtGovGrants,
                                charity2TotalAmt = charity2.amtDonations + charity2.amtGovGrants;
                            return charity1TotalAmt - charity2TotalAmt;
                        });
    
                    this.setState({
                        charities: charitiesSortedByTotalAmt,
                        sortByCondCurrent: {
                            value: 'amtAllLow',
                            label: 'Lowest amount of income received'
                        },
                        doneCharitySearch: true,
                        loading: false
                    });
    
                    window.scrollTo(0, 0);
    
                })
                .catch(function(e) {
                    console.log("ERROR", e);
                });
        }
        else {
            this.setState({
                doneCharitySearch: true,
                loading: false,
                charities: [],
            });
        }

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

    async handleSort(chosenCond) {

        const condition = chosenCond === null ? {
            value: 'amtAllLow',
            label: 'Lowest amount of income received'
          } : chosenCond;

        await this.setState({
            sortByCondCurrent: condition
        });

        var charitiesSorted = [].concat(this.state.charities);

        switch (this.state.sortByCondCurrent.value) {
            case 'amtAllLow':
                charitiesSorted = charitiesSorted.sort((charity1, charity2) => {
                    const charity1TotalAmt = charity1.amtDonations + charity1.amtGovGrants,
                          charity2TotalAmt = charity2.amtDonations + charity2.amtGovGrants;
                    return charity1TotalAmt - charity2TotalAmt;
                });
                break;
            case 'amtAllHigh':
                charitiesSorted = charitiesSorted.sort((charity1, charity2) => {
                    const charity1TotalAmt = charity1.amtDonations + charity1.amtGovGrants,
                        charity2TotalAmt = charity2.amtDonations + charity2.amtGovGrants;
                    return charity1TotalAmt - charity2TotalAmt;
                }).reverse();
                break;
            default:
                charitiesSorted = charitiesSorted.sort((charity1, charity2) => {
                    const charity1TotalAmt = charity1.amtDonations + charity1.amtGovGrants,
                        charity2TotalAmt = charity2.amtDonations + charity2.amtGovGrants;
                    return charity1TotalAmt - charity2TotalAmt;
                });
                break;
        }

        this.setState({
            charities: charitiesSorted,
            currentPage: 1,
        });
    }

    render() {
        
        var { cause } = this.state;
        var valueCause = cause && cause.value;

        var { location } = this.state;
        var valueLocation = location && location.value;

        var { sortByCondCurrent } = this.state;
        var valueSortByCond = sortByCondCurrent && sortByCondCurrent.value;
        
        const { charities, currentPage, charitiesPerPage } = this.state;

        const indexOfLastCharity = currentPage * charitiesPerPage;
        const indexOfFirstCharity = indexOfLastCharity - charitiesPerPage;
        const currentCharities = charities.slice(indexOfFirstCharity, indexOfLastCharity);

        const renderCharities = currentCharities.map((charity, index) => {
            return (
                <li key={index} className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex align-items-stretch p-3">

                    <Card cascade className="w-100">
                        <CardImage tag="div">
                            <div className="#26c6da cyan lighten-1 p-4">
                                <h5 className="h4-responsive">{charity.name}</h5>
                            </div>
                        </CardImage>
                        <CardBody className="d-flex flex-column justify-content-between align-items-stretch">
                            <div>
                                <CardTitle>{charity.cause}</CardTitle>
                                <p>{charity.suburb} VIC {charity.postcode}</p>
                                <CardText>
                                    <span>{charity.desc.length <= 200 ? charity.desc : charity.desc.slice(0,200).concat("... ")}</span>
                                </CardText>
                            </div>
                            <a className="btn btn-outline-info" href={`/charity/${charity.ABN}`} >
                                Learn more 
                                <i className="fa fa-arrow-right fa-lg pl-2"></i>
                            </a>
                        </CardBody>
                    </Card>

                </li>
            );
        });

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(charities.length * 1.0 / charitiesPerPage); i++) {
            pageNumbers.push(i);
        }
        
        var pageStyle = this.state.isMobileDevice 
            ? {
                background: 'url(https://images.unsplash.com/photo-1514395462725-fb4566210144?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c669e38dae80f85c8f713d178c3eca6e&auto=format&fit=crop&w=1051&q=80)',
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "scroll",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "90vh",
            } : {
                background: 'url(https://images.unsplash.com/photo-1514395462725-fb4566210144?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c669e38dae80f85c8f713d178c3eca6e&auto=format&fit=crop&w=1051&q=80)',
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
            <div style={{background: "#F3F3F3"}}>
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
                            
                            <button type="button" onClick={this.handleSubmit}
                                className="btn btn-default mt-5 col-8 col-sm-8 col-md-4 col-lg-3 col-xl-3">
                                Search for Charities
                            </button>
                            {this.state.loading && 
                                    <img src={spinner} className="mt-5" alt="loading..." style={{height: 30, paddingLeft:30}}/>
                            }

                            {
                                this.state.doneCharitySearch && charities.length === 0 &&
                                valueCause !== undefined && valueLocation !== undefined && 
                                valueCause !== '' && valueLocation !== '' &&
                                <h6>
                                    <p />
                                    Sorry, no charities supporting {valueCause} in {valueLocation}.
                                    <p />
                                    Please modify your search.
                                </h6>
                            }
                            {
                                this.state.doneCharitySearch && charities.length === 0 &&
                                (valueCause === undefined || valueLocation === undefined) && 
                                <h6>
                                    <p />
                                    Please choose a cause and a location so that we can find the right charity for you!
                                </h6>
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

                        <div className="row d-flex align-items-center justify-content-between px-3">
                            <h5 className="my-3">
                                Charities supporting <strong>{valueCause}</strong> in <strong>{valueLocation}</strong>
                            </h5>
                        </div>

                        <div className="row d-flex align-items-center justify-content-start px-3 small">
                            <span>Sort by </span>
                            <Select name="sortBy" className="col-10 col-sm-6 col-md-5 col-lg-4 col-xl-3 mb-2 mt-1"
                                    value={valueSortByCond}
                                    onChange={this.handleSort}
                                    options={this.state.sortByConditions} />
                        </div>
                        
                        <div className="row d-flex align-items-center justify-content-between px-3">
                            <h6 className="small mb-0">
                                Showing {(currentPage - 1) * charitiesPerPage + 1} to {Math.min(currentPage * charitiesPerPage, charities.length)} of {charities.length} results
                            </h6> 

                            <div className="ml-2 mt-2">
                                <Pagination
                                    hideDisabled
                                    linkClass="py-1 px-2"
                                    activeLinkClass="bg-primary rounded text-white"
                                    activePage={currentPage}
                                    itemsCountPerPage={charitiesPerPage}
                                    totalItemsCount={charities.length}
                                    pageRangeDisplayed={5}
                                    onChange={this.handleClickOnPageNumber}
                                />
                            </div>
                        </div>
                        
                        <ul className="row card-group list-unstyled mb-0">{renderCharities}</ul>
                        
                        <div className="row d-flex align-items-center justify-content-between px-3">
                            <h6 className="small mb-0">
                                Showing {(currentPage - 1) * charitiesPerPage + 1} to {Math.min(currentPage * charitiesPerPage, charities.length)} of {charities.length} results
                            </h6>

                            <div className="ml-2 mt-2">
                                <Pagination
                                    hideDisabled
                                    linkClass="py-1 px-2"
                                    activeLinkClass="bg-primary rounded text-white"
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
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/about">About</a></h6>
                        </Col>
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
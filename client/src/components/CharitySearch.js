import React, { Component } from 'react';
import { Redirect } from "react-router";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios';
import spinner from '../assets/spinner.gif';
import { Card, CardBody, CardImage, CardTitle, CardText, 
        Breadcrumb, BreadcrumbItem, 
        Container, Col, Row,
        Tooltip, } from 'mdbreact';
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
                value: 'percUseHigh',
                label: '% of expenses for charitable use (High - Low)'
            },
            {
                value: 'amtAllLow',
                label: 'Lowest amount of donations and grants received'
            },
            {
                value: 'amtAllHigh',
                label: 'Highest amount of donations and grants received'
            },
        ];
        
        this.state = {
            cause: causeCurrent,
            location: locationCurrent,
            causes: [],
            locations: [],
            council: '',
            charities: [],
            currentPage: 1,
            charitiesPerPage: 5,
            doneCharitySearch: false,
            doneCharitySearchByCouncil: false,
            sortByConditions: conditions,
            sortByCondCurrent: {},
            loading: false,
            isMobileDevice: false,
            isCharityCardClicked: false,
            charityABN: 0,
        }
        this.handleInputChangeOfCause = this.handleInputChangeOfCause.bind(this);
        this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleClickOnPageNumber = this.handleClickOnPageNumber.bind(this);
        this.handleClickToSearch = this.handleClickToSearch.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleOnClickToCharityPage = this.handleOnClickToCharityPage.bind(this);
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

    async handleSubmit() {
        // console.log(this.state.cause.value, this.state.location.value)
        if (this.state.cause.value !== undefined && this.state.cause.value !== '' 
            && this.state.location.value !== undefined && this.state.location.value !== '') {
            
            this.setState({
                loading: true,
                doneCharitySearch: false,
                doneCharitySearchByCouncil: false,
            });

            var charitiesMatched = [];
    
            await axios.get('/api/charities/' + this.state.location.value + '/' + this.state.cause.value)
                .then(async (res) => {
                    
                    await res.data.forEach((entry) => {
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
                                ausUse: entry["Grants_and_donations_made_for_use_in_Australia"],
                                allUse: entry["Total_expenses"],
                                percUse: Math.round(entry["Grants_and_donations_made_for_use_in_Australia"] / entry["Total_expenses"] * 100),
                            }
                        );
                    })
                })
                .catch(function(e) {
                    console.log("ERROR", e);
                });

            // sort charity results by expense percentage for charity use
            const charitiesSortedByCharityUsePerc = [].concat(charitiesMatched)
            .sort((charity1, charity2) => {
                const charity1Perc = charity1.percUse,
                    charity2Perc = charity2.percUse;
                return charity2Perc - charity1Perc;
            });

            await this.setState({
                charities: charitiesSortedByCharityUsePerc,
                sortByCondCurrent: {
                    value: 'percUseHigh',
                    label: '% of expenses for charitable use (High - Low)'
                },
                doneCharitySearch: true,
                loading: false
            });

            // if there is NO charity of that cause in that suburb
            if (this.state.charities.length === 0) {
                this.setState({
                    doneCharitySearch: false,
                    loading: true
                });
                // get local council name by the suburb
                axios.get('/api/location/' + this.state.location.value)
                    .then((res) => {
                        var locationMatched = res.data[0];
                        this.setState({
                            council: locationMatched['Municipality'],
                        });

                        // find charities of that cause in that local council
                        axios.get('/api/charitiesByCouncil/' + this.state.council + '/' + this.state.cause.value)
                            .then(async (res) => {
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
                                            ausUse: entry["Grants_and_donations_made_for_use_in_Australia"],
                                            allUse: entry["Total_expenses"],
                                            percUse: Math.round(entry["Grants_and_donations_made_for_use_in_Australia"] / entry["Total_expenses"] * 100),
                                        }
                                    );
                                });

                                // sort charity results by expense percentage for charity use
                                const charitiesSortedByCharityUsePerc = [].concat(charitiesMatched)
                                .sort((charity1, charity2) => {
                                    const charity1Perc = charity1.percUse,
                                        charity2Perc = charity2.percUse;
                                    return charity2Perc - charity1Perc;
                                });

                                await this.setState({
                                    charities: charitiesSortedByCharityUsePerc,
                                    sortByCondCurrent: {
                                        value: 'percUseHigh',
                                        label: '% of expenses for charitable use (High - Low)'
                                    },
                                    doneCharitySearch: true,
                                    doneCharitySearchByCouncil: true,
                                    loading: false
                                });
                            })
                            .catch(function(e) {
                                console.log("ERROR", e);
                            });
                    })
                    .catch(function(e) {
                        console.log("ERROR", e);
                    });
            }

            window.scrollTo(0, 0);

        }
        // location or cause is undefined or empty
        else {
            this.setState({
                doneCharitySearch: true,
                loading: false,
                charities: [],
            });
        }

    }

    handleKeyPress(target) {
        if(target.charCode === 13){
            this.handleSubmit();    
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
            value: 'percUseHigh',
            label: '% of expenses for charitable use (High - Low)'
          } : chosenCond;

        await this.setState({
            sortByCondCurrent: condition
        });

        var charitiesSorted = [].concat(this.state.charities);

        switch (this.state.sortByCondCurrent.value) {
            case 'percUseHigh':
                charitiesSorted = charitiesSorted.sort((charity1, charity2) => {
                    const charity1Perc = charity1.percUse,
                        charity2Perc = charity2.percUse;
                    return charity2Perc - charity1Perc;
                });
                break;
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
                    const charity1Perc = charity1.percUse,
                        charity2Perc = charity2.percUse;
                    return charity2Perc - charity1Perc;
                });
                break;
        }

        this.setState({
            charities: charitiesSorted,
            currentPage: 1,
        });
    }

    handleOnClickToCharityPage(ABN) {
        this.setState({
            isCharityCardClicked: true,
            charityABN: ABN,
        });
    }

    render() {

        if (this.state.isCharityCardClicked) {
            return <Redirect push to={`/charity/${this.state.charityABN}`} />;
        }
        
        var { cause } = this.state;
        var valueCause = cause && cause.value;

        var { location } = this.state;
        var valueLocation = location && location.value;

        var { sortByCondCurrent } = this.state;
        var valueSortByCond = sortByCondCurrent && sortByCondCurrent.value;
        
        const { charities, currentPage, charitiesPerPage } = this.state;

        const { council } = this.state;

        const indexOfLastCharity = currentPage * charitiesPerPage;
        const indexOfFirstCharity = indexOfLastCharity - charitiesPerPage;
        const currentCharities = charities.slice(indexOfFirstCharity, indexOfLastCharity);

        const renderCharities = currentCharities.map((charity, index) => {
            var cardPercStyle = {};
            if (charity.percUse >= 80) {
                cardPercStyle = {
                    background:'#4CAF50',
                    borderRadius: "5px",
                } 
            }
            else if (charity.percUse >= 40) {
                cardPercStyle = {
                    background:'#FFA000',
                    borderRadius: "5px",
                }
            }
            else if (charity.percUse >= 10) {
                cardPercStyle = {
                    background:'#FF5722',
                    borderRadius: "5px",
                }
            }
            else {
                charity.percUse = '< 10';
                cardPercStyle = {
                    background:'#FF5722',
                    borderRadius: "5px",
                };
            }
            return (
                <li key={index} className="col col-12 d-flex align-items-stretch mx-3 mb-3 px-0 hoverable"
                    onClick={() => this.handleOnClickToCharityPage(charity.ABN)} style={{cursor: "pointer"}}>
                    <Card cascade className="w-100">
                        <CardImage tag="div">
                            <div className="#26c6da cyan lighten-1 p-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                <div className="d-flex align-items-center">
                                    <h5 className="h5-responsive">{charity.name}</h5>
                                    <Tooltip 
                                        placement="right" tag="div" component="button" 
                                        componentClass="btn btn-link p-0 mb-1 mt-2"
                                        tooltipContent={charity.percUse + '% of all expenses of this charity went to charitable use.'}> 
                                            <h5 className="h5-responsive text-white p-2 ml-4" style={cardPercStyle}>{charity.percUse}%</h5>
                                    </Tooltip>
                                </div>
                                <a className="btn btn-primary" href={`/charity/${charity.ABN}`} >
                                    Learn more 
                                    <i className="fa fa-arrow-right fa-lg pl-2"></i>
                                </a>
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
                                        placeholder="Enter your preferred cause..."
                                        value={valueCause}
                                        onChange={this.handleInputChangeOfCause}
                                        options={this.state.causes} />
                                    <a href="/charities/dashboardAct"
                                        className="my-2 w-50 small" style={{textShadow: "1px 1px 8px #fff"}}>
                                        Not sure about which cause to choose? Click here to explore...
                                    </a> 

                                    <h5 className="my-3 h5">And your location?</h5>
                                    <Select name="location"
                                        placeholder="Enter your location..."
                                        value={valueLocation}
                                        onChange={this.handleInputChangeOfLocation}
                                        options={this.state.locations} />
                                </div>
                            </div>
                            
                            <button type="button" onClick={this.handleSubmit} onKeyPress={this.handleKeyPress}
                                className="btn btn-default mt-5 col-8 col-sm-8 col-md-4 col-lg-3 col-xl-3">
                                Search for Charities
                            </button>
                            {this.state.loading && 
                                    <img src={spinner} className="mt-5" alt="loading..." style={{height: 30, paddingLeft:30}}/>
                            }

                            {
                                this.state.doneCharitySearch && charities.length === 0 &&
                                this.state.doneCharitySearchByCouncil && 
                                valueCause !== undefined && valueLocation !== undefined && 
                                valueCause !== '' && valueLocation !== '' &&
                                <h6>
                                    <p />
                                    It seems that no charity supports {valueCause} in {valueLocation} or in local council {council}.
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
                    <div className="my-3 px-3 row d-flex justify-content-center">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-10 col-xl-8">
                            {/* back to search button */}
                            <a onClick={this.handleClickToSearch}
                                className="small">
                                <u><strong>Back to search</strong></u>
                            </a>

                            {/* charity results title */}
                            <div className="row d-flex align-items-center justify-content-between px-3 mt-3">
                                <div className="mb-2">
                                    {this.state.doneCharitySearchByCouncil && <p>Although no results are found in {valueLocation}, there are...</p>}
                                    <h5>
                                        Charities supporting <strong>{valueCause}</strong> in&nbsp; 
                                        {this.state.doneCharitySearchByCouncil && <span><strong>{council}</strong>, your local council</span>}
                                        {!this.state.doneCharitySearchByCouncil && <strong>{valueLocation}</strong>}
                                    </h5>
                                </div>
                            </div>

                            {/* sort by */}
                            <div className="row d-flex align-items-center justify-content-start px-3 small">
                                <span>Sort by </span>
                                <Select name="sortBy" className="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-6"
                                        value={valueSortByCond}
                                        onChange={this.handleSort}
                                        options={this.state.sortByConditions} />
                            </div>
                            
                            {/* result range displayer and pagination */}
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
                            
                            {/* actual charity results */}
                            <ul className="row card-group list-unstyled mb-0 d-flex justify-content-center">{renderCharities}</ul>
                            
                            {/* result range displayer and pagination */}
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

                            {/* back to search button */}
                            <a onClick={this.handleClickToSearch}
                                className="pb-4 small">
                                <u><strong>Back to search</strong></u>
                            </a>
                        </div>
                    </div>
                }
                
                <footer className="page-footer stylish-color-dark font-small">
                    <Container className="py-5">
                    <Row className="text-center d-flex justify-content-center">
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/home">Home</a></h6>
                        </Col>
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/charitySearch">Charities</a></h6>
                        </Col>
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/charities/dashboardAct">Charitable causes</a></h6>
                        </Col>
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/about">About</a></h6>
                        </Col>
                        <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/tipsForDonors">Tips for donors</a></h6>
                        </Col>
                        {/* <Col md="2">
                            <h6 className="title font-weight-bold"><a href="/contact">Contact</a></h6>
                        </Col> */}
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
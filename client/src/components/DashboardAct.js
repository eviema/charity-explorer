import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router';
import Select from 'react-select';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardImage, Popover, PopoverBody, PopoverHeader } from "mdbreact";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';
import Collapsible from 'react-collapsible';
import spinner from '../assets/spinner.gif';
const greaterMelb = require("./greaterMelb");

class DashboardAct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchCharityClicked: false,
      locationsAll: [],
      locationCurrent: {},
      causesByLocation: [],
      causeCurrentDetails: [],
      causeName: '',
      causeCharityCount: 0,
      causeDonations: 0,
      causeGrants: 0,
      causeAmtRank: 0,
      barClicked: false,
      loading: false,
      redirecting: false,
    };
    this.handleOnClickToSearch = this.handleOnClickToSearch.bind(this);
    this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
    this.handleClickOnCauseBar = this.handleClickOnCauseBar.bind(this);
  }

  async componentDidMount() {
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
              locationsAll: locationsData
          });
        })
        .catch(function(e) {
            console.log("ERROR", e);
        });
    
    this.setState({
        locationCurrent: {
          value: 'Greater Melbourne',
          label: 'Greater Melbourne'
        },
        causesByLocation: greaterMelb
    });

    if (this.props.location.state !== undefined) {
      await this.setState({
        causeName: this.props.location.state.causeName,
        barClicked: true
      });

      const barData = { name: this.state.causeName};

      this.handleClickOnCauseBar(barData);

    }
      
    window.scrollTo(0, 0);

  }

  async handleInputChangeOfLocation(chosenLocation) {
    
    const location = chosenLocation === null ? {
      value: 'Greater Melbourne',
      label: 'Greater Melbourne'
    } : chosenLocation;

    await this.setState({ 
        locationCurrent: location,
        barClicked: false,
        loading: true,
    });

    if (this.state.locationCurrent.value === 'Greater Melbourne') {
        this.setState({
            causesByLocation: greaterMelb,
            loading: false,
        });
    }
    else {
        axios.get('/api/charitiesByLoc/' + this.state.locationCurrent.value)
        .then((res) => {

            var causesByLocMatched = [];
            
            res.data.forEach((entry) => {
                
                var currentCause = entry['Main_Activity'].trim(),
                    currentAmtDonations = entry['Donations_and_bequests'],
                    currentAmtGrants = entry['Government_grants'];
                
                var found = causesByLocMatched.some((cause) => {
                    return cause.name === currentCause;
                });
        
                // cause of this charity has been recorded 
                if (found) {
                     var causeIndex = causesByLocMatched.findIndex((cause => cause.name === currentCause));
                     causesByLocMatched[causeIndex].charityCount += 1;
                     causesByLocMatched[causeIndex].amtDonations += currentAmtDonations;
                     causesByLocMatched[causeIndex].amtGrants += currentAmtGrants;           
                }
                // cause of this charity has NOT been recorded
                else {
                    causesByLocMatched.push(
                        {
                            name: currentCause,
                            charityCount: 1,
                            amtDonations: currentAmtDonations,
                            amtGrants: currentAmtGrants,
                        }
                    );
                }
                
            });

            const causesSortedByTotalAmt = [].concat(causesByLocMatched)
                    .sort((cause1, cause2) => {
                        const cause1TotalAmt = cause1.amtDonations + cause1.amtGrants,
                             cause2TotalAmt = cause2.amtDonations + cause2.amtGrants;
                        return cause1TotalAmt - cause2TotalAmt;
                    });

            this.setState({
                causesByLocation: causesSortedByTotalAmt,
                loading: false,
            });

            // console.log(this.state.causesByLocation);

        })
        .catch(function(e) {
            console.log("ERROR", e);
        });
    }

  }

  handleClickOnCauseBar(data) {
    
    var causeClickedName = data.name;

    axios.get('/api/causes/' + causeClickedName)
        .then((res) => {

            this.setState({
                causeCurrentDetails: res.data,
            });

        })
        .catch(function(e) {
            console.log("ERROR", e);
        }); 
    
    var causeIndex = this.state.causesByLocation.findIndex((cause => cause.name === causeClickedName));
    
    this.setState({
        barClicked: true,
        causeName: causeClickedName,
        causeCharityCount: this.state.causesByLocation[causeIndex].charityCount,
        causeDonations: this.state.causesByLocation[causeIndex].amtDonations,
        causeGrants: this.state.causesByLocation[causeIndex].amtGrants,
        causeAmtRank: causeIndex + 1,
    }); 
    
  }

  handleOnClickToSearch() {
    this.setState({
        searchCharityClicked: true,
        redirecting: true
    });
  }

  render() {

    var { locationCurrent } = this.state;
    var valueLocation = locationCurrent && locationCurrent.value;

    var { causeDonations, causeGrants } = this.state;

    var causeDonationsWithCommas = causeDonations.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var causeGrantsWithCommas = causeGrants.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    const data = this.state.causesByLocation;

    if (this.state.searchCharityClicked) {
        return (
            <Redirect to={{
                pathname: '/charitySearch',
                state: {
                    cause: this.state.causeName,
                    location: valueLocation
                }
            }}/>
        );
    }

    var renderCauseSubtypes = this.state.causeCurrentDetails.map(subtype => {
      
      var triggerWhenClosed = 
        <a className="row d-flex align-items-center mx-1 py-1 px-2 border border-white rounded-top #b3e5fc light-blue lighten-4">
          <span>{subtype["Subtype_Name"]}</span>
          <i className="fa fa-angle-down fa-lg ml-auto"></i>
        </a>;
      
      var triggerWhenOpen = 
        <a className="row d-flex align-items-center mx-1 py-1 px-2 border border-white rounded-top #b3e5fc light-blue lighten-4">
          <span>{subtype["Subtype_Name"]}</span>
          <i className="fa fa-angle-up fa-lg ml-auto"></i>
        </a>;

      return (
        <li key={subtype["_id"]} style={{color: "#424242"}}>
          <Collapsible trigger={triggerWhenClosed}
                      triggerWhenOpen={triggerWhenOpen}>
            <p className="m-2 small">{subtype["Subtype_Desc"]}</p>
            <p className="m-2 small font-italic">
              <strong>Example: </strong>
              {subtype["Example"]}
            </p>
          </Collapsible>
        </li>
      );
    });

    return <div className="container-fluid" style={{ padding: "0" }}>
        <Breadcrumb className="small">
          <BreadcrumbItem>
            <a href="/home">
              <i className="fa fa-home" />
            </a>
          </BreadcrumbItem>
          <BreadcrumbItem active>Explore charitable causes</BreadcrumbItem>
        </Breadcrumb>

        {/* title: causes in location */}
        <div className="row d-flex align-items-center justify-content-center py-1 mx-2">
          <p className="col-11 col-sm-11 col-md-10 col-lg-8 col-xl-8 h4-responsive mb-0 text-center">
            You are viewing charitable causes in&nbsp;
            <strong>
              {valueLocation === "" && 
                <span> Greater Melbourne </span>}
              {valueLocation !== "" && this.state.loading && 
                <span> ... </span>}
              {valueLocation !== "" && !this.state.loading && 
                <span> {valueLocation} </span>}
            </strong>
          </p>

          <div className="col-10 col-sm-10 col-md-8 col-lg-6 col-xl-6 small py-1 px-1">
            <div className="row d-flex align-items-center justify-content-center">
              <span>Change location: </span>

              <Select name="location" className="col"
                placeholder="Select suburb..."
                value={valueLocation}
                onChange={this.handleInputChangeOfLocation}
                options={this.state.locationsAll} />

              {this.state.loading && <img src={spinner} alt="loading..." style={{ height: 20, paddingLeft: 20 }} />}
            </div>
          </div>
        </div>

        <hr className="mx-4" />

        {/* info + graph */}
        <div className="row d-flex align-items-stretch justify-content-center py-1 mx-1 mb-4">
          {/* graph of causes in location */}
          <div className="col-11 col-sm-11 col-md-11 col-lg-6 col-xl-6 small mb-4" style={{ height: "105vh" }}>
            <ResponsiveContainer>
              <BarChart data={data} layout="vertical" margin={{ top: 60, right: 20, left: 10, bottom: 20 }}>
                <XAxis type="number" orientation="top">
                  <Label value="Amount received by charities" offset={50} position="top" />
                </XAxis>
                <YAxis type="category" dataKey="name" width={180} interval={0} label={{ value: "Charitable cause", angle: -90, position: "left" }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend verticalAlign="top" align="right" offset={10} iconType="star" />
                <Bar dataKey="amtDonations" name="Donations and bequests (AUD)" stackId="a" fill="#8884d8" onClick={data => this.handleClickOnCauseBar(data)} />
                <Bar dataKey="amtGrants" name="Government grants (AUD)" stackId="a" fill="#82ca9d" onClick={data => this.handleClickOnCauseBar(data)} />
              </BarChart>
            </ResponsiveContainer>
            <small>
              Sources:&nbsp;&nbsp;
              <a href="https://data.gov.au/dataset/acnc2016ais/resource/b4a08924-af4f-4def-96f7-bf32ada7ee2b" target="_blank" rel="noopener noreferrer">
                1. ACNC 2016* Annual Information Statement Data
              </a>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="https://data.gov.au/dataset/acnc-register" target="_blank" rel="noopener noreferrer">
                2. ACNC Registered Charities
              </a>
            </small>
          </div>

          {/* details info of cause in location */}
          <div className="col-11 col-sm-11 col-md-11 col-lg-5 col-xl-5 mt-3">
            {!this.state.barClicked && 
              <div className="row d-flex align-items-center justify-content-center" 
                    style={{border:"3px dashed #9E9E9E", padding: "2rem", margin:"1rem", minHeight:"30vh"}}>
                <p>
                  Click on a bar in the graph to see details of
                  a cause here
                </p>
                <p style={{width: "100%", textAlign: "center", borderBottom: "1px solid #9E9E9E", lineHeight: " 0.1em", margin: "10px 0 20px"}}>
                  <span style={{background:"#fff", padding:"0 10px"}}> Or </span>
                </p>
                <button className="btn btn-outline-info" type="button" onClick={this.handleOnClickToSearch}>
                  Search for charities in 
                  { valueLocation !== "" && this.state.loading && 
                    <span> ... </span>}
                  {valueLocation !== "" && !this.state.loading && 
                    <span> {valueLocation} </span>}
                </button>
              </div>
            }
            {this.state.barClicked && <div id="causeInfo">
                <Card cascade className="mt-2 mb-4">
                  <CardImage tag="div">
                    <div className="#00b8d4 cyan accent-4 text-white p-4">
                      <h5 className="h5-responsive">
                        {this.state.causeName}
                      </h5>
                      <br />
                      <h6 className="h6-responsive">
                        {valueLocation}
                      </h6>
                    </div>
                  </CardImage>
                  <CardBody style={{ color: "#616161"}}>
                    <p>
                      In 2016*, charities supporting {this.state.causeName} in {valueLocation} received 
                      <ul>
                          <li><strong>${causeDonationsWithCommas} donations and bequests</strong></li>
                          <li><strong>${causeGrantsWithCommas} government grants</strong></li>
                      </ul>
                    </p>

                    <p>{data.length - this.state.causeAmtRank} out of {data.length} causes there received more.</p>
                    
                    <hr />
                    
                    <p>
                      There
                      {this.state.causeCharityCount !== 1 && <span>
                          {" "}
                          are <strong>
                            {this.state.causeCharityCount} charities{" "}
                          </strong>
                        </span>}
                      {this.state.causeCharityCount === 1 && <span>
                          {" "}
                          is <strong>
                            {this.state.causeCharityCount} charity{" "}
                          </strong>
                        </span>}
                      supporting {this.state.causeName} in {valueLocation}.
                    </p>
                    <button className="btn btn-outline-info" type="button" onClick={this.handleOnClickToSearch}>
                      See complete charity list
                    </button>
                    {this.state.redirecting && <img src={spinner} alt="redirecting..." style={{ height: 30, paddingLeft: 30 }} />}
                  </CardBody>
                </Card>

                <Card cascade>
                  <CardImage tag="div">
                    <div className="#0091ea light-blue accent-4 text-white p-4">
                      <h5 className="h5-responsive">
                        What is "{this.state.causeName}"
                      </h5>
                    </div>
                  </CardImage>
                  <CardBody>
                    <p>
                      {this.state.causeCurrentDetails.length}&nbsp;
                      {this.state.causeCurrentDetails.length === 1 && <span>
                          subcategory{" "}
                        </span>}
                      {this.state.causeCurrentDetails.length !== 1 && <span>
                          subcategories{" "}
                        </span>}
                      of work
                    </p>
                    <hr />
                    
                    <ul className="list-unstyled mb-0">{renderCauseSubtypes}</ul>
                  
                  </CardBody>
                </Card>
              </div>}
          </div>
        </div>

        <hr className="mx-4" />

        {/* why 2016? */}
        <Popover component="button" placement="right" popoverBody="*Why 2016?" className="btn btn-link btn-xs mx-4 mb-4" arrowClass="strzala">
          <PopoverHeader>*Why 2016?</PopoverHeader>
          <PopoverBody className="small">
            <p>
              We make every effort to show the latest information while
              making sure it's reliable.
            </p>
            <p>
              The data source we rely on is Australian Charities and
              Not-for-profits Commission (ACNC), the regulatory body for
              Australian charity sector, where the latest relevant data was
              published for 2016.
            </p>
            <p>We'll update as soon as they do. Stay tuned!</p>
          </PopoverBody>
        </Popover>
      </div>;
  }
}

export default DashboardAct;

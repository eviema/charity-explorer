import React, { Component } from "react";
import { Redirect } from 'react-router';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardImage } from "mdbreact";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';
import spinner from '../assets/spinner.gif';
const greaterMelb = require("./greaterMelb");

class DashboardAct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchCharityClicked: false,
      locationsAll: [],
      locationCurrent: '',
      causesByLocation: [],
      causeCurrentDetails: [],
      causeName: '',
      causeCharityCount: 0,
      causeDonations: 0,
      causeGrants: 0,
      barClicked: false,
      loading: false,
      redirecting: false,
    };
    this.handleOnClickToSearch = this.handleOnClickToSearch.bind(this);
    this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
    this.handleClickOnCauseBar = this.handleClickOnCauseBar.bind(this);
  }

  componentDidMount() {
    axios.get('/api/locations-all')
        .then((res) => {
            var locationsData = [];
            locationsData.push('Greater Melbourne');
            res.data.forEach((entry) => {
                locationsData.push(
                    entry["Town_City"] + " " + entry["State"] + " " + entry["Postcode"]
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
        locationCurrent: 'Greater Melbourne',
        causesByLocation: greaterMelb
    });

  }

  async handleInputChangeOfLocation(event) {

    await this.setState({ 
        locationCurrent: event.target.value,
        barClicked: false,
        loading: true,
    });

    if (this.state.locationCurrent === 'Greater Melbourne') {
        this.setState({
            causesByLocation: greaterMelb,
            loading: false,
        });
    }
    else {
        axios.get('/api/charitiesByLoc/' + this.state.locationCurrent)
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

            this.setState({
                causesByLocation: causesByLocMatched,
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
    }); 
    
  }

  handleOnClickToSearch() {
    this.setState({
        searchCharityClicked: true,
        redirecting: true
    });
  }

  render() {

    if (this.state.searchCharityClicked) {
        return (
            <Redirect to={{
                pathname: '/charitySearch',
                state: {
                    cause: this.state.causeName,
                    location: this.state.locationCurrent
                }
            }}/>
        );
    }
    
    const data = this.state.causesByLocation;

    return (
      <div className="container-fluid" style={{padding: "0"}}>
        
        <Breadcrumb className="small">
            <BreadcrumbItem>
                <a href="/home"><i className="fa fa-home" /></a>
            </BreadcrumbItem>
            <BreadcrumbItem active>
                Explore charitable causes
            </BreadcrumbItem>
        </Breadcrumb>

        {/* title: causes in location */}
        <div className="row d-flex align-items-center justify-content-center py-1 mx-2">
            
            <p className="col-11 col-sm-11 col-md-10 col-lg-8 col-xl-8 h4-responsive mb-0 text-center">
                You are viewing charitable causes in&nbsp;
                <strong>
                    {this.state.locationCurrent === '' && <span>Greater Melbourne</span>}
                    {this.state.locationCurrent !== '' && this.state.loading && <span>...</span>}
                    {this.state.locationCurrent !== '' && !this.state.loading && <span>{this.state.locationCurrent}</span>}
                </strong>
            </p>
            
            <div className="col-10 col-sm-10 col-md-8 col-lg-6 col-xl-6 small py-1 px-1">
                <div className="row d-flex align-items-center justify-content-center">
                    <span className="mr-2">Change location: </span>
                    <select 
                        name="location"
                        placeholder="Select suburb..."
                        value={this.state.locationCurrent}
                        onChange={this.handleInputChangeOfLocation}>
                        {this.state.locationsAll.map(location => <option key={location} value={location}>{location}</option>)}
                    </select>
                    {this.state.loading && 
                        <img src={spinner} alt="loading..." style={{height: 20, paddingLeft: 20}}/>
                    }
                </div>    
            </div>
                        
        </div>
        
        <hr />

        {/* info + graph */}
        <div className="row d-flex align-items-stretch justify-content-center py-1 mx-1 mb-4">

            {/* graph of causes in location */}
            <div className="col-11 col-sm-11 col-md-11 col-lg-6 col-xl-6 small" style={{height:"90vh"}}>
                <ResponsiveContainer>
                    <BarChart 
                            data={data} layout="vertical"
                            margin={{top: 60, right: 10, left: 10, bottom: 20}}>
                        <XAxis type="number" orientation="top">
                            <Label value="Amount of donations, bequests and government grants received by charities" offset={50} position="top" />
                        </XAxis>
                        <YAxis type="category" dataKey="name" width={180} interval={0} minTickGap={20}
                            label={{ value: 'Charitable cause', angle: -90, position: 'left'}}>
                        </YAxis>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend verticalAlign="top" align="right" offset={10} iconType="star"/>
                        <Bar dataKey="amtDonations" name="Donations and bequests (AUD)" stackId="a" fill="#8884d8" onClick={data=>this.handleClickOnCauseBar(data)} />
                        <Bar dataKey="amtGrants" name="Government grants (AUD)" stackId="a" fill="#82ca9d" onClick={data=>this.handleClickOnCauseBar(data)} />
                    </BarChart>
                </ResponsiveContainer>
            
            </div>

            {/* details info of cause in location */}
            <div className="col-11 col-sm-11 col-md-11 col-lg-5 col-xl-5 mt-3">
                { 
                    !this.state.barClicked &&
                    <p>Click on a bar from the graph to see detailed information of a cause here.</p>
                }
                { 
                    this.state.barClicked &&
                    <div id="causeInfo" >
                        <Card cascade className="mt-2 mb-4">
                            <CardImage tag="div">
                                <div className="#81d4fa light-blue lighten-3 p-4">
                                    <h5 className="h5-responsive">{this.state.causeName}</h5><br />
                                    <h6 className="h6-responsive">{this.state.locationCurrent}</h6>
                                </div>
                            </CardImage>
                            <CardBody style={{color:"#616161", fontSize:"small"}}>
                                <p>
                                    In 2016, charities supporting {this.state.causeName} in {this.state.locationCurrent} received <strong>${this.state.causeDonations} donations and bequests</strong> and <strong>${this.state.causeGrants} government grants</strong>.
                                </p>
                                <p>
                                    There 
                                    {
                                        this.state.causeCharityCount !== 1 && 
                                        <span> are <strong>{this.state.causeCharityCount} charities </strong></span>
                                    }
                                    {
                                        this.state.causeCharityCount === 1 && 
                                        <span> is <strong>{this.state.causeCharityCount} charity </strong></span>
                                    }
                                    supporting {this.state.causeName} in {this.state.locationCurrent}.
                                </p>
                                <button className="btn btn-outline-info" type="button" onClick={this.handleOnClickToSearch}>See complete charity list</button>
                                {this.state.redirecting && 
                                    <img src={spinner} alt="redirecting..." style={{height: 30, paddingLeft:30}}/>
                                }
                            </CardBody>
                        </Card>

                        <Card cascade>
                            <CardImage tag="div">
                                <div className="#80deea cyan lighten-3 p-4">
                                    <h5 className="h5-responsive">What is "{this.state.causeName}"</h5>
                                </div>
                            </CardImage>
                            <CardBody>
                                <p className="h6-responsive">
                                        {this.state.causeCurrentDetails.length}&nbsp;
                                        {this.state.causeCurrentDetails.length === 1 && <span>subcategory </span>}
                                        {this.state.causeCurrentDetails.length !== 1 && <span>subcategories </span>}
                                    of work
                                </p>
                                {this.state.causeCurrentDetails.map(subtype => 
                                        <div key={subtype["_id"]} style={{color:"#616161", fontSize:"small"}}>
                                            <hr />
                                            <p className="h5-responsive font-weight-bold">{subtype["Subtype_Name"]}</p>
                                            <p>{subtype["Subtype_Desc"]}</p>
                                            <p className="font-italic"><strong>Example: </strong>{subtype["Example"]}</p>
                                        </div>
                                    )
                                }
                            </CardBody>
                        </Card>
                    </div>
                    
                }
                
            </div>
        </div>
        
      </div>
    );
  }
}

export default DashboardAct;

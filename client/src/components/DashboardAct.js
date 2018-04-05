import React, { Component } from "react";
import { Redirect } from "react-router";
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardImage, CardTitle, CardText } from "mdbreact";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';

class DashboardAct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToSearch: false,
      locationsAll: [],
      locationCurrent: '',
      causesByLocation: [],
      causeCurrent: '',
    };
    this.handleOnClickToSearch = this.handleOnClickToSearch.bind(this);
    this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
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

  }

  async handleInputChangeOfLocation(event) {
    await this.setState({ 
        locationCurrent: event.target.value
    });

    console.log(this.state.locationCurrent);

    axios.get('/api/charitiesByLoc/' + this.state.locationCurrent)
        .then((res) => {
            var causesByLocMatched = [];
            console.log(res.data);
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
            });

            console.log(this.state.causesByLocation);

        })
        .catch(function(e) {
            console.log("ERROR", e);
        });

  }

  handleOnClickToSearch = () => {
    this.setState({
      redirectToSearch: true
    });
  };

  render() {
    if (this.state.redirectToSearch) {
      return <Redirect push to="/charitySearch" />;
    }

    const data = this.state.causesByLocation;

    return (
      <div className="container-fluid">
        
        <Breadcrumb className="small" style={{background:"none"}}>
            <BreadcrumbItem>
                <a href="/home"><i className="fa fa-home" /></a>
            </BreadcrumbItem>
            <BreadcrumbItem active>
                Explore charitable causes
            </BreadcrumbItem>
        </Breadcrumb>

        {/* title: causes in location */}
        <div className="row d-flex align-items-center justify-content-center py-1 mx-2">
            <p className="h4-responsive mb-0">You are viewing charitable causes in&nbsp;
                <strong>
                    {this.state.locationCurrent === '' && <span>Greater Melbourne</span>}
                    {this.state.locationCurrent !== '' && <span>{this.state.locationCurrent}</span>}
                </strong>
            </p> 
            <select className="col-8 col-sm-6 col-md-3 col-lg-2 small py-1"
                    name="location"
                    placeholder="Select suburb..."
                    value={this.state.locationCurrent}
                    onChange={this.handleInputChangeOfLocation}>
                {this.state.locationsAll.map(location => <option key={location} value={location}>{location}</option>)}
            </select>
        </div>
        
        <hr />

        {/* info + graph */}
        <div className="row d-flex align-items-center justify-content-center py-1 mx-2">

            {/* details info of cause in location */}
            <div className="col-11 col-sm-11 col-md-11 col-lg-3 col-xl-3">
                { 
                    this.state.causeCurrent === '' &&
                    <p>Click on a cause from the graph to see detailed information here.</p>
                }
                { 
                    this.state.causeCurrent !== '' &&
                    <Card cascade>
                        <CardImage tag="div">
                            <div className="#26c6da cyan lighten-1 p-4">
                                <h5 className="h5-responsive">{this.state.causeCurrent} in {this.state.location}</h5>
                            </div>
                        </CardImage>
                        <CardBody>
                            <CardTitle>{this.state.causeCurrent}</CardTitle>
                            <CardText>
                                                           
                            </CardText>
                        </CardBody>
                    </Card>
                }
                
            </div>

            {/* graph of causes in location */}
            <div className="col-11 col-sm-11 col-md-11 col-lg-8 col-xl-8 small" style={{height:"90vh"}}>
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
                        <Bar dataKey="amtDonations" name="Donations and bequests (AUD)" stackId="a" fill="#8884d8">
                        </Bar>
                        <Bar dataKey="amtGrants" name="Government grants (AUD)" stackId="a" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            
            </div>
        </div>
        
      </div>
    );
  }
}

export default DashboardAct;

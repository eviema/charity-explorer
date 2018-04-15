import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router';
import Select from 'react-select';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardImage, Popover, PopoverBody, PopoverHeader } from "mdbreact";
import Plot from 'react-plotly.js';
import Collapsible from 'react-collapsible';
import ScrollableAnchor, { configureAnchors, goToTop, goToAnchor } from 'react-scrollable-anchor';
import spinner from '../assets/spinner.gif';
import causePageTopBackground from '../assets/causePageTopBackground.jpg';
import totalIncome from '../assets/totalIncome.png';
import government from '../assets/government128.png';
import people from '../assets/people128.png';
import charity from '../assets/charity128.png';
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
      isMobileDevice: false,
    };
    this.handleOnClickToSearch = this.handleOnClickToSearch.bind(this);
    this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
    this.handleClickOnCauseBar = this.handleClickOnCauseBar.bind(this);
  }

  async componentDidMount() {

    goToTop();

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

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

  }

  resize() {
      this.setState({
        isMobileDevice: window.innerWidth <= 768
      });
  }

  async handleInputChangeOfLocation(chosenLocation) {
    
    const location = chosenLocation === null ? {
      value: 'Greater Melbourne',
      label: 'Greater Melbourne'
    } : chosenLocation;

    await this.setState({ 
        locationCurrent: location,
        causeName: '',
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

  async handleClickOnCauseBar(data) {
    
    var causeClickedName = data.name === undefined ? data.points[0].y : data.name;

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
    
    await this.setState({
        barClicked: true,
        causeName: causeClickedName,
        causeCharityCount: this.state.causesByLocation[causeIndex].charityCount,
        causeDonations: this.state.causesByLocation[causeIndex].amtDonations,
        causeGrants: this.state.causesByLocation[causeIndex].amtGrants,
        causeAmtRank: causeIndex + 1,
    }); 

    configureAnchors({offset: -100, scrollDuration: 400});
    goToAnchor('causeInfo');
    
  }

  handleOnClickToSearch() {
    this.setState({
        searchCharityClicked: true,
        redirecting: true
    });
  }

  render() {

    // selected location
    var { locationCurrent } = this.state;
    var valueLocation = locationCurrent && locationCurrent.value;

    // causes for plots
    var { causesByLocation } = this.state;
    var causeNames = causesByLocation.map(entry => {return entry['name']}),
        causeTotalAmts = causesByLocation.map(entry => {return entry['amtDonations'] + entry['amtGrants']});

    /* var traceScatter = {
      x: causeTotalAmts,
      y: causeNames,
      fill: 'tozerox',
      fillcolor: '#E0E0E0',
      type: 'scatter',
      marker: {color: '#9E9E9E'},
      hoverinfo: 'none',
    }; */
    var traceBar = {
      x: causeTotalAmts,
      y: causeNames,
      xaxis: 'x2',
      yaxis: 'y2',
      type: 'bar',
      orientation: 'h',
      marker: {color: '#586CCC'},
      hoverinfo: 'x+y',
    };

    // var plotData = [ traceScatter, traceBar ];
    var plotData = [traceBar];
    var plotLayout = {
      /* xaxis: {
        side: "top",
        showticklabels: false,
        showgrid: false,
        domain: [0, .12],
        type: 'log',
      },
      yaxis: {
        showticklabels: false,
        showgrid: false,
        autorange: 'reversed',
      }, */
      xaxis2: {
        side: "top",
        showgrid: false,
        domain: [0.3, 1.0],
        type: 'log',

      },
      yaxis2: {
        anchor: 'x2',
        showgrid: false,
        autorange: 'reversed',
      },
      showlegend: false,
      title:`Here's the ranking of total donations and grants (A$) by all charitable causes <br />in ${valueLocation}`
    };

    // quick summary on top of plots
    if (causesByLocation.length !== 0) {
      var causeRecvLeast = causesByLocation[0],
          causeRecvMost = causesByLocation[causesByLocation.length-1],
          causeRecvLeastAmtWithCommas = (causeRecvLeast.amtDonations + causeRecvLeast.amtGrants).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          causeRecvMostAmtWithCommas = (causeRecvMost.amtDonations + causeRecvMost.amtGrants).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
   
    // redirect to charity search
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


    // details of selected cause
    var { causeDonations, causeGrants } = this.state;
    var causeDonationsWithCommas = causeDonations.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var causeGrantsWithCommas = causeGrants.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var causeTotalWithCommas = (causeDonations + causeGrants).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    var renderCauseSubtypes = this.state.causeCurrentDetails.map(subtype => {
      
      var triggerWhenClosed = 
        <a className="row d-flex align-items-center mx-1 py-1 px-2 border border-white rounded-top text-white" style={{background:"#7986CB"}}>
          <span>{subtype["Subtype_Name"]}</span>
          <i className="fa fa-angle-down fa-lg ml-auto"></i>
        </a>;
      
      var triggerWhenOpen = 
        <a className="row d-flex align-items-center mx-1 py-1 px-2 border border-white rounded-top text-white" style={{background:"#7986CB"}}>
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

    // title row style
    const titleRowStyle = this.state.isMobileDevice 
      ? {
            background: `url(${causePageTopBackground})`,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "50vh",
        } 
      : {
            background: `url(${causePageTopBackground})`,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "50vh",
        }
    
    return (
      <div className="container-fluid" style={{ padding: "0", background: "#F3F3F3"}}>
        <Breadcrumb className="small mb-0">
          <BreadcrumbItem>
            <a href="/home">
              <i className="fa fa-home" />
            </a>
          </BreadcrumbItem>
          <BreadcrumbItem active>Explore charitable causes</BreadcrumbItem>
        </Breadcrumb>

        {/* title: causes in location */}
        <div className="row d-flex align-items-center justify-content-center py-4 px-2 text-white" style={titleRowStyle}>
          <p className="col-11 col-sm-10 col-md-8 col-lg-7 h1-responsive px-5" style={{textShadow: "1px 1px 8px #212121"}}>
            Where are donations and grants going to charitable causes in Greater Melbourne?
            <br />
            <span className="pt-3" style={{color: "#F5F5F5", fontSize: "0.4em"}}>
              Data taken from <u><a href="https://data.gov.au/">data.gov.au</a></u>
            </span>
          </p>
        </div>

        {/* change location */}
        <div className="row d-flex flex-column align-items-center justify-content-center py-4 mx-4">
          <p className="h4-responsive">
            Select the suburb you'd like to explore further: 
          </p>

          <div className="col-8 col-sm-6 col-md-6 col-lg-5 col-xl-4">
            <Select name="location"
              placeholder="Select suburb..."
              value={valueLocation}
              onChange={this.handleInputChangeOfLocation}
              options={this.state.locationsAll} />
          </div>
        </div>

        <hr className="mx-4" />

        <div className="pb-5" style={{position:"relative"}}>
          {/* loading - section overlay */}
          { this.state.loading && 
            <div style={{position: 'absolute', top: '0', bottom: '0', left: '0', right: '0', background:"rgba(255, 255, 255,0.7)", zIndex:"2", cursor:"pointer"}}
                  className="d-flex justify-content-center pt-5">
              <span className="h3-responsive">Updating...</span>
              <img src={spinner} alt="loading..." style={{ height: 30, paddingLeft: 30 }} />
            </div>
          }

          {/* quick summary of causes in curernt location */}
          <div className="row d-flex flex-column align-items-center pt-4 pb-2 mx-4 h5-responsive" style={{width:"80vw"}}>
            <div>
              <p>In <strong>{valueLocation}</strong>,</p>
              <p>
                <i className="fa fa-hand-holding-usd mt-3 mr-5" style={{color:"#E57373"}}></i>
                {causesByLocation.length > 0 && 
                  <span className="ml-2">
                    <strong>{causeRecvLeast.name}</strong> received the <strong>least</strong> - ${causeRecvLeastAmtWithCommas}.
                  </span>
                }
              </p>
              <p>
                <i className="fa fa-hand-holding-usd" style={{color:"#E57373"}}></i>
                <i className="fa fa-hand-holding-usd" style={{color:"#E57373"}}></i>
                <i className="fa fa-hand-holding-usd mr-3" style={{color:"#E57373"}}></i>
                {causesByLocation.length > 0 && 
                  <span>
                    <strong>{causeRecvMost.name}</strong> received the <strong>most</strong> - ${causeRecvMostAmtWithCommas}.
                  </span>
                }
              </p>
            </div>
          </div>

          {/* graph of causes in location */}
          <div className="row d-flex align-items-stretch justify-content-center py-2 mx-4 small" style={{ height: "65vh" }}>

            <Plot 
              data={plotData}
              layout={plotLayout}
              style={{width: "80vw", height: "60vh"}}
              onClick={this.handleClickOnCauseBar}
            />
            
            <small className="mt-3">
              Sources:&nbsp;&nbsp;
              <a href="https://data.gov.au/dataset/acnc2016ais/resource/b4a08924-af4f-4def-96f7-bf32ada7ee2b" target="_blank" rel="noopener noreferrer">
                1. ACNC 2016* Annual Information Statement Data
              </a>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="https://data.gov.au/dataset/acnc-register" target="_blank" rel="noopener noreferrer">
                2. ACNC Registered Charities
              </a>
            </small>
          </div>

        </div>

        <hr className="mx-4" />
              
        {/* details info of cause in location */}
        <div className="row d-flex align-items-center justify-content-center py-3 mx-3 mb-4">
          {!this.state.barClicked && 
            <div className="row d-flex align-items-center justify-content-center" 
                  style={{border:"3px dashed #9E9E9E", padding: "2rem", margin:"1rem", minHeight:"30vh", width: "80vw"}}>
              <p>
                Click on a bar in the graph to see details of
                a cause here
              </p>
              <p style={{width: "100%", textAlign: "center", borderBottom: "1px solid #9E9E9E", lineHeight: " 0.1em", margin: "10px 0 20px"}}>
                <span style={{background:"#f3f3f3", padding:"0 10px"}}> Or </span>
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
          {this.state.barClicked && 
            <ScrollableAnchor id={'causeInfo'}>
              <div id="causeInfo" style={{width:"80vw"}}>
                
                <p className="h4-responsive">Here's more about <strong>{this.state.causeName}</strong> in <strong>{valueLocation}</strong>:</p>
                <p className="small" style={{color: "#616161"}}>
                  To see details of another cause, click on a bar in the graph above
                </p>
                
                {/* infographics of local cause detailed info  */}
                <div className="row d-flex flex-column align-items-center justify-content-center p-4 mt-2 mb-4 text-white" style={{background:"#00b8d4"}}>
                  
                  <img src={totalIncome} alt="donations and grants received by this local cause" className="mb-3"/>
                  <h5><span className="font-weight-bold">{this.state.causeName}</span> in <span className="font-weight-bold">{valueLocation}</span> received</h5>
                  <h2 className="font-weight-bold">${causeTotalWithCommas}</h2>
                  in 2016*
                  <p className="mt-3 h5-responsive">{causesByLocation.length - this.state.causeAmtRank} out of {causesByLocation.length} causes there received more.</p>
                  
                  <hr className="my-3 mx-5 w-100" style={{border:"1px solid #E0E0E0"}}/>
                  
                  <div className="row d-flex align-items-center justify-content-center w-100">
                    <div className="col-3 d-flex flex-column align-items-center justify-content-center text-center my-3">
                        <img src={people} alt="people" className="mb-3"/>
                        <h4 className="font-weight-bold">${causeDonationsWithCommas}</h4>
                        <span>Donations & bequests</span>
                    </div>
                    <div style={{borderLeft: "thick solid #ff0000"}}></div>
                    <div className="col-3 d-flex flex-column align-items-center justify-content-center text-center my-3">
                        <img src={government} alt="government" className="mb-3"/>
                        <h4 className="font-weight-bold">${causeGrantsWithCommas}</h4>
                        <span>Government grants</span>
                    </div>
                  </div>

                  <hr className="my-3 mx-5 w-100" style={{border:"1px solid #E0E0E0"}}/>

                  <div className="row d-flex align-items-center justify-content-center">
                      <img src={charity} alt="care" className="mx-3 my-3"/>
                      <div className="col d-flex flex-column align-items-center justify-content-center">
                        <p>
                          {this.state.causeCharityCount !== 1 && <span>
                              <span className="font-weight-bold h4-responsive">
                                {this.state.causeCharityCount} charities{" "}
                              </span>
                              support
                            </span>}
                          {this.state.causeCharityCount === 1 && <span>
                              <span className="font-weight-bold h4-responsive">
                                {this.state.causeCharityCount} charity{" "}
                              </span>
                              supports
                            </span>}
                          &nbsp;{this.state.causeName} in {valueLocation}.
                        </p>
                        <button className="btn btn-success" type="button" onClick={this.handleOnClickToSearch}>
                          See complete charity list
                        </button>
                      </div>
                  </div>
                </div>

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
              </div>
            </ScrollableAnchor>
          }
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

      </div>
    );
  }
}

export default DashboardAct;

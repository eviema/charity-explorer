import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router';
import Select from 'react-select';
import { Breadcrumb, BreadcrumbItem, 
      Popover, PopoverBody, PopoverHeader, 
      Tooltip, } from "mdbreact";
import Plot from 'react-plotly.js';
import Collapsible from 'react-collapsible';
import { Link, Element, scroller } from 'react-scroll';
import spinner from '../assets/spinner.gif';
import causePageTopBackground from '../assets/causePageTopBackground.jpg';
import totalIncome from '../assets/totalIncome.png';
import government from '../assets/government128.png';
import people from '../assets/people128.png';
import charity from '../assets/charity128.png';
import QA from '../assets/QA.png';
import balance from '../assets/balance.png';
import balanceSm from '../assets/balanceSm.png';
import ScrollUpButton from 'react-scroll-up-button';
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
      // causeAmtRank: 0,
      barClicked: false,
      loading: false,
      redirecting: false,
      isMobileDevice: false,
    };
    this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
    this.handleClickOnCauseBar = this.handleClickOnCauseBar.bind(this);
    this.handleOnClickToSearch = this.handleOnClickToSearch.bind(this);
  }

  async componentDidMount() {

    window.scrollTo(0, 0);

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

    // if a cause card is clicked on Landing, take user to cause details
    if (this.props.location.state !== undefined) {
      await this.setState({
        causeName: this.props.location.state.causeName,
        barClicked: true
      });

      const barData = { name: this.state.causeName};
      await this.handleClickOnCauseBar(barData);

      scroller.scrollTo('causeInfo', {
        duration: 600,
        delay: 1600,
        smooth: true,
        offset: -100,
      })

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

  handleClickOnCauseBar(data) {

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
    
    this.setState({
        barClicked: true,
        causeName: causeClickedName,
        causeCharityCount: this.state.causesByLocation[causeIndex].charityCount,
        causeDonations: this.state.causesByLocation[causeIndex].amtDonations,
        causeGrants: this.state.causesByLocation[causeIndex].amtGrants,
        // causeAmtRank: causeIndex + 1,
    }); 
    
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

    // causes 
    var { causesByLocation } = this.state;
    var causeNames = causesByLocation.map(entry => {return entry['name']}),
        causesDonations = causesByLocation.map(entry => {return entry['amtDonations']}),
        causesGrants = causesByLocation.map(entry => {return entry['amtGrants']});

    // quick summary on top of plots
    if (causesByLocation.length !== 0) {
      var causeRecvLeast = causesByLocation[0],
          causeRecvMost = causesByLocation[causesByLocation.length-1],
          causeRecvLeastAmtWithCommas = (causeRecvLeast.amtDonations + causeRecvLeast.amtGrants).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          causeRecvMostAmtWithCommas = (causeRecvMost.amtDonations + causeRecvMost.amtGrants).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // plot    
    var traceBar1Donations = {
      x: causesDonations,
      y: causeNames,
      type: 'bar',
      name: "Donations (A$)",
      orientation: 'h',
      marker: {color: '#26C6DA'},
      hoverinfo: 'x+y',
    };
    var traceBar2Grants = {
      x: causesGrants,
      y: causeNames,
      type: 'bar',
      name: "Grants (A$)",
      orientation: 'h',
      marker: {color: '#8BC34A'},
      hoverinfo: 'x+y',
    };

    var plotData = [traceBar1Donations, traceBar2Grants];
    var plotLayout = {
      xaxis: {
        side: "top",
        showgrid: false,
        domain: [0.3, 1.0],
        type: 'log',
      },
      yaxis: {
        showgrid: false,
        autorange: 'reversed',
      }, 
      legend: {
        orientation: "h",
        xanchor: "center",
        yanchor: "top",
        traceorder: "normal",
        x: 0.5,
        y: 1.2,
      },
      barmode: 'stack',
      autosize: true,
      margin: {
        l: 150,
        r: 30,
        b: 30,
        t: 30,
        pad: 4
      }
    };
   
    // redirect to charity search
    if (this.state.searchCharityClicked) {
        return (
            <Redirect to={{
                pathname: '/home',
                state: {
                    cause: {
                      value: this.state.causeName,
                      label: this.state.causeName
                    },
                    location: {
                      value: valueLocation,
                      label: valueLocation
                    },
                    isSearchClicked: true,
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
        <div className="row d-flex align-items-center mx-1 py-1 px-2 border-bottom border-white text-white">
          <span>{subtype["Subtype_Name"]}</span>
          <i className="fa fa-angle-down fa-lg ml-auto"></i>
        </div>;
      
      var triggerWhenOpen = 
        <a className="row d-flex align-items-center mx-1 py-1 px-2 text-white">
          <span>{subtype["Subtype_Name"]}</span>
          <i className="fa fa-angle-up fa-lg ml-auto"></i>
        </a>;

      return (
        <li key={subtype["_id"]} className="mx-auto" style={{color: "#fafafa", width: "80%"}}>
          <Collapsible trigger={triggerWhenClosed}
                      triggerWhenOpen={triggerWhenOpen}
                      transitionTime={200}>
            <div className="border border-white rounded-top mx-3" style={{background: "#fafafa", color:"#424242"}}>
              <p className="m-2">{subtype["Subtype_Desc"]}</p>
              <p className="m-2 font-italic">
                <strong>Example: </strong>
                {subtype["Example"]}
              </p>
            </div>  
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
            height: "40vh",
        } 
      : {
            background: `url(${causePageTopBackground})`,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "40vh",
        }
    
    return (
      <div className="container-fluid" style={{ padding: "0", background: "#F3F3F3"}}>
        <ScrollUpButton />
        <Breadcrumb className="small mb-0">
          <BreadcrumbItem><a href="/home"><i className="fa fa-home" /></a>
          </BreadcrumbItem>
          <BreadcrumbItem active>Explore charitable causes</BreadcrumbItem>
        </Breadcrumb>

        {/* title: causes in location */}
        <div className="row d-flex align-items-center justify-content-center py-4 px-2 text-white" style={titleRowStyle}>
          <p className="col-11 col-sm-10 col-md-8 col-lg-8 col-xl-8 text-center" style={{textShadow: "1px 1px 8px #212121"}}>
            <span className="h1-responsive font-weight-bold">
              Which cause matters to you?
            </span> 
            <br />
            <span className="h5-responsive">
              Discover charitable causes supported by charities in your suburb
            </span>
          </p>
        </div>

        {/* change location */}
        <div className="row d-flex flex-column align-items-center justify-content-center py-4 mx-4">
          <p className="h4-responsive text-center">
            Select the suburb you'd like to explore further: 
          </p>

          <div className="col col-10 col-sm-6 col-md-6 col-lg-5 col-xl-4">
            <Select name="location"
              placeholder="Select suburb..."
              value={valueLocation}
              onChange={this.handleInputChangeOfLocation}
              options={this.state.locationsAll} />
          </div>
        </div>

        <hr className="mx-4" />

        <div style={{position:"relative"}}>
          {/* loading - section overlay */}
          { this.state.loading && 
            <div style={{position: 'absolute', top: '0', bottom: '0', left: '0', right: '0', background:"rgba(255, 255, 255,0.7)", zIndex:"2", cursor:"pointer"}}
                  className="d-flex justify-content-center pt-5">
              <span className="h3-responsive">Updating...</span>
              <img src={spinner} alt="loading..." style={{ height: 30, paddingLeft: 30 }} />
            </div>
          }
          
          <div className="row d-flex flex-column align-items-center justify-content-center" >
            
            {/* quick summary of causes in current location */}
            <div className="text-center mx-2 py-2" style={{background: "#fff", width:"90vw"}}>
              <img src={balanceSm} alt="smaller balance scale" className="img-responsive d-block d-sm-none mt-3 mx-auto"/>
              <p className="h3-responsive my-3">In <strong>{valueLocation}</strong>,</p>
              <div className="row d-flex align-items-center justify-content-center mb-3">
                
                <div className="col col-11 col-sm-3">
                  {/* <i className="fa fa-hand-holding-usd fa-lg" style={{color:"#E57373"}}></i>
                  <br /> */}
                  {causesByLocation.length > 0 && 
                    <span>
                      <Link to="causeInfo" spy={true} smooth={true} offset={-100} duration={400}>
                        <Tooltip 
                            placement="top" tag="div" component="button" 
                            componentClass="btn btn-link p-0 mb-1 mt-2"
                            tooltipContent="Click to learn more"> 
                              <div onClick={() => this.handleClickOnCauseBar({name: `${causeRecvLeast.name}`})}>
                                <strong className="h3-responsive font-weight-bold" style={{color: "#FFA000"}}>
                                  {causeRecvLeast.name}
                                </strong>
                                <i className="fa fa-question-circle ml-1" style={{color: "#757575"}}></i>
                              </div>
                        </Tooltip>
                      </Link>
                      received the <br />
                      <strong className="h3-responsive font-weight-bold" style={{color: "#FFA000"}}>least</strong> <br />
                      donations and grants: <br />
                      <strong className="h3-responsive font-weight-bold" style={{color: "#FFA000"}}>${causeRecvLeastAmtWithCommas}</strong>.
                    </span>
                  }
                </div>
                <img src={balance} alt="balance scale" className="img-responsive d-none d-sm-block"/>
                <div className="col col-11 col-sm-3 mt-3">
                  {/* <i className="fa fa-hand-holding-usd fa-lg" style={{color:"#E57373"}}></i>
                  <i className="fa fa-hand-holding-usd fa-lg" style={{color:"#E57373"}}></i>
                  <i className="fa fa-hand-holding-usd fa-lg mr-3" style={{color:"#E57373"}}></i>
                  <br /> */}
                  {causesByLocation.length > 0 && 
                    <div>
                      <Link to="causeInfo" spy={true} smooth={true} offset={-100} duration={400}>
                        <Tooltip 
                            placement="top" tag="div" component="button" 
                            componentClass="btn btn-link p-0 mb-1 mt-2"
                            tooltipContent="Click to learn more"> 
                              <div onClick={() => this.handleClickOnCauseBar({name: `${causeRecvMost.name}`})}>
                                <strong className="h3-responsive font-weight-bold" style={{color: "#7CB342"}}>
                                  {causeRecvMost.name}
                                </strong>
                                <i className="fa fa-question-circle ml-1" style={{color: "#757575"}}></i>
                              </div>
                        </Tooltip>
                      </Link>
                      received the <br />
                      <strong className="h3-responsive font-weight-bold" style={{color: "#7CB342"}}>most</strong> <br />
                      donations and grants: <br />
                      <strong className="h3-responsive font-weight-bold" style={{color: "#7CB342"}}>${causeRecvMostAmtWithCommas}</strong>.
                    </div>
                  }
                </div>
              </div>
            </div>

            {/* graph of causes in location */}
            <div id="causesGraph" className="row d-flex align-items-stretch justify-content-center py-2 mx-4">
              
              <p className="h3-responsive mt-5 mx-2 text-center">Here are more charitable causes in <strong>{valueLocation}</strong>:</p>
              
              <p className="col-12 text-center mx-2">
                Click on a bar in the graph to see details of
                a cause, or if you are ready, 
                <button className="btn btn-outline-info btn-sm" type="button" onClick={this.handleOnClickToSearch}>
                  Search for charities in 
                  { valueLocation !== "" && this.state.loading && 
                    <span> ... </span>}
                  {valueLocation !== "" && !this.state.loading && 
                    <span> {valueLocation} </span>}
                </button>
              </p>
              <Link to="causeInfo" spy={true} smooth={true} offset={-100} duration={400}>
                <Plot 
                    data={plotData}
                    layout={plotLayout}
                    style={{width: "90vw", height: "50vh"}}
                    onClick={this.handleClickOnCauseBar}
                    className="small"
                />
              </Link>
              
              <small className="mt-2 mx-2 text-center">
                <small>
                  Sources:&nbsp;&nbsp;
                  <a href="https://data.gov.au/dataset/acnc2016ais/resource/b4a08924-af4f-4def-96f7-bf32ada7ee2b" target="_blank" rel="noopener noreferrer">
                    1. ACNC 2016* Annual Information Statement Data
                  </a>&nbsp;&nbsp;&nbsp;&nbsp;
                  <a href="https://data.gov.au/dataset/acnc-register" target="_blank" rel="noopener noreferrer">
                    2. ACNC Registered Charities
                  </a>
                </small>
              </small>

            </div>

          </div>
                    
        </div>

        {
          this.state.barClicked && <hr className="mx-4" />
        }
              
        {/* infographics - details info of cause in location */}
        <Element name="causeInfo" className="element"></Element>
        <div id="causeInfo" className="element row d-flex align-items-center justify-content-center">
          
          {this.state.barClicked &&      
            <div className="py-3 mb-2" style={{width:"80vw"}}>
              
              <p className="h3-responsive">Here's more about <strong>{this.state.causeName}</strong> in <strong>{valueLocation}</strong>:</p>
              <p style={{color: "#616161"}}>
                To see details of another cause, <Link to="causesGraph" spy={true} smooth={true} offset={-100} duration={400}><u><strong>click on a bar in the graph above</strong></u></Link>
              </p>

              {/* cause subtypes */}
              <div className="row d-flex flex-column align-items-center justify-content-center p-4 mt-2 mb-4 text-white" style={{background:"#00BCD4", borderRadius: "5px",}}>
                    
                <div className="row d-flex align-items-center justify-content-center mx-4 text-center">
                  <img src={QA} alt="cause general info" className="mr-3"/>
                  <h2>What is <span className="font-weight-bold">"{this.state.causeName}"?</span></h2>
                </div>

                <p className="mb-3 w-100 text-center">
                  <span className="font-weight-bold h4-responsive">{this.state.causeCurrentDetails.length}</span>&nbsp;
                  {this.state.causeCurrentDetails.length === 1 && <span>
                      subcategory{" "}
                    </span>}
                  {this.state.causeCurrentDetails.length !== 1 && <span>
                      subcategories{" "}
                    </span>}
                  of work:
                </p>

                <ul className="list-unstyled mb-0">{renderCauseSubtypes}</ul>

              </div>
              
              {/* detailed financial info */}
              <div className="row d-flex flex-column align-items-center justify-content-center p-4 mt-2 mb-4 text-white" style={{background:"#00b8d4", borderRadius: "5px",}}>
                                
                {/* total received */}
                <img src={totalIncome} alt="donations and grants received by this local cause" className="mb-3"/>
                <h5 className="text-center"><span className="font-weight-bold">{this.state.causeName}</span> in <span className="font-weight-bold">{valueLocation}</span></h5>
                <h6>received</h6>
                <h2 className="font-weight-bold">${causeTotalWithCommas}</h2>
                <Link to="why2016" spy={true} smooth={true} offset={-10} duration={400}>
                  <small className="p-2 hoverable">in 2016*</small>
                </Link>
                                                
                {/* how much from donations, how much from grants */}
                <div className="row d-flex align-items-center justify-content-center w-100">
                  <div className="col col-12 col-sm-5 col-md-5 d-flex flex-column align-items-center justify-content-center text-center my-3">
                      <img src={people} alt="people" className="mb-3"/>
                      <h4 className="font-weight-bold">${causeDonationsWithCommas}</h4>
                      <span>Donations & bequests</span>
                  </div>
                  <div style={{borderLeft: "thick solid #ff0000"}}></div>
                  <div className="col col-12 col-sm-5 col-md-5 d-flex flex-column align-items-center justify-content-center text-center my-3">
                      <img src={government} alt="government" className="mb-3"/>
                      <h4 className="font-weight-bold">${causeGrantsWithCommas}</h4>
                      <span>Government grants</span>
                  </div>
                </div>
                
              </div>

              {/* charities for the cause in the suburb */}
              <div className="row d-flex flex-column align-items-center justify-content-center p-4 mt-2 mb-4 text-white" style={{background:"#00BFA5", borderRadius: "5px",}}>
                
                <img src={charity} alt="care" className="my-3"/>
                <p className="text-center">
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
          }
          
        </div>

        <hr className="mx-4" />

        {/* why 2016? */}
        <div id="why2016">        
          <Popover component="button" placement="right" popoverBody="*Why 2016?" className="btn btn-link btn-xs mx-5 mb-4" arrowClass="strzala">
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

      </div>
    );
  }
}

export default DashboardAct;

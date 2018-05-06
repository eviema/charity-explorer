import React, { Component } from "react";
import axios from 'axios';
import Select from 'react-select';
import { Redirect } from "react-router";
import { Card, CardBody, CardImage, CardTitle, CardText, } from "mdbreact";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-scroll';
import landingBackground from "../assets/landingBackground.jpg";
import local from '../assets/local.jpg';
import agedCare from '../assets/cause.jpg';
import finance from '../assets/finance.jpg';
// import review from '../assets/review.jpg';
import magnifyingGlass from "../assets/landingMagnify.png";
import ScrollUpButton from "react-scroll-up-button";

function CarouselPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, left: "5%", zIndex: "1", textShadow: "1px 1px 4px #212121", }}
      onClick={onClick}
    />
  );
}

function CarouselNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, right: "5%", textShadow: "1px 1px 4px #212121", }}
      onClick={onClick}
    />
  );
}

class Landing extends Component {
  constructor(props) {
    super(props);

    const causeCurrent = props.location.state !== undefined 
    ? props.location.state.cause : {};

    const locationCurrent = props.location.state !== undefined
    ? props.location.state.location : {};

    const councilCurrent = props.location.state !== undefined
    ? props.location.state.council : '';

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

    const isSearchClickedProp = props.location.state !== undefined
    ? props.location.state.isSearchClicked : false;

    this.state = {
      cause: causeCurrent,
      location: locationCurrent,
      causes: [],
      locations: [],
      council: councilCurrent,
      charities: [],
      doneCharitySearch: false,
      doneCharitySearchByCouncil: false,
      sortByConditions: conditions,
      sortByCondCurrent: {},
      loading: false,
      isCouncilEmptyOfChar: false,
      isSearchClicked: isSearchClickedProp,
      isExploreCausesClicked: false,
      isCauseCardClicked: false,
      causeClicked: '',
      isMobileDevice: false,
    };

    this.handleInputChangeOfCause = this.handleInputChangeOfCause.bind(this);
    this.handleInputChangeOfLocation = this.handleInputChangeOfLocation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleOnClickToExplore = this.handleOnClickToExplore.bind(this);
    this.handleOnClickToCause = this.handleOnClickToCause.bind(this);
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
    
    if (this.state.cause.value !== undefined 
      && this.state.location.value !== undefined
      && this.state.isSearchClicked) {
      this.handleSubmit();
    }
    
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({
      isMobileDevice: window.innerWidth <= 576
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
              isCouncilEmptyOfChar: false,
              council: '',
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

                              // if there is NO charity of that cause in that council
                              if (this.state.charities.length === 0) {
                                this.setState({
                                  doneCharitySearch: false,
                                  isCouncilEmptyOfChar: true,
                                  loading: true
                                });

                                axios.get('/api/charitiesByCause/' + this.state.cause.value)
                                    .then((res) => {
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
        
                                      this.setState({
                                          charities: charitiesSortedByCharityUsePerc,
                                          sortByCondCurrent: {
                                              value: 'percUseHigh',
                                              label: '% of expenses for charitable use (High - Low)'
                                          },
                                          doneCharitySearch: true,
                                          loading: false
                                      });
                                    })
                                    .catch(function(e) {
                                      console.log("ERROR", e);
                                    });

                              }
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

  handleOnClickToExplore = () => {
    this.setState({
      isExploreCausesClicked: true
    });
  };

  handleOnClickToCause(causeName) {
    this.setState({
      causeClicked: causeName,
      isCauseCardClicked: true,
    });
  };

  render() {
    if (this.state.isExploreCausesClicked) {
      return <Redirect push to="/charities/dashboardAct" />;
    }

    if (this.state.doneCharitySearch && this.state.charities.length > 0) {
      return (
          <Redirect push to={{
              pathname: "/charitySearchResults",
              state: {
                  cause: this.state.cause,
                  location: this.state.location,
                  council: this.state.council,
                  charities: this.state.charities,
                  isCouncilEmptyOfChar: this.state.isCouncilEmptyOfChar,
              }
          }} />
      );
    }

    if (this.state.isCauseCardClicked) {
      return (
          <Redirect to={{
              pathname: '/charities/dashboardAct',
              state: {
                  causeName: this.state.causeClicked
              }
          }}/>
      );
    }

    var imgStyle = this.state.isMobileDevice
      ? {
          backgroundImage: `url(${landingBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "scroll",
          backgroundPosition: "bottom",
          height: "70vh",
          width: "100vw",
          fontSize: ".9em",
          textShadow: "1px 1px 8px #212121",
        }
      : {
          backgroundImage: `url(${landingBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "bottom",
          height: "55vh",
          width: "100vw",
          textShadow: "1px 1px 8px #212121"
        };

    var causeCardStyle = {
      position: "absolute",
      bottom: "0",
      background: "rgba(236, 239, 241, 0.85)",
      cursor:'pointer'     
    };

    var { cause } = this.state;
    var valueCause = cause && cause.value;

    var { location } = this.state;
    var valueLocation = location && location.value;

    var settings = {
      autoplay: true,
      dots: true,
      infinite: true,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1,
      pauseOnDotsHover: true,
      pauseOnFocus: true,
      prevArrow: <CarouselPrevArrow />,
      nextArrow: <CarouselNextArrow />,
    };

    return (
      <div className="container-fluid p-0">
        <ScrollUpButton />
        {/* top of landing page */}
        <div
          className="d-flex flex-column align-items-center justify-content-center text-center white-text p-4"
          style={imgStyle}>
          <p className="h1-responsive font-weight-bold mt-4">
            Think Globally, Donate Locally
          </p>
          <span className="h4-responsive mt-1 d-none d-sm-block" style={{borderBottom: "5px solid #2bbbad"}}>
            Discover local charities that support the cause you love
          </span>
          <span className="h4-responsive mt-1 d-block d-sm-none" style={{borderBottom: "5px solid #2bbbad"}}>
            Discover local charities 
          </span>
          <span className="h4-responsive mt-1 d-block d-sm-none" style={{borderBottom: "5px solid #2bbbad"}}>
            that support the cause you love
          </span>

        </div>

        {/* search box */}
        <div id="searchBox" className="d-flex flex-column align-items-center justify-content-center py-5">
          <p className="text-center mb-3 h5-responsive font-weight-bold mx-5" style={{color:"#616161"}}>
            Enter your location and preferred cause to find local charities
          </p>
          <div className="row col col-12 d-flex align-items-center justify-content-center">
            <Select name="location"
              placeholder="eg. Melbourne VIC 3000"
              value={valueLocation}
              className="col col-10 col-sm-6 col-md-4 col-lg-3 mb-1 px-1 border-0"
              onChange={this.handleInputChangeOfLocation}
              options={this.state.locations} />
            <Select name="cause"
              placeholder="eg. Animal protection"
              value={valueCause}
              className="col col-10 col-sm-6 col-md-4 col-lg-3 mb-1 px-1 border-0"
              onChange={this.handleInputChangeOfCause}
              options={this.state.causes} />
            <div className="col col-6 col-sm-4 col-md-4 col-lg-3 mx-2 d-flex justify-content-center"
              onClick={this.handleSubmit} 
              onKeyPress={this.handleKeyPress}>
              <a className="btn btn-success">
                {!this.state.loading && <span>Find charities</span>}
                {this.state.loading && <span>Loading...</span>}
              </a>
            </div>
            {/* if cause or location not specified by user, display message */}
            {
                this.state.doneCharitySearch && this.state.charities.length === 0 &&
                (valueCause === undefined || valueLocation === undefined) && 
                <h6 className="col-12 d-flex justify-content-center">
                    <span className="text-white p-2 mx-2" style={{background: "#d50525", borderRadius: "5px",}}>
                      Please choose a cause and a location for us to find the right charity for you!
                    </span>
                </h6>
            }
            
            <u className="col-12 d-flex justify-content-center small" style={{color:"#616161"}}>
              <Link to="exploreCauses" spy={true} smooth={true} offset={-10} duration={400} className="">
                Haven't decided on the cause?
              </Link>
            </u>
            
          </div>
        </div>

        {/* charity intro */}
        <div
          id="findCharity"
          className="row d-flex align-items-center justify-content-center text-center py-5"
          style={{ color: "#839094", background: "#f8f8f8" }}>
          <div className="col-12">
            <img
              src={magnifyingGlass}
              alt="magnifying glass"
              className="py-3"/>
            <p className="h3-responsive" style={{ color: "#616161", }}>Find the right charity near you</p>
            <p className="h6-responsive px-3">
              Have a cause you want to support but not sure which local charity
              to go to? <br />
              Wondering if a charity has been making good use of
              donations?
            </p>
            <Link to="searchBox" spy={true} smooth={true} offset={-5} duration={400} className="col-12 d-flex justify-content-center">
              <span className="btn btn-outline-info">Start searching</span>
            </Link>
          </div>
          
          <div className="col col-12 col-sm-10 col-md-9 col-lg-8 col-xl-6 text-left my-3">          
            <Slider {...settings}>
              <div>               
                <Card reverse>
                    <CardImage className="img-fluid" src={local} />
                    <CardBody style={causeCardStyle}>
                        <CardTitle>In your suburb</CardTitle>
                        <CardText>
                          It's easy to search for local charities that support a cause.
                          Don't worry if there is none - we'll show you
                          the charities in other suburbs near you.
                        </CardText>
                    </CardBody>
                </Card> 
              </div>
              <div>
                <Card reverse>
                    <CardImage className="img-fluid" src={agedCare} />
                    <CardBody style={causeCardStyle}>
                        <CardTitle>For your cause</CardTitle>
                        <CardText>
                          Only the charities that support your cause as their main
                          activity will be shown. You can also do additional
                          filtering, e.g. by target populations.
                        </CardText>
                    </CardBody>
                </Card>
              </div>
              <div>
                <Card reverse>
                    <CardImage className="img-fluid" src={finance} />
                    <CardBody style={causeCardStyle}>
                        <CardTitle>Financially transparent</CardTitle>
                        <CardText>
                          You can check how much each charity gets from
                          donations and grants, versus how much of the charity's 
                          expenses goes to charitable use.
                        </CardText>
                    </CardBody>
                </Card>
              </div>{/* 
              <div>
                <Card reverse>
                    <CardImage className="img-fluid" src={review} />
                    <CardBody>
                        <CardTitle>Reviewed by donors</CardTitle>
                        <CardText>
                          See what your fellow donors have to say about a charity.
                          You can also share your experience of donating to help
                          others with their decisions.
                        </CardText>
                    </CardBody>
                </Card>
              </div> */}
            </Slider>
          </div>
        </div>

        {/* causes  */}
        <div id="exploreCauses" className="row d-flex flex-column justify-content-center pt-5">
        
          {/* cause intro title */}
          <div className="mb-3 mx-4 px-2">
            <p className="text-center h3-responsive" style={{ color: "#616161",}}>
              Which charitable cause do you feel connected to?
            </p>
          </div>

          {/* 6 cause example cards */}
          <div className="row d-flex justify-content-center">
            <Card
              cascade
              className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3 hoverable"
              onClick={() => this.handleOnClickToCause("Animal protection")}>
              <CardImage
                className="img-fluid"
                src="https://images.unsplash.com/photo-1414445092210-ee1a2da44ad7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fc60cb957d2181ee66d78261b51b22ad&auto=format&fit=crop&w=1047&q=80"
              />
              <CardBody className="w-100 py-2 px-3" style={causeCardStyle}>
                <strong>Animal protection</strong>
                <CardText>e.g. return threatened species to the wild</CardText>
              </CardBody>
            </Card>
            
            <Card
              cascade
              className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3 hoverable"
              onClick={() => this.handleOnClickToCause("Employment and training")}>
              <CardImage
                className="img-fluid"
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1005f3d059e15847f5b8e818aafe7b51&auto=format&fit=crop&w=1050&q=80"
              />
              <CardBody className="w-100 py-2 px-3" style={causeCardStyle}>
                <strong>Employment and training</strong>
                <CardText>e.g. connect skilled refugees to employers</CardText>
              </CardBody>
            </Card>
            
            <Card
              cascade
              className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3 hoverable"
              onClick={() => this.handleOnClickToCause("Housing activities")}>
              <CardImage
                className="img-fluid"
                src="https://images.unsplash.com/uploads/1412239183009c7733b23/085bfba0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=16f061ef74bcb2a07f6a22f5369ec58b&auto=format&fit=crop&w=1048&q=80"
              />
              <CardBody className="w-100 py-2 px-3" style={causeCardStyle}>
                <strong>Housing activities</strong>
                <CardText>e.g. help homeless people seek public housing</CardText>
              </CardBody>
            </Card>
            
            <Card
              cascade
              className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3 hoverable"
              onClick={() => this.handleOnClickToCause("Law and legal services")}>
              <CardImage
                className="img-fluid"
                src="https://images.unsplash.com/photo-1436450412740-6b988f486c6b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d9650eba888682af890003d78342a832&auto=format&fit=crop&w=1050&q=80"
              />
              <CardBody className="w-100 py-2 px-3" style={causeCardStyle}>
                <strong>Law and legal services</strong>
                <CardText>
                  e.g. free legal help for vulnerable young people
                </CardText>
              </CardBody>
            </Card>
            
            <Card
              cascade
              className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3 hoverable"
              onClick={() => this.handleOnClickToCause("Mental health and crisis intervention")}>
              <CardImage
                className="img-fluid"
                src="https://images.unsplash.com/photo-1473679408190-0693dd22fe6a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=07f30b88f84b35ccd38d0645732f7659&auto=format&fit=crop&w=1050&q=80"
              />
              <CardBody className="w-100 py-2 px-3" style={causeCardStyle}>
                <strong>Mental health and crisis intervention</strong>
                <CardText>e.g. help children impacted by abuse</CardText>
              </CardBody>
            </Card>
            
            <Card
              cascade
              className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3 hoverable"
              onClick={() => this.handleOnClickToCause("Research")}>
              <CardImage
                className="img-fluid"
                src="https://images.unsplash.com/photo-1453847668862-487637052f8a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=71b0722e782981af817242fdda624736&auto=format&fit=crop&w=1055&q=80"
              />
              <CardBody className="w-100 py-2 px-3" style={causeCardStyle}>
                <strong>Research</strong>
                <CardText>
                  e.g. raise funds for cancer research by shaving
                </CardText>
              </CardBody>
            </Card>
          </div>

          {/* see more causes button */}
          <div className="text-center mt-3 mb-5">
            <a
              className="btn btn-outline-default"
              onClick={this.handleOnClickToExplore}
            >
              See more in your local area
            </a>
          </div>

        </div>

      </div>
    );
  }
}

export default Landing;

import React, { Component } from "react";
import { Redirect } from "react-router";
import { Card, CardBody, CardImage, CardText } from "mdbreact";
import landingBackground from "../assets/landingBackground.jpg";
import magnifyingGlass from "../assets/landingMagnify.png";
import ScrollUpButton from "react-scroll-up-button";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExploreClicked: false,
      isEearchClicked: false,
      isCauseCardClicked: false,
      causeClicked: '',
      isMobileDevice: false
    };

    this.handleOnClickToExplore = this.handleOnClickToExplore.bind(this);
    this.handleOnClickToSearch = this.handleOnClickToSearch.bind(this);
    // this.handleOnClickToCause = this.handleOnClickToCause.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({
      isMobileDevice: window.innerWidth <= 768
    });
  }

  handleOnClickToExplore = () => {
    this.setState({
      isExploreClicked: true
    });
  };

  handleOnClickToSearch = () => {
    this.setState({
      isSearchClicked: true
    });
  };

  /* handleOnClickToCause(causeName) {
    this.setState({
      causeClicked: causeName,
      isCauseCardClicked: true,
    });
  }; */

  render() {
    if (this.state.isExploreClicked) {
      return <Redirect push to="/charities/dashboardAct" />;
    }

    if (this.state.isSearchClicked) {
      return <Redirect push to="/charitySearch" />;
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
          backgroundPosition: "center",
          height: "80vh",
          width: "100vw"
        }
      : {
          backgroundImage: `url(${landingBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          height: "85vh",
          width: "100vw"
        };

    var causeCardStyle = {
      position: "absolute",
      bottom: "0",
      background: "rgba(236, 239, 241, 0.85)",
      // cursor:'pointer'     
    };

    return (
      <div className="container-fluid">
        <ScrollUpButton />
        {/* top of landing page */}
        <div
          className="row d-flex align-items-center justify-content-start p-5"
          style={imgStyle}
        >
          <div className="pt-4 col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6">
            <div
              className="p-4 white-text"
              style={{ textShadow: "1px 1px 8px #212121" }}
            >
              <p className="h1-responsive font-weight-bold mt-4">
                Charity starts at home
              </p>
              <p className="h3-responsive">
                Explore charity work around your neighbourhood
              </p>
            </div>
            <a
              className="btn btn-default mt-2 mx-4"
              onClick={this.handleOnClickToExplore}
            >
              Get started
            </a>
          </div>
        </div>

        {/* what is DonateNow */}
        <div
          className="row d-flex align-items-center justify-content-center text-center py-5 px-4"
          style={{ color: "#839094", background: "#f5f9fb" }}
        >
          <p className="col-12 h4-responsive">What is DonateNow?</p>
          <p className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6 h6-responsive">
            DonateNow is an online information hub for Melburnians to explore
            local charitable causes, find charities nearby, and contact
            suitable charities to do their share.
          </p>
          <div className="row pt-4 d-flex align-items-center justify-content-center text-center">
            <div className="m-2 col-8 col-sm-6 col-md-3 col-lg-3 col-xl-3">
              <img
                src="https://images.unsplash.com/photo-1497030947858-3f40f1508e84?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c55e1e5d309a69171693ada3128a36f7&auto=format&fit=crop&w=1050&q=80"
                alt="contact"
                style={{
                  borderRadius: "50%",
                  maxHeight: "80%",
                  maxWidth: "80%"
                }}
              />
              <p className="font-weight-bold mt-4 mb-2">
                Explore charitable causes
              </p>
              <p>Choose a local cause that needs your attention</p>
            </div>
            <div className="m-2 col-8 col-sm-6 col-md-3 col-lg-3 col-xl-3">
              <img
                src="https://images.unsplash.com/45/eDLHCtzRR0yfFtU0BQar_sylwiabartyzel_themap.jpg?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2110dad38a593cd7986276d92748d27b&auto=format&fit=crop&w=1057&q=80"
                alt="contact"
                style={{
                  borderRadius: "50%",
                  maxHeight: "80%",
                  maxWidth: "80%"
                }}
              />
              <p className="font-weight-bold mt-4 mb-2">
                Find a charity nearby
              </p>
              <p>Search for the right charity around your location</p>
            </div>
            <div className="m-2 col-8 col-sm-6 col-md-3 col-lg-3 col-xl-3">
              <img
                src="https://images.unsplash.com/photo-1457317680121-ef12e98979e8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a41dc0dcd19e2358b1acb5e17b298aed&auto=format&fit=crop&w=1050&q=80"
                alt="contact"
                style={{
                  borderRadius: "50%",
                  maxHeight: "80%",
                  maxWidth: "80%"
                }}
              />
              <p className="font-weight-bold mt-4 mb-2">Contact the charity</p>
              <p>Contact the charity to discuss how you can help</p>
            </div>
          </div>
        </div>

        {/* cause intro title */}
        <div
          id="exploreCauses"
          className="row d-flex justify-content-center mt-5 mb-3 mx-4 px-2"
        >
          <p className="h4-responsive" style={{ color: "#839094" }}>
            Which charitable cause do you feel connected to?
          </p>
        </div>

        {/* 6 cause example cards */}
        <div className="row d-flex justify-content-center">
          <Card
            cascade
            className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3"
            // onClick={() => this.handleOnClickToCause("Animal protection")}
          >
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
            className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3"
            // onClick={() => this.handleOnClickToCause("Employment and training")}
          >
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
            className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3"
            // onClick={() => this.handleOnClickToCause("Housing activities")}
          >
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
            className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3"
            // onClick={() => this.handleOnClickToCause("Law and legal services")}
          >
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
            className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3"
            // onClick={() => this.handleOnClickToCause("Mental health and crisis intervention")}
          >
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
            className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3"
            // onClick={() => this.handleOnClickToCause("Research")}
          >
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
        <div className="row d-flex justify-content-center mt-3 mb-5">
          <a
            className="btn btn-outline-default"
            onClick={this.handleOnClickToExplore}
          >
            See more in your local area
          </a>
        </div>

        {/* charity intro */}
        <div
          id="findCharity"
          className="row d-flex align-items-stretch justify-content-center text-center py-5 px-4"
          style={{ color: "#839094", background: "#f5f9fb" }}
        >
          <div className="col-12 col-sm-10 col-md-4 col-lg-4 col-xl-4">
            <img
              src={magnifyingGlass}
              alt="magnifying glass"
              className="py-3"
            />
            <p className="h4-responsive">Discover the right charity for you</p>
            <p className="h6-responsive">
              Have a local cause you want to support but not sure which charity
              to go to? Wondering if a charity has been making good use of
              donations?
            </p>
            <a
              className="btn btn-outline-info"
              onClick={this.handleOnClickToSearch}
            >
              Click to start searching
            </a>
          </div>

          <div className="col-12 col-sm-10 col-md-6 col-lg-6 col-xl-6 text-left">
            <div className="row d-flex align-items-center justify-content-center ">
              <div className="col-12 col-sm-12 col-md-10 col-lg-6 col-xl-6 mt-4">
                <div className="row d-flex align-items-stretch justify-content-center ">
                  <div className="col-1">
                    <i
                      className="fa fa-map-pin fa-lg cyan-text"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="col-10">
                    <p className="font-weight-bold mb-2">In your suburb</p>
                    <p className="small">
                      It's easy to search for charities that support a cause in
                      your suburb. Don't worry if there is none - we'll show you
                      the charities in other suburbs near you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-10 col-lg-6 col-xl-6 mt-4">
                <div className="row d-flex align-items-stretch justify-content-center ">
                  <div className="col-1">
                    <i className="fa fa-heartbeat fa-lg cyan-text" />
                  </div>

                  <div className="col-10">
                    <p className="font-weight-bold mb-2">For your cause</p>
                    <p className="small">
                      Only the charities that support your cause as their main
                      activity will be displayed. You can also do additional
                      filtering, e.g. by target populations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row d-flex align-items-center justify-content-center">
              <div className="col-12 col-sm-12 col-md-10 col-lg-6 col-xl-6 mt-4">
                <div className="row d-flex align-items-stretch justify-content-center ">
                  <div className="col-1">
                    <i
                      className="fa fa-dollar-sign fa-lg cyan-text"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="col-10">
                    <p className="font-weight-bold mb-2">
                      Financially transparent
                    </p>
                    <p className="small">
                      You'll be able to check how much each charity gets from
                      donations and grants, versus how much of it reaches the
                      charity's beneficiaries.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-10 col-lg-6 col-xl-6 mt-4">
                <div className="row d-flex align-items-stretch justify-content-center ">
                  <div className="col-1">
                    <i
                      className="fa fa-comments fa-lg cyan-text"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="col-10">
                    <p className="font-weight-bold mb-2">Reviewed by donors</p>
                    <p className="small">
                      See what your fellow donors have to say about a charity.
                      You can also review your experience of donating which helps
                      others with their decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;

import React, { Component } from "react";
import { Redirect } from 'react-router';
import { Card, CardBody, CardImage, CardText } from 'mdbreact';
import landingBackground from '../assets/landingBackground.jpg';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      exploreClicked: false
    }
  }

  handleOnClickToExplore = () => {
    this.setState({
      exploreClicked: true
    });
  }

  render() {
    if (this.state.exploreClicked) {
      return <Redirect push to="/charities/dashboardAct" />;
    }

    var imgStyle = {
          backgroundImage: `url(${landingBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          height: "80vh",
        }
    
    var causeCardStyle = {
      position:"absolute", 
      bottom:"0", 
      background: "rgba(236, 239, 241, 0.85)"
    }


    return (

      <div className="container-fluid">
        
        <div className="row d-flex align-items-center justify-content-start p-5" style={imgStyle}>
          <div className="pt-4 col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6"> 
              <div className="p-4 white-text" style={{textShadow: "1px 1px 8px #212121"}}>
                <p className="h1-responsive font-weight-bold mt-4">Make a difference today</p>
                <p className="h3-responsive">Help charities around your neighbourhood</p>
              </div>   
              <a className="btn btn-default mt-2 mx-4" onClick={this.handleOnClickToExplore}>
                  Click to explore
              </a>
          </div>  
        </div>

        {/* 6 cause example cards */}
        <div className="row d-flex justify-content-center mt-5 mb-3 mx-4 px-2">
          <p className="h4-responsive" style={{color:"#839094"}}>Which charitable cause do you feel connected to?</p>
        </div>

        <div className="row d-flex justify-content-center">
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1414445092210-ee1a2da44ad7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fc60cb957d2181ee66d78261b51b22ad&auto=format&fit=crop&w=1047&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Animal protection</strong>
                    {/* <CardText>
                      e.g. return animals to the wild                      
                    </CardText> */}
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1005f3d059e15847f5b8e818aafe7b51&auto=format&fit=crop&w=1050&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Employment and training</strong>
                    {/* <CardText>
                      e.g.                       
                    </CardText> */}
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=47b4b88e2825332da6fb93898562051c&auto=format&fit=crop&w=1050&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Housing activities</strong>
                    {/* <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText> */}
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1436450412740-6b988f486c6b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d9650eba888682af890003d78342a832&auto=format&fit=crop&w=1050&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Law and legal services</strong>
                    {/* <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText> */}
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1473679408190-0693dd22fe6a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=07f30b88f84b35ccd38d0645732f7659&auto=format&fit=crop&w=1050&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Crisis intervention</strong>
                    {/* <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText> */}
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1453847668862-487637052f8a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=71b0722e782981af817242fdda624736&auto=format&fit=crop&w=1055&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Research</strong>
                    {/* <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText> */}
                </CardBody>
            </Card>
        </div>
          
        <div className="row d-flex justify-content-center mt-3 mb-5">
          <a className="btn btn-outline-default" onClick={this.handleOnClickToExplore}>
              See more charitable causes
          </a>
        </div>

        {/* how DonateNow helps */}
        <div className="row d-flex align-items-center justify-content-center text-center py-5 px-4" style={{color:"#839094", background:"#f5f9fb"}}>
          <p className="col-12 h4-responsive">What is DonateNow?</p>
          <p className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6 h6-responsive">
            DonateNow is an online information hub for Melburnians to explore charitable causes, find charities of interest nearby, and grab contact details of charities to "donate now". 
          </p>
          <div className="row pt-4 d-flex align-items-center justify-content-center text-center">
            <div className="m-2 col-8 col-sm-6 col-md-3 col-lg-3 col-xl-3">
              <img src="https://images.unsplash.com/photo-1497030947858-3f40f1508e84?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c55e1e5d309a69171693ada3128a36f7&auto=format&fit=crop&w=1050&q=80"
                  alt="contact"
                  style={{borderRadius: "50%", maxHeight:"80%", maxWidth: "80%"}} />
              <p className="font-weight-bold mt-4 mb-2">
                Explore charitable causes
              </p>
              <p>Choose a cause that has personal significance to you</p>
            </div>
            <div className="m-2 col-8 col-sm-6 col-md-3 col-lg-3 col-xl-3">
              <img src="https://images.unsplash.com/45/eDLHCtzRR0yfFtU0BQar_sylwiabartyzel_themap.jpg?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2110dad38a593cd7986276d92748d27b&auto=format&fit=crop&w=1057&q=80"
                  alt="contact"
                  style={{borderRadius: "50%", maxHeight:"80%", maxWidth: "80%"}} />
              <p className="font-weight-bold mt-4 mb-2">
                Find charities nearby
              </p>
              <p>Select your local area and search for charities</p>
            </div>
            <div className="m-2 col-8 col-sm-6 col-md-3 col-lg-3 col-xl-3">
              <img src="https://images.unsplash.com/photo-1457317680121-ef12e98979e8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a41dc0dcd19e2358b1acb5e17b298aed&auto=format&fit=crop&w=1050&q=80"
                  alt="contact"
                  style={{borderRadius: "50%", maxHeight:"80%", maxWidth: "80%"}} />
              <p className="font-weight-bold mt-4 mb-2">
                Contact charities
              </p>
              <p>Contact charities to discuss how you can help</p>
            </div>
          </div>
        </div>
        
      </div>
      
    );
  }
  
}

export default Landing;
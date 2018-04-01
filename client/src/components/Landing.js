import React, { Component } from "react";
import { Redirect } from 'react-router';
import { Card, CardBody, CardImage, CardText } from 'mdbreact';

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
      backgroundImage: "url(https://images.unsplash.com/photo-1415369629372-26f2fe60c467?ixlib=rb-0.3.5&s=4e3735cae3509bd20097c5ec61c32593&auto=format&fit=crop&w=634&q=80)",
      backgroundRepeat: "repeat-y",
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
        
        <div className="row d-flex align-items-center justify-content-end p-5" 
            style={imgStyle}>
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

        <div className="row d-flex justify-content-center mt-5">
          <p className="h4-responsive" style={{color:"#839094"}}>Which charitable cause do you feel connected to?</p>
          {/* 8 cause example cards */}
        </div>

        <div className="row d-flex justify-content-center">
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1414445092210-ee1a2da44ad7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fc60cb957d2181ee66d78261b51b22ad&auto=format&fit=crop&w=1047&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Animal Protection</strong>
                    <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText>
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1005f3d059e15847f5b8e818aafe7b51&auto=format&fit=crop&w=1050&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Employment and training</strong>
                    <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText>
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=47b4b88e2825332da6fb93898562051c&auto=format&fit=crop&w=1050&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Housing activities</strong>
                    <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText>
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1436450412740-6b988f486c6b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d9650eba888682af890003d78342a832&auto=format&fit=crop&w=1050&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Law and legal services</strong>
                    <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText>
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1473679408190-0693dd22fe6a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=07f30b88f84b35ccd38d0645732f7659&auto=format&fit=crop&w=1050&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Crisis intervention</strong>
                    <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText>
                </CardBody>
            </Card>
            <Card cascade className="m-1 p-0 col-11 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                <CardImage className="img-fluid" src="https://images.unsplash.com/photo-1453847668862-487637052f8a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=71b0722e782981af817242fdda624736&auto=format&fit=crop&w=1055&q=80"/>
                <CardBody className="w-100" style={causeCardStyle}>
                    <strong>Research</strong>
                    <CardText>
                      Lorem ipsum dolor sit amet.                      
                    </CardText>
                </CardBody>
            </Card>
        </div>
          
        <div className="row d-flex justify-content-center mt-3 mb-5">
          <a className="btn btn-outline-default" onClick={this.handleOnClickToExplore}>
              See more charitable causes
          </a>
        </div>
        
      </div>
      
    );
  }
  
}

export default Landing;
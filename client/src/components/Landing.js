import React, { Component } from "react";
import { Redirect } from 'react-router';

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
      backgroundPosition: "center",
      height: "100vh",
    }
    return (
      <div className="row d-flex align-items-center justify-content-end p-5" 
           style={imgStyle}>
        <div className="pt-4 col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6"> 
            <div className="p-4 white-text" style={{textShadow: "1px 1px 8px #212121"}}>
              <p className="h1-responsive font-weight-bold mt-4">Make a difference today</p>
              <p className="h3-responsive">Check out how you can help charities around your neighbourhood.</p>
            </div>   
            <a className="btn btn-default mt-2 mx-4" onClick={this.handleOnClickToExplore}>
                Click to explore charitable causes
            </a>
        </div>  
      </div>
    );
  }
  
}

export default Landing;
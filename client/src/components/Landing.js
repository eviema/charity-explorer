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
      backgroundImage: "url(https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9e3cd6ce6496c9c05cbf1b6cda8be0f9&auto=format&fit=crop&w=1050&q=80)",
      backgroundRepeat: "repeat-y",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
    }
    return (
      <div className="d-flex flex-column align-items-center justify-content-center p-5" 
           style={imgStyle}>
        <div className="m-2"> 
            <div className="h1-responsive pb-2 white-text" style={{textShadow: "1px 1px 8px #212121"}}>
              <span>A little goes a long way.</span><br />
              <span>Check out how you can help charities</span><br />
              <span>around your neighbourhood.</span><br />
            </div>   
            <a className="btn btn-default mt-3" onClick={this.handleOnClickToExplore}>
                Click to explore charitable causes
            </a>
        </div>  
      </div>
    );
  }
  
}

export default Landing;
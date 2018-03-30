import React, { Component } from "react";
import { Redirect } from 'react-router';
import { Button, View, Mask } from "mdbreact";

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
      backgroundImage: "url(https://images.unsplash.com/photo-1469398718052-b9d13df0d7c9?ixlib=rb-0.3.5&s=493aae8f396a54b911da2f8cb2806865&auto=format&fit=crop&w=1051&q=80)",
      backgroundRepeat: "repeat-y",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
    }
    return (
      <View>
        <img
          className="d-block w-100 img-fluid"
          style={imgStyle}
          alt=""
        />
        <Mask className="d-flex flex-column align-items-center justify-content-center p-5">
            <div className="m-2"> 
              <div className="h1-responsive pb-2 white-text" style={{textShadow: "1px 1px 8px #212121"}}>
                <span>A little goes a long way.</span><br />
                <span>Check out how you can help charities</span><br />
                <span>around your neighbourhood.</span><br />
              </div>   
              <Button className="mt-3" onClick={this.handleOnClickToExplore}>
                  Click to explore charitable causes
              </Button>
            </div>           
        </Mask>
      </View>
    );
  }
  
}

export default Landing;
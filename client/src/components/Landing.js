import React from "react";
import { Link } from "react-router-dom";
import { Button, View, Mask } from "mdbreact";

const Landing = () => {
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
      />
      <Mask className="flex-center">
        <div className="mx-5 h1-responsive pb-2 white-text d-flex flex-column justify-content-center" >
          <div style={{textShadow: "1px 1px 8px #212121"}}>
            <p>Want to donate to a charity in Melbourne</p>
            <p>but not sure which charitable cause to start with?</p>
          </div>   
          <Link to="/charities/dashboardAct">
            <Link color="cyan" className="btn btn-default" to="/charities/dashboardAct">
              Click to explore charitable causes in greater melbourne
            </Link>
          </Link>
        </div>
      </Mask>
    </View>
  );
};

export default Landing;
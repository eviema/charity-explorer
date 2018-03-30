import React from "react";

const Header = () => {
  if (window.location.pathname === "/") {
    return <div />;
  }
  var headerStyle =
    window.location.pathname === "/home"
      ? {
          position: "absolute",
          top: "0",
          zIndex: "10",
          background: "rgba(0, 0, 0, 0)",
          width: "100%",
          boxShadow: "none",
          fontWeight:"500"
        }
      : {
          background: "rgba(236,239,241)",
          fontWeight:"400"
      };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top" style={headerStyle}>
        <a className="navbar-brand h3-responsive" href="/home" style={{textShadow: "4px 2px 8px #FAFAFA", color: "#212121"}}>
            DonateNow
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0 h5-responsive" style={{textShadow: "4px 2px 8px #FAFAFA"}}>
                <li className="nav-item">
                    <a className="nav-link" href="/home">Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/charities/dashboardAct">Charitable causes</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/charitySearch">Charities</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/about">About</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/contact">Contact</a>
                </li>
            </ul>
        </div>
    </nav>
  );
};

export default Header;

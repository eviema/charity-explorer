import React, { Component } from "react";

class Header extends Component {

  render() {
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
            padding: "2rem"
          }
        : {
            background: "rgba(96, 125, 139,1)",
            padding: "1rem"
          };

    return (
        <header className="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar" style={headerStyle}>
            <a className="navbar-brand mr-2 mr-md-2" href="/home">DonateNow</a>
            <div className="navbar-nav-scroll">
                <ul className="navbar-nav bd-navbar-nav flex-row">
                    <li className="nav-item">
                        <a className="nav-link" href="/home">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/charities/dashboardAct">Charitable causes</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/charitySearch">Charities</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/contact">Contact</a>
                    </li>
                </ul>
            </div>
        </header>
    );
  }
}

export default Header;

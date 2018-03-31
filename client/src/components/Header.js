import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  Collapse,
  NavItem
} from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
        };
    this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.setState({
            collapse: !this.state.collapse,
        });
    }

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
          }
        : {
            background: "rgba(96, 125, 139,1)",
          };

    return (
        <Router>
            <Navbar dark expand="md" scrolling className="sticky-top" style={headerStyle}>
                <NavbarBrand href="/home">
                    <strong>DonateNow</strong>
                </NavbarBrand>
                { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                <Collapse isOpen = { this.state.collapse } navbar style={{background:"rgba(96, 125, 139,0.95)"}}>
                    <NavbarNav right>
                        <NavItem>
                            <a className="nav-link" href="/home">Home<span className="sr-only">(current)</span></a>
                        </NavItem>
                        <NavItem>
                            <a className="nav-link" href="/charities/dashboardAct">Charitable causes</a>
                        </NavItem>
                        <NavItem>
                            <a className="nav-link" href="/charitySearch">Charities</a>
                        </NavItem>
                        {/* <NavItem>
                            <a className="nav-link" href="/about">About</a>
                        </NavItem> */}
                        <NavItem>
                            <a className="nav-link" href="/contact">Contact</a>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        </Router>
    );
  }
}

export default Header;

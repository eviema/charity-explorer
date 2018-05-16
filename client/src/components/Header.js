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
import logo from '../assets/websiteLogo.png';

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
        var headerStyle =
        window.location.pathname === "/"
            ? {
                position: "absolute",
                top: "0",
                zIndex: "10",
                background: "rgba(0, 0, 0, 0)",
                width: "100%",
                boxShadow: "none",
                padding: "2rem",
            }
            : {
                background: "#546E7A",
                // borderBottom: "5px solid #2bbbad",
                padding: "1rem",
            };
        
        var navItemBackgroundStyle = 
            this.state.collapse
            ? {
                background:"#546E7A",
                padding: "1rem"
            }
            : {}

        return (
            <Router>
                <Navbar dark expand="md" scrolling className="sticky-top" style={headerStyle}>
                    <NavbarBrand href="/">
                        <img src={logo} alt="Home" className="img-responsive"/>
                        <strong>  DonateNow</strong>
                    </NavbarBrand>
                    { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                    <Collapse isOpen = { this.state.collapse } navbar style={navItemBackgroundStyle}>
                        <NavbarNav right>
                            <NavItem>
                                <a className="nav-link" href="/">Home<span className="sr-only">(current)</span></a>
                            </NavItem>
                            <NavItem>
                                <a className="nav-link" href="/causeExplorer">Charitable causes</a>
                            </NavItem>
                            <NavItem>
                                <a className="nav-link" href="/tipsForDonors">Tips for donors</a>
                            </NavItem>
                            <NavItem>
                                <a className="nav-link" href="/about">About</a>
                            </NavItem>
                            {/* <NavItem>
                                <a className="nav-link" href="/contact">Contact</a>
                            </NavItem> */}
                        </NavbarNav>
                    </Collapse>
                </Navbar>
            </Router>
        );
    }
}

export default Header;

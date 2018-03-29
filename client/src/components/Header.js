import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            dropdownOpen: false,
        };
    this.onClickCollapse = this.onClickCollapse.bind(this);
    this.toggle = this.toggle.bind(this);
    }
    
    onClickCollapse(){
        this.setState({
            collapse: !this.state.collapse,
        });
    }
    
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    
    render() {
        var headerStyle = {
            position:"absolute", 
            top:"0", 
            zIndex:"10",
            background: "transparent", 
            opacity: "0.85",
            width:"100%"
        }

        return (
            <Router>
                <Navbar color="#eceff1 blue-grey lighten-5" light expand="md" scrolling style={headerStyle}>
                    <NavbarBrand href="/home">
                        <strong>DonateNow</strong>
                    </NavbarBrand>
                    { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClickCollapse } />}
                    <Collapse isOpen = { this.state.collapse } navbar>
                        <NavbarNav className="ml-auto" right>
                        
                        <NavItem>
                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle nav caret>Features</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem href="/charities/dashboardAct">Explore charitable causes in Melbourne</DropdownItem>
                                <DropdownItem href="/charitySearch">Find the right charity to donate to</DropdownItem>
                            </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                        </NavbarNav>
                    </Collapse>
                </Navbar>
            </Router>
        );
    }
}

export default Header;

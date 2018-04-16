import React, { Component } from 'react';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem,
        Card, CardBody, CardImage, CardText, 
        Container, Row, Col, TabPane, TabContent, Nav, NavItem, NavLink } from 'mdbreact';   
import classnames from 'classnames';  
import smileFace from '../assets/smile.png'; 
import sadFace from '../assets/sad.png';

class Charity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ABN: this.props.match.params.ABN,
            name: '',
            regStatus: '',
            dgrStatus: '',
            size: '',
            desc: '',
            ppltns: [],
            streetAddLn1: '',
            streetAddLn2: '',
            suburb: '',
            postcode: '',
            cause: '',
            govGrants: 0,
            donationBequest: 0,
            ausUse: 0,
            allUse: 0,
            percAusUse: 0,
            activeItemClassicTabs1: '1',
        }
        this.toggleClassicTabs1 = this.toggleClassicTabs1.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/charity/${this.state.ABN}`)
                .then((res) => {
                    const charity = res.data;
                    var index = [];
                    for (var x in charity) {
                        index.push(x);
                    }
                    // set state ppltns (target populations)
                    var ppltnsMatched = [];
                    for (var i = 43; i <= 68; i++) {
                        var ppltn = index[i];
                        if (charity[ppltn] === 'Y') {
                            ppltn = ppltn.split('_').join(' ');
                            ppltnsMatched.push(ppltn); 
                        }
                    }

                    this.setState({
                        ABN: charity["ABN"],
                        name: charity["Charity_Name"],
                        regStatus: charity["Registration_Status"],
                        dgrStatus: charity["DGR_Status"],
                        size: charity["Charity_Size"],
                        desc: charity["Charity_activities_and_outcomes_helped_achieve_charity_purpose"],
                        ppltns: ppltnsMatched,
                        streetAddLn1: charity["Address_Line_1"],
                        streetAddLn2: charity["Address_Line_2"],
                        suburb: charity["Town_City"],
                        postcode: charity["Postcode"],
                        cause: charity["Main_Activity"],
                        govGrants: charity["Government_grants"],
                        donationBequest: charity["Donations_and_bequests"],
                        ausUse: charity["Grants_and_donations_made_for_use_in_Australia"],
                        allUse: charity["Total_expenses"],
                        percAusUse: charity["%_of_grants_and_donations_made_for_use_in_Australia"],
                    });
                })
                .catch(function(e) {
                    console.log("ERROR", e);
                });
    }

    toggleClassicTabs1(tab) {
        if (this.state.activeItemClassicTabs1 !== tab) {
          this.setState({
            activeItemClassicTabs1: tab,
          });
        }
      }

    render() {

        var { ABN, name, regStatus, dgrStatus, size, desc,
            streetAddLn1, streetAddLn2, suburb, postcode, 
            cause, govGrants, donationBequest,
            ausUse, allUse, percAusUse } = this.state;
        
        govGrants = govGrants.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        donationBequest = donationBequest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        ausUse = ausUse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        allUse = allUse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var sizeIcon = <span></span>;
        switch (size) {
            case 'Small':
                sizeIcon = 
                    <span className="mr-2">
                        <i className="fa fa-male"></i>
                    </span>;
                break;
            case 'Medium':
                sizeIcon = 
                    <span className="mr-1">
                        <i className="fa fa-male"></i>
                        <i className="fa fa-male"></i>
                    </span>;
                break;
            case 'Large':
                sizeIcon = 
                    <span>
                        <i className="fa fa-male"></i>
                        <i className="fa fa-male"></i>
                        <i className="fa fa-male"></i>
                    </span>;
                break;
            default:
                break;
        }

        var regDesc = '',
            regIcon = <span></span>;
        switch (regStatus) {
            case 'REG':
                regDesc = 'Has an active registration with ACNC';
                regIcon = <span><i className="fa fa-check-circle"></i></span>;
                break;
            case 'REV':
                regDesc = 'Registration was revoked by ACNC';
                regIcon = <span><i className="fa fa-ban"></i></span>;
                break;
            case 'VREV':
                regDesc = 'Registration voluntarily revoked';
                regIcon = <span><i className="fa fa-exclamation-circle"></i></span>;
                break;
            default:
                break;
        }

        var dgrDesc = '',
            dgrIcon = <span></span>;
        if (dgrStatus === 'Y') {
            dgrDesc = 'Donations made to this charity are tax deductible';
            dgrIcon = <span><img src={smileFace} alt="smile face"/></span>;
        }
        else {
            dgrDesc = 'Donations made to this charity are not tax deductible';
            dgrIcon = <span><img src={sadFace} alt="sad face"/></span>;
        }

        const activeItemStyle = {
            color: "#212121", 
            fontWeight:"bold", 
            borderBottom: "5px solid #7E57C2"
        },
        inactiveItemStyle = {
            color: "#212121"
        };

        var percStyle = {};
        if (percAusUse >= 0.8) {
            percStyle = {
                color:'#4CAF50'
            } 
        }
        else if (percAusUse >= 0.4) {
            percStyle = {
                color:'#FFA000'
            }
        }
        else {
            percStyle = {
                color:'#FF5722'
            }
        }

        var renderPpltns = this.state.ppltns.map((ppltn, index) => {
            return <li key={index}><i className="fa fa-check mr-1" style={{color:"#8BC34A"}}></i> {ppltn}</li>;
        });

        return (
            <div style={{background: "#F3F3F3"}}>
                <Breadcrumb className="small mb-0">
                    <BreadcrumbItem><a href="/home"><i className="fa fa-home"></i></a></BreadcrumbItem>
                    <BreadcrumbItem><a href="/charities/dashboardAct">Explore charitable causes</a></BreadcrumbItem>
                    <BreadcrumbItem><a href="/charitySearch">Search for charities</a></BreadcrumbItem>
                    <BreadcrumbItem active>{name}</BreadcrumbItem>
                </Breadcrumb>
                
                <div className="row d-flex justify-content-center mt-3">

                    {/* charity details (except contact) col */}
                    <div className="col col-12 col-sm-12 col-md-8 col-lg-6 col-xl-5">
                        
                        {/* title row */}
                        <Card cascade className="w-100">
                            <CardImage tag="div">
                                <div className="p-4 text-white" style={{background: "#7E57C2"}}>
                                    <h5 className="h4-responsive">{name}</h5>
                                </div>
                            </CardImage>
                            <CardBody>
                                <p className="h6-responsive" style={{color: "#89959B"}}>{suburb} VIC {postcode} <strong>·</strong> {cause}</p>
                                <CardText>
                                    {sizeIcon}
                                    <span className="mx-2">{size} size</span> <br />
                                    {regIcon}
                                    <span className="mx-2">{regDesc}</span> <br />
                                    {dgrIcon}
                                    <span className="mx-2">{dgrDesc}</span> <br />
                                    <span><i className="fa fa-id-card"></i></span>
                                    <span className="mx-2">ABN: {ABN}</span>
                                </CardText>
                            </CardBody>
                        </Card>

                        {/* options row - overview (incl. all others, in order), financial, reviews, location/map */}
                        <div className="row ">
                            <Container>
                                <Row>
                                    <Col md="12">
                                        <Nav style={{background: "white", padding:"1em 1em 0 1em"}} className="z-depth-1">
                                            <NavItem>
                                                <NavLink to="#" className={classnames({ active: this.state.activeItemClassicTabs1 === '1' })} onClick={() => { this.toggleClassicTabs1('1'); }} style={this.state.activeItemClassicTabs1 === '1'? activeItemStyle : inactiveItemStyle}>
                                                Overview
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink to="#" className={classnames({ active: this.state.activeItemClassicTabs1 === '2' })} onClick={() => { this.toggleClassicTabs1('2'); }} style={this.state.activeItemClassicTabs1 === '2'? activeItemStyle : inactiveItemStyle}>
                                                Finance
                                                </NavLink>
                                            </NavItem>
                                            {/* <NavItem>
                                                <NavLink to="#" className={classnames({ active: this.state.activeItemClassicTabs1 === '3' })} onClick={() => { this.toggleClassicTabs1('3'); }} style={this.state.activeItemClassicTabs1 === '3'? activeItemStyle : inactiveItemStyle}>
                                                Reviews
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink to="#" className={classnames({ active: this.state.activeItemClassicTabs1 === '4' })} onClick={() => { this.toggleClassicTabs1('4'); }} style={this.state.activeItemClassicTabs1 === '4'? activeItemStyle : inactiveItemStyle}>
                                                Map
                                                </NavLink>
                                            </NavItem> */}
                                        </Nav>
                                        <TabContent className="card" activeItem={this.state.activeItemClassicTabs1} style={{color:"#212121", padding: "2em"}}>
                                            
                                            {/* overview */}
                                            <TabPane tabId="1">
                                                <h4>Mission</h4>
                                                <p>{desc}</p>
                                                
                                                <hr />

                                                <h4>Target population(s)</h4>
                                                <ul className="list-unstyled">{renderPpltns}</ul>

                                                <hr />
                                                
                                                <h4>How much reached those in need</h4>
                                                <p>
                                                    In 2016, &nbsp;
                                                    <strong className="h2-responsive" style={percStyle}>
                                                        {percAusUse * 100}%
                                                    </strong>
                                                    &nbsp;of all expenses went to charitable use in Australia.
                                                </p>

                                                <hr />

                                                {/* <h4>Reviews</h4> */}

                                                <h4>Address</h4>
                                                <div>
                                                    <span>{streetAddLn1}</span> <br />
                                                    {
                                                        {streetAddLn2} !== '' &&
                                                        <div>
                                                            <span>{streetAddLn2}</span>
                                                        </div>
                                                    }
                                                    <span>{suburb} VIC {postcode}</span>
                                                </div>
                                            </TabPane>
                                            
                                            {/* finance */}
                                            <TabPane tabId="2">
                                                <h4>How much was received</h4>
                                                <p>
                                                    <i className="fa fa-sign-in-alt mr-2" style={{color:"#43A047"}}></i>
                                                    Donations and bequests: <strong>${donationBequest}</strong> <br />
                                                    <i className="fa fa-sign-in-alt mr-2" style={{color:"#43A047"}}></i>
                                                    Government grants: <strong>${govGrants}</strong>
                                                </p>
                                                <hr />
                                                <h4>How much was spent</h4>
                                                <p>
                                                    <i className="fa fa-sign-out-alt mr-2" style={{color:"#EF5350"}}></i>
                                                    Charitable use in Australia: <strong>${ausUse}</strong> <br />
                                                    <i className="fa fa-sign-out-alt mr-2" style={{color:"#EF5350"}}></i>
                                                    Total expenses: <strong>${allUse}</strong> 
                                                </p>
                                                <hr />
                                                <h4>How much reached those in need</h4>
                                                <p>
                                                    In 2016, &nbsp;
                                                    <strong className="h3-responsive" style={percStyle}>
                                                        {percAusUse * 100}%
                                                    </strong>
                                                    &nbsp;of all expenses went to charitable use in Australia.
                                                </p>
                                            </TabPane>
                                            {/* <TabPane tabId="3">
                                                <p>Comments section</p>
                                            </TabPane>
                                            <TabPane tabId="4">
                                                <p>Address on Google Maps</p>
                                            </TabPane> */}
                                        </TabContent>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                    </div>

                    {/* charity contact (incl. "Donate Now" button) + nearby charities col,  */}
                    <div className="col col-12 col-sm-12 col-md-3 col-lg-2 col-xl-3">
                        {/* charity contact - address, website... */}
                        <div className="row">
                            
                        </div>

                        {/* nearby charities */}
                        <div className="row">

                        </div>

                    </div>
                    
                </div>

            </div>
            
        );
    }      
}

export default Charity;
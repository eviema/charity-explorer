import React, { Component } from 'react';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem,
        Card, CardBody, CardImage, 
        Container, Row, Col, TabPane, TabContent, Nav, NavItem, 
        Tooltip, } from 'mdbreact';   
import classnames from 'classnames';  
import GoogleMapReact from 'google-map-react';
import smileFace from '../assets/smile.png'; 
import sadFace from '../assets/sad.png';
import warningSign from '../assets/warning.png';
import checkBadge from '../assets/badge.png';
import cancelSign from '../assets/cancel.png';
import idCard from '../assets/id-card.png';
import mission from '../assets/mission.png';
import people from '../assets/team.png';
import donation from '../assets/donation.png';
import address from '../assets/map.png';
import pin from '../assets/pin.png';
const keys = require("../config/keys");

const AddressOnMap = () => (
    <img src={pin} alt="map pin" className="img-responsive"/>
);

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
            geoLocCenter: {},
        }
        this.toggleClassicTabs1 = this.toggleClassicTabs1.bind(this);
        this.refresh = this.refresh.bind(this);
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

    refresh() {
        this.googleMapRef_._setViewSize();
        this.setState({
            geoLocCenter: {
                lat: this.state.geoLocCenter.lat,
                lng: this.state.geoLocCenter.lng,
            }, 
        });
    }

    async toggleClassicTabs1(tab) {
        if (this.state.activeItemClassicTabs1 !== tab) {
            this.setState({
                activeItemClassicTabs1: tab,
            });
            if (tab === '3') {
                var charityAdd = this.state.streetAddLn1 + ' ' 
                                    + this.state.streetAddLn2 + ' ' 
                                    + this.state.suburb + ' VIC ' 
                                    + this.state.postcode + ' '
                                    + 'Australia';
                charityAdd = charityAdd.split(/[ ,]+/).join('+');
                
                await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${charityAdd}&key=${keys.API_key}`)
                    .then(
                        res => {
                            const { lat, lng } = res.data.results[0].geometry.location;
                            this.setState({
                                geoLocCenter: {
                                    lat: lat + 0.000000001,
                                    lng: lng + 0.000000001,
                                }
                            });
                        }
                    );

                this.refresh();
            }
        }
    }

    static defaultProps = {
        center: {
            lat: -37.813628, 
            lng: 144.963058,
        },
        zoom: 11
    };

    render() {

        var { ABN, name, regStatus, dgrStatus, size, desc,
            streetAddLn1, streetAddLn2, suburb, postcode, 
            cause, govGrants, donationBequest,
            ausUse, allUse, percAusUse } = this.state;
        
        const charityAddress = 
            <div>
                <span>{streetAddLn1}</span> <br />
                {
                    {streetAddLn2} !== '' &&
                    <div>
                        <span>{streetAddLn2}</span>
                    </div>
                }
                <span>{suburb} VIC {postcode}</span>
            </div>;

        govGrants = govGrants.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        donationBequest = donationBequest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        ausUse = ausUse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        allUse = allUse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var sizeIcon = <span></span>,
            sizeTooltip = '';
        switch (size) {
            case 'Small':
                sizeIcon = 
                    <span className="mx-2 text-primary">
                        <i className="fa fa-dollar-sign"></i>
                    </span>;
                sizeTooltip = 'A small-sized charity had a revenue of less than $250,000 in 2016.';
                break;
            case 'Medium':
                sizeIcon = 
                    <span className="mx-1 text-primary">
                        <i className="fa fa-dollar-sign"></i>
                        <i className="fa fa-dollar-sign"></i>
                    </span>;
                sizeTooltip = 'A medium-sized charity had a revenue of $250,000 to $999,999 in 2016.';
                break;
            case 'Large':
                sizeIcon = 
                    <span className="text-primary">
                        <i className="fa fa-dollar-sign"></i>
                        <i className="fa fa-dollar-sign"></i>
                        <i className="fa fa-dollar-sign"></i>
                    </span>;
                sizeTooltip = 'A large-sized charity had a revenue of $1 million or more in 2016.';
                break;
            default:
                break;
        }

        var regDesc = '',
            regIcon = <span></span>;
        switch (regStatus) {
            case 'REG':
                regDesc = 'This charity has an active registration with the ACNC.';
                regIcon = <span><img src={checkBadge} alt="check badge"/></span>;
                break;
            case 'REV':
                regDesc = 'The charity\'s registration was revoked by the ACNC.';
                regIcon = <span><img src={cancelSign} alt="cancel sign"/></span>;
                break;
            case 'VREV':
                regDesc = 'The charity\'s registration was voluntarily revoked by the ACNC.';
                regIcon = <span><img src={warningSign} alt="warning sign"/></span>;
                break;
            default:
                break;
        }

        var dgrDesc = '',
            dgrTooltip = '',
            dgrIcon = <span></span>;
        if (dgrStatus === 'Y') {
            dgrDesc = 'Donations made to this charity are tax deductible.';
            dgrTooltip = 'You can save on tax! Any donation more than $2 you make to this charity can be claimed in your tax return.';
            dgrIcon = <span><img src={smileFace} alt="smile face"/></span>;
        }
        else {
            dgrDesc = 'Donations made to this charity are not tax deductible.';
            dgrTooltip = 'Your donation made to this charity cannot be claimed in your tax return.';
            dgrIcon = <span><img src={sadFace} alt="sad face"/></span>;
        }

        var abnUrl = "https://abr.business.gov.au/SearchByAbnHistory.aspx?abn=" + ABN;

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
                
                {/* charity details (except contact) col */}
                <div className="row d-flex justify-content-center py-3">
                    
                    <Container className="px-0 mx-0" style={{width:"80vw"}}>
                        {/* todo - back to search results button */}

                        {/* title row */}
                        <Row>
                            <Card cascade className="w-100">
                                <CardImage tag="div">
                                    <div className="p-4 text-white" style={{background: "#7E57C2"}}>
                                        <h5 className="h4-responsive">{name}</h5>
                                    </div>
                                </CardImage>
                                <CardBody>
                                    <p className="h6-responsive" style={{color: "#89959B"}}>{suburb} VIC {postcode} <strong>·</strong> {cause}</p>
                                    
                                    <Tooltip 
                                        placement="right" tag="div" component="button" 
                                        componentClass="btn btn-link p-0 mb-1 mt-0"
                                        tooltipContent={sizeTooltip}> 
                                            {sizeIcon}
                                            <span className="ml-2 mr-4" style={{color: "#757575", fontSize:".9rem"}}>
                                                <span>{size.slice(0,1)}</span>
                                                <span className="text-lowercase">{size.slice(1)} size</span>
                                            </span>
                                    </Tooltip>
                                    
                                    <Tooltip 
                                        placement="right" tag="div" component="button" 
                                        componentClass="btn btn-link p-0 mb-1 mt-0 text-left"
                                        tooltipContent="The Australian Charities and Not-for-profits Commission (ACNC) regulates the Australian charity sector."> 
                                            {regIcon}
                                            <span className="ml-2 mr-4" style={{color: "#757575", fontSize:".9rem"}}>
                                                <span>{regDesc.slice(0,1)}</span>
                                                <span className="text-lowercase">{regDesc.slice(1, -5)}</span>
                                                <span>{regDesc.slice(-5)}</span>
                                            </span>
                                    </Tooltip>
                                    
                                    <Tooltip 
                                        placement="right" tag="div" component="button" 
                                        componentClass="btn btn-link p-0 mb-1 mt-0 text-left"
                                        tooltipContent={dgrTooltip}> 
                                            {dgrIcon}
                                            <span className="ml-2 mr-4" style={{color: "#757575", fontSize:".9rem"}}>
                                                <span>{dgrDesc.slice(0,1)}</span>
                                                <span className="text-lowercase">{dgrDesc.slice(1)}</span>
                                            </span>
                                    </Tooltip>
                                    
                                    <Tooltip 
                                        placement="right" tag="div" component="button" 
                                        componentClass="btn btn-link p-0 mt-0 mb-1"
                                        tooltipContent="Click to see further details of this charity in the Australian Business Register"> 
                                            <img src={idCard} alt="Australian Business Number"/>
                                            <span className="ml-2 mr-4">
                                                <a href={abnUrl} target="_blank" style={{color: "#757575", fontSize:".9rem"}}>ABN: {ABN}</a>
                                            </span>
                                    </Tooltip>
                                    
                                </CardBody>
                            </Card>
                        </Row>
                        
                        {/* options row - overview (incl. all others, in order), financial, reviews, location/map */}
                        <Row className="px-0">
                            <Col className="px-0" >
                                <Nav style={{background: "white", padding:"1.25rem 1.25rem 0 1.25rem"}} className="z-depth-1">
                                    <NavItem>
                                        {/* <a className="nav-link" href="/charitySearch">Overview</a> */}
                                        <a className={classnames({ active: this.state.activeItemClassicTabs1 === '1' }, 'nav-link')} onClick={() => { this.toggleClassicTabs1('1'); }} style={this.state.activeItemClassicTabs1 === '1'? activeItemStyle : inactiveItemStyle}>
                                            Overview
                                        </a>
                                    </NavItem>
                                    <NavItem>
                                        <a className={classnames({ active: this.state.activeItemClassicTabs1 === '2' }, 'nav-link')} onClick={() => { this.toggleClassicTabs1('2'); }} style={this.state.activeItemClassicTabs1 === '2'? activeItemStyle : inactiveItemStyle}>
                                            Finance
                                        </a>
                                    </NavItem>
                                    <NavItem>
                                        <a className={classnames({ active: this.state.activeItemClassicTabs1 === '3' }, 'nav-link')} onClick={() => { this.toggleClassicTabs1('3'); }} style={this.state.activeItemClassicTabs1 === '3'? activeItemStyle : inactiveItemStyle}>
                                            Map
                                        </a>
                                    </NavItem>
                                </Nav>
                                
                                <TabContent className="card" activeItem={this.state.activeItemClassicTabs1} style={{color:"#212121", padding: "2em"}}>
                                    
                                    {/* overview */}
                                    <TabPane tabId="1">
                                        <h4><img src={mission} alt="mission" className="mr-2"/> Mission</h4>
                                        <p className="pl-5">{desc}</p>
                                        
                                        <hr />

                                        <h4><img src={people} alt="target populations" className="mr-2"/> Target population(s)</h4>
                                        <ul className="list-unstyled pl-5">{renderPpltns}</ul>

                                        <hr />
                                        
                                        <h4><img src={donation} alt="donation" className="mr-2"/> How much reached those in need</h4>
                                        <p className="pl-5">
                                            In 2016, &nbsp;
                                            <strong className="h2-responsive" style={percStyle}>
                                                {percAusUse * 100}%
                                            </strong>
                                            &nbsp;of all expenses went to charitable use in Australia.
                                        </p>

                                        <hr />

                                        <h4><img src={address} alt="address" className="mr-2"/> Address</h4>
                                        <div className="pl-5">
                                            {charityAddress}
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

                                    {/* map */}
                                    <TabPane tabId="3">
                                        <h4>Address</h4>
                                        <div className="mb-2">{charityAddress}</div>
                                        <div className="google-map" style={{ height: '30vh', width: '100%' }}>
                                            <GoogleMapReact 
                                                bootstrapURLKeys={{
                                                    key: keys.API_key
                                                }}
                                                defaultCenter={this.props.center} 
                                                defaultZoom={this.props.zoom}
                                                center={this.state.geoLocCenter}
                                                zoom={15}
                                                ref={r => this.googleMapRef_ = r}>
                                                <AddressOnMap 
                                                    lat={this.state.geoLocCenter.lat} 
                                                    lng={this.state.geoLocCenter.lng} />
                                            </GoogleMapReact>
                                        </div>
                                    </TabPane>

                                </TabContent>
                            </Col>
                        </Row>
                    </Container>

                </div>

            </div>
            
        );
    }      
}

export default Charity;
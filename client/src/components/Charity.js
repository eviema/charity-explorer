import React, { Component } from 'react';
import axios from 'axios';
import ScrollUpButton from 'react-scroll-up-button';
import { Breadcrumb, BreadcrumbItem,
        Container, Row, Col, TabPane, TabContent, Nav, NavItem, 
        Tooltip, } from 'mdbreact';   
import classnames from 'classnames';  
import { FacebookShareButton, FacebookIcon,
        TwitterShareButton, TwitterIcon,
        WhatsappShareButton, WhatsappIcon,
        TelegramShareButton, TelegramIcon, 
        RedditShareButton, RedditIcon, } from 'react-share';
import { ReactTypeformEmbed } from 'react-typeform-embed';
import GoogleMapReact from 'google-map-react';
import share from '../assets/share.png';
import reportError from '../assets/reportError.png';
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

const MapPin = () => {
    return <img src={pin} alt="map pin" className="img-responsive" />;
}

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
            overseasUse: 0,
            allUse: 0,
            percUse: 0,
            activeItemOfTabs: '1',
            geoLocCenter: {},
            isReadMoreDescClicked: false,
            isShowShareButtonsClicked: false,
        }
        this.toggleTabs = this.toggleTabs.bind(this);
        this.refresh = this.refresh.bind(this);
        this.toggleReadMoreOrLess = this.toggleReadMoreOrLess.bind(this);
        this.toggleShowShareButtons = this.toggleShowShareButtons.bind(this);
        this.openForm = this.openForm.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/charity/${this.state.ABN}`)
                .then((res) => {
                    const charity = res.data;
                    var indexes = [];
                    for (var x in charity) {
                        indexes.push(x);
                    }

                    // set state ppltns (target populations)
                    var ppltnColIndexes = [];
                    for (var i = 50; i <= 61; i++) {
                        ppltnColIndexes.push(i);
                    }
                    for (i = 65; i <= 76; i++) {
                        ppltnColIndexes.push(i);
                    }
                    
                    var ppltnsMatched = [];
                    ppltnColIndexes.forEach((ppltnColIndex) => {
                        var ppltn = indexes[ppltnColIndex];
                        if (charity[ppltn] === 'Y') {
                            ppltn = ppltn.split('_').join(' ');
                            ppltnsMatched.push(ppltn); 
                        }
                    })

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
                        overseasUse: charity["Grants_and_donations_made_for_use_outside_Australia"],
                        allUse: charity["Total_expenses"],
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

    async toggleTabs(tab) {
        if (this.state.activeItemOfTabs !== tab) {
            this.setState({
                activeItemOfTabs: tab,
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

    toggleReadMoreOrLess() {
        this.setState({
            isReadMoreDescClicked: this.state.isReadMoreDescClicked? false: true,
        });
    }

    toggleShowShareButtons() {
        this.setState({
            isShowShareButtonsClicked: this.state.isShowShareButtonsClicked ? false : true
        });
    }

    openForm() {
        this.typeformEmbed.typeform.open();
    }

    render() {

        var { ABN, name, regStatus, dgrStatus, size, desc,
            streetAddLn1, streetAddLn2, suburb, postcode, 
            cause, govGrants, donationBequest,
            ausUse, overseasUse, allUse, percUse,
            isReadMoreDescClicked, } = this.state;
        
        percUse = Math.round((ausUse + overseasUse) / allUse * 100);

        const descPreview = desc.slice(0,300).concat("... ");
        const charityPageUrl = "https://charity-home-dev.appspot.com/charity/" + ABN,
            charityPageShareQuote = "Check out this charity in Melbourne: " + name + " ",
            charityPageShareHashtags = ["ThinkGloballyDonateLocally", "CharityStartsAtHome"];

        const charityCardStyle = {
            backgroundImage:"url(https://images.unsplash.com/photo-1505562130589-9879683e72da?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=94f59c798cc667c7966bf41e7f5144d3&auto=format&fit=crop&w=1050&q=80)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "60vh",
        } 

        const shareButtonStyle = {
            cursor: "pointer",
        }

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
            color: "white",  
            borderBottom: "5px solid #fff",
        },
        inactiveItemStyle = {
            color: "#f5f5f5",
        };

        var percStyle = {};
        if (percUse >= 80) {
            percStyle = {
                color:'#4CAF50'
            } 
        }
        else if (percUse >= 40) {
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

        const addressOnMapStyle = {
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: "99",
            background: "#fff",
        }

        const charityAddString = this.state.streetAddLn1 + ' ' 
                                + this.state.streetAddLn2 + ' ' 
                                + this.state.suburb + ' VIC ' 
                                + this.state.postcode + ' '
                                + 'Australia',
            charityAddStringForDirectionsUrl = charityAddString.split(/[ ,]+/).join('+'),
            directionsUrl = "https://www.google.com/maps/dir//" + charityAddStringForDirectionsUrl + "/";

        return (
            <div style={{background: "#F3F3F3", width:"100%"}}>
                <ScrollUpButton />
                <Breadcrumb className="small mb-0">
                    <BreadcrumbItem><a href="/home"><i className="fa fa-home"></i></a></BreadcrumbItem>
                    <BreadcrumbItem><a href="/charities/dashboardAct">Explore charitable causes</a></BreadcrumbItem>
                    <BreadcrumbItem><a href="/charitySearch">Search for charities</a></BreadcrumbItem>
                    <BreadcrumbItem active>{name}</BreadcrumbItem>
                </Breadcrumb>
                
                <div className="row d-flex justify-content-center py-xs-0 py-sm-3 m-1 w-xs-100 w-sm-60">
                    
                    <Container className="px-0 mx-0 w-xs-100 w-sm-60">
                        {/* todo - back to search results button */}
                        
                        <Row className="px-0">
                            <Col className="px-0" >
                                <Nav style={{background: "#7E57C2", padding:"1.25rem 1.25rem 0 1.25rem"}} className="z-depth-1 text-center">
                                    <NavItem>
                                        <a className={classnames({ active: this.state.activeItemOfTabs === '1' }, 'nav-link')} onClick={() => { this.toggleTabs('1'); }} style={this.state.activeItemOfTabs === '1'? activeItemStyle : inactiveItemStyle}>
                                            Overview
                                        </a>
                                    </NavItem>
                                    <NavItem>
                                        <a className={classnames({ active: this.state.activeItemOfTabs === '2' }, 'nav-link')} onClick={() => { this.toggleTabs('2'); }} style={this.state.activeItemOfTabs === '2'? activeItemStyle : inactiveItemStyle}>
                                            Finance
                                        </a>
                                    </NavItem>
                                    <NavItem>
                                        <a className={classnames({ active: this.state.activeItemOfTabs === '3' }, 'nav-link')} onClick={() => { this.toggleTabs('3'); }} style={this.state.activeItemOfTabs === '3'? activeItemStyle : inactiveItemStyle}>
                                            Map
                                        </a>
                                    </NavItem>
                                    
                                    <div className="d-flex ml-auto">
                                        <a className="d-flex mr-2 my-auto text-white small" onClick={this.toggleShowShareButtons}>
                                            <u className="d-none d-sm-block">Share this page</u> 
                                            {!this.state.isShowShareButtonsClicked && 
                                                <img src={share} alt="share" className="img-responsive mx-2 mr-3"/>
                                            }
                                        </a>
                                        {this.state.isShowShareButtonsClicked && 
                                            <div className="d-flex my-auto py-2 mr-3">
                                                <a onClick={this.toggleShowShareButtons}><i className="fa fa-angle-double-left text-white my-auto"></i></a>
                                                <FacebookShareButton quote={charityPageShareQuote} url={charityPageUrl} style={shareButtonStyle} className="ml-2">
                                                    <FacebookIcon size={24} round={true}/>
                                                </FacebookShareButton>
                                                <TwitterShareButton title={charityPageShareQuote} url={charityPageUrl} hashtags={charityPageShareHashtags} className="ml-2" style={shareButtonStyle}>
                                                    <TwitterIcon size={24} round={true}/>
                                                </TwitterShareButton>
                                                <WhatsappShareButton title={charityPageShareQuote} url={charityPageUrl} className="ml-2" style={shareButtonStyle}>
                                                    <WhatsappIcon size={24} round={true}/>
                                                </WhatsappShareButton>
                                                <TelegramShareButton title={charityPageShareQuote} url={charityPageUrl} className="ml-2" style={shareButtonStyle}>
                                                    <TelegramIcon size={24} round={true}/>
                                                </TelegramShareButton>
                                                <RedditShareButton title={charityPageShareQuote} url={charityPageUrl} className="ml-2" style={shareButtonStyle}>
                                                    <RedditIcon size={24} round={true}/>
                                                </RedditShareButton>
                                            </div>
                                        }
                                        <a className="d-flex my-auto text-white small" onClick={this.openForm}>
                                            <u className="d-none d-sm-block">Report Issue</u>
                                            <img src={reportError} alt="report error" className="img-responsive mx-2"/>
                                        </a>
                                        <ReactTypeformEmbed
                                            popup={true}
                                            autoOpen={false}
                                            url={'https://yifei2.typeform.com/to/Tqpj9h'}
                                            hideHeaders={true}
                                            hideFooter={true}
                                            style={{top: 100}}
                                            ref={(tf => this.typeformEmbed = tf) }
                                        />
                                    </div>

                                </Nav>
                                
                                <TabContent className="card" activeItem={this.state.activeItemOfTabs} style={{color:"#212121", }}>
                                    
                                    {/* overview */}
                                    <TabPane tabId="1">

                                        <div className="px-4 d-flex flex-column align-items-stretch justify-content-around" style={charityCardStyle}>
                                            
                                            <div className="text-white">
                                                <p className="h1-responsive">{name}</p>
                                                <p>{suburb} VIC {postcode} <strong>·</strong> {cause}</p>
                                            </div>
                                               
                                            <div>
                                                <Tooltip 
                                                    placement="right" tag="div" component="button" 
                                                    componentClass="btn btn-link p-0 mb-1 mt-2"
                                                    tooltipContent={sizeTooltip}> 
                                                        {sizeIcon}
                                                        <span className="ml-2 mr-4" style={{color: "#424242", fontSize:"1rem"}}>
                                                            <span>{size.slice(0,1)}</span>
                                                            <span className="text-lowercase">{size.slice(1)} size</span>
                                                        </span>
                                                </Tooltip>
                                                
                                                <Tooltip 
                                                    placement="right" tag="div" component="button" 
                                                    componentClass="btn btn-link p-0 mb-1 mt-0 text-left"
                                                    tooltipContent="The Australian Charities and Not-for-profits Commission (ACNC) regulates the Australian charity sector."> 
                                                        {regIcon}
                                                        <span className="ml-2 mr-4" style={{color: "#424242", fontSize:"1rem"}}>
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
                                                        <span className="ml-2 mr-4" style={{color: "#424242", fontSize:"1rem"}}>
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
                                                            <a href={abnUrl} target="_blank" style={{color: "#424242", fontSize:"1rem"}}>ABN: {ABN}</a>
                                                        </span>
                                                </Tooltip>
                                            </div>
                                            
                                        </div>

                                        <div className="p-4">
                                            <h4><img src={mission} alt="mission" className="mr-2"/> Mission</h4>
                                            <p className="pl-5">
                                                {desc.length <= 300 && desc}
                                                {desc.length > 300 && !isReadMoreDescClicked && 
                                                    <span>
                                                        {descPreview}
                                                        <button className="btn btn-outline-info btn-sm my-0" onClick={this.toggleReadMoreOrLess}>Read More</button>
                                                    </span>
                                                }
                                                {desc.length > 300 && isReadMoreDescClicked &&
                                                    <span>
                                                        {desc}
                                                        <button className="btn btn-outline-info btn-sm my-0" onClick={this.toggleReadMoreOrLess}>Read Less</button>
                                                    </span>
                                                }
                                            </p>
                                            
                                            <hr />

                                            <h4><img src={people} alt="target populations" className="mr-2"/> Target population(s)</h4>
                                            <ul className="list-unstyled pl-5">{renderPpltns}</ul>

                                            <hr />
                                            
                                            <h4><img src={donation} alt="donation" className="mr-2"/> How much reached those in need</h4>
                                            <p className="pl-5">
                                                In 2016, &nbsp;
                                                <strong className="h2-responsive" style={percStyle}>
                                                    {percUse}%
                                                </strong>
                                                &nbsp;of all expenses went to charitable use in Australia.
                                            </p>

                                            <hr />

                                            <h4><img src={address} alt="address" className="mr-2"/> Address</h4>
                                            <div className="pl-5">
                                                {charityAddress}
                                            </div>
                                        </div>
                                        
                                    </TabPane>
                                    
                                    {/* finance */}
                                    <TabPane tabId="2" className="p-4">
                                        <h4>How much was received by the charity</h4>
                                        <p>
                                            <i className="fa fa-sign-in-alt mr-2" style={{color:"#43A047"}}></i>
                                            Donations and bequests: <strong>${donationBequest}</strong> <br />
                                            <i className="fa fa-sign-in-alt mr-2" style={{color:"#43A047"}}></i>
                                            Government grants: <strong>${govGrants}</strong>
                                        </p>
                                        <hr />
                                        <h4>How much was spent by the charity</h4>
                                        <p>
                                            <i className="fa fa-sign-out-alt mr-2" style={{color:"#EF5350"}}></i>
                                            Charitable use in Australia: <strong>${ausUse}</strong> <br />
                                            <i className="fa fa-sign-out-alt mr-2" style={{color:"#EF5350"}}></i>
                                            Total expenses: <strong>${allUse}</strong> 
                                        </p>
                                        <hr />
                                        <h4>How much reached the charity's beneficiaries</h4>
                                        <p>
                                            In 2016, &nbsp;
                                            <strong className="h3-responsive" style={percStyle}>
                                                {percUse}%
                                            </strong>
                                            &nbsp;of all expenses went to charitable use in Australia.
                                        </p>
                                    </TabPane>

                                    {/* map */}
                                    <TabPane tabId="3" style={{position:"relative"}}>
                                        <div style={addressOnMapStyle} className="z-depth-2 p-3">
                                            <span className="h5-responsive">Address</span>
                                            <div className="my-2 h6-responsive">{charityAddress}</div>
                                            <a href={directionsUrl} target="_blank"
                                                className="btn btn-outline-info m-0">
                                                Get Directions 
                                            </a> 
                                        </div>

                                        <div className="google-map" style={{ height: '70vh', width: '100%' }}>
                                            <GoogleMapReact 
                                                bootstrapURLKeys={{
                                                    key: keys.API_key
                                                }}
                                                defaultCenter={this.props.center} 
                                                defaultZoom={this.props.zoom}
                                                center={this.state.geoLocCenter}
                                                zoom={16}
                                                ref={r => this.googleMapRef_ = r}>
                                                <MapPin
                                                    lat={this.state.geoLocCenter.lat} 
                                                    lng={this.state.geoLocCenter.lng}/>
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
import React from "react";
import { Breadcrumb, BreadcrumbItem } from "mdbreact";
import acncLogo from "../assets/acncLogo.png";
import dataGovAuLogo from "../assets/dataGovAuLogo.png";
import aboutBackground from '../assets/aboutBackground.jpg';
import ScrollUpButton from "react-scroll-up-button";

const About = () => {

    var imgStyle = {
        backgroundImage: `url(${aboutBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "scroll",
        backgroundPosition: "center",
        height: "50vh",
        width: "100vw"
    };

  return (
    <div>
      <ScrollUpButton />
      <Breadcrumb className="mb-0">
        <BreadcrumbItem>
          <a href="/home">
            <i className="fa fa-home fa-lg" />
          </a>
        </BreadcrumbItem>
        <BreadcrumbItem active>About us</BreadcrumbItem>
      </Breadcrumb>

      <div className="container-fluid">
        {/* top of About us page */}
        <div className="row d-flex align-items-center justify-content-end p-5" style={imgStyle}>
          <div className="pt-4 col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6">
            <div className="p-4 white-text" style={{ textShadow: "1px 1px 8px #424242" }}>
              <p className="h1-responsive font-weight-bold mt-4">
                We're here to help people spread a dose of kindness
              </p>
              <p className="h4-responsive pb-2">
                Providing information for potential donors to act now
              </p>
            </div>
          </div>
        </div>

        <div className="row py-5 m-2 d-flex justify-content-center">
          <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
            {/* who we are */}
            <p className="h4-responsive font-weight-bold">DonateNow</p>
            <p>
              DonateNow is an online information hub for Melburnians to find 
              local charities that support global causes they care about.
            </p>
            <div>
              Here they can:
              <ul>
                <li>
                  find out about local charities that support a cause 
                  (e.g. what they do exactly, how much they receive, how much they give),
                </li>
                <li>
                  discover which global causes are supported by charities in their local area
                  (e.g. what they are, how much donations and grants they receive), and
                </li>
                <li>
                  contact charities to discuss how they can do their share
                  (e.g. by clicking to visit their websites or referring to their addresses and
                  visiting in person).
                </li>
              </ul>
            </div>

            {/* data source */}
            <p className="h4-responsive font-weight-bold pt-3">
              Data source
            </p>
            <p>
              <img src={acncLogo} alt="acnc-logo" className="img-responsive py-2 pr-3 mr-5" />
              <img src={dataGovAuLogo} alt="data.gov.au" className="img-responsive pb-2" />
              <br />
              The open data we have sourced is presented on <a href="https://data.gov.au/">
                data.gov.au
              </a> and provided by <a href="http://www.acnc.gov.au/" target="_blank" rel="noopener noreferrer">
                the Australian Charities and Not-for-profits Commission (ACNC)
              </a>, under a <a href="https://creativecommons.org/licenses/by/3.0/au/">
                Creative Commons Attribution 3.0 Australia licence
              </a>.
            </p>
            <p>
              Open datasets sourced: <br />
              <a href="https://data.gov.au/dataset/acnc2016ais" target="_blank" rel="noopener noreferrer">
                1. ACNC 2016 Annual Information Statement Data
              </a> <br />
              <a href="https://data.gov.au/dataset/acnc-register" target="_blank" rel="noopener noreferrer">
                2. ACNC Registered Charities
              </a>
            </p>

            {/* image crediting */}
            <p className="h4-responsive font-weight-bold pt-3">Icon source</p>
            <div>
              All icons used for the website are made by <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market" target="_blank" rel="noopener noreferrer">
                Vectors Market
              </a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noopener noreferrer">
                www.flaticon.com
              </a> under the license <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">
                CC 3.0 BY
              </a>.
            </div>

            {/* copyright */}
            <p className="h4-responsive font-weight-bold pt-3">Copyright</p>
            <p>
              This website and its content is copyright of ACE Solutions - ©
              ACE Solutions {new Date().getFullYear()}. All rights reserved.
            </p>
            <p>
              Any redistribution or reproduction of part or all of the contents in any form is prohibited other than the following:
              <ul>
                <li>
                  you may print or download to a local hard disk extracts for
                  your personal and non-commercial use only
                </li>
                <li>
                  you may copy the content to individual third parties for
                  their personal use, but only if you acknowledge the website
                  as the source of the material
                </li>
              </ul>
            </p>
            <p>
              You may not, except with our express written permission,
              distribute or commercially exploit the content. Nor may you
              transmit it or store it in any other website or other form of
              electronic retrieval system.
            </p>

            {/* disclaimer */}
            <p className="h4-responsive font-weight-bold pt-3">Disclaimer</p>
            <p>
              The information contained in this website is for general
              information purposes only. The information is provided by ACE
              Solutions and while we endeavour to keep the information up to
              date and correct, we make no representations or warranties of
              any kind, express or implied, about the completeness, accuracy,
              reliability, suitability or availability with respect to the
              website or the information, products, services, or related
              graphics contained on the website for any purpose. Any reliance
              you place on such information is therefore strictly at your own
              risk.
            </p>
            <p>
              In no event will we be liable for any loss or damage including
              without limitation, indirect or consequential loss or damage, or
              any loss or damage whatsoever arising from loss of data or
              profits arising out of, or in connection with, the use of this
              website.
            </p>
            <p>
              Through this website you are able to link to other websites
              which are not under the control of ACE Solutions. We have no
              control over the nature, content and availability of those
              sites. The inclusion of any links does not necessarily imply a
              recommendation or endorse the views expressed within them
            </p>
            <p>
              Every effort is made to keep the website up and running
              smoothly. However, ACE Solutions takes no responsibility for,
              and will not be liable for, the website being temporarily
              unavailable due to technical issues beyond our control.
            </p>
          </div>
        </div>
      </div>
                  </div>);
};

export default About;

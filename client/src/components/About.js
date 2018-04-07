import React from "react";
import { Breadcrumb, BreadcrumbItem } from "mdbreact";
import acncLogo from "../assets/acncLogo.png";
import aboutBackground from '../assets/aboutBackground.jpg';

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
        <div className="row d-flex align-items-center justify-content-end p-5"  style={imgStyle}>
          
          <div className="pt-4 col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6">
            
            <div className="p-4 white-text" style={{ textShadow: "1px 1px 8px #424242" }}>
            
              <p className="h1-responsive font-weight-bold mt-4">
                We're here to help people spread a dose of kindness
              </p>
              <p className="h4-responsive">
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
                DonateNow is an online information hub for Melburnians to find a
                charitable cause in their local area that they are interested in, and
                a suitable charity to make donations to.
                </p>
                <div>
                Here they can:
                <ul>
                    <li>
                    explore local charitable causes (e.g. what they are, how much
                    donations and grants they receive),
                    </li>
                    <li>
                    find out about charities nearby (e.g. what they do, how much they
                    receive, how much they give), and
                    </li>
                    <li>
                    contact charities to discuss how they can do their share (e.g.
                    by referring to charity's address shown on a map and discussing in person).
                    </li>
                </ul>
                </div>

                {/* data source */}
                <p className="h4-responsive font-weight-bold">Our data source</p>
                <p>
                <img src={acncLogo} alt="acnc-logo" className="img-responsive py-2" />
                <br />
                We source open data from Australian Charities and Not-for-profits
                Commission (ACNC), the regulatory body for Australian charity sector.
                For more information, please refer to{" "}
                <a href="http://www.acnc.gov.au/" target="_blank" rel="noopener noreferrer">
                    ACNC website
                </a>.
                </p>  
            </div>
        </div>

      </div>

    </div>
  );
};

export default About;

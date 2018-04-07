import React from "react";
import { Breadcrumb, BreadcrumbItem } from "mdbreact";
import acncLogo from "../assets/acncLogo.png";

const About = () => {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <a href="/home">
            <i className="fa fa-home fa-lg" />
          </a>
        </BreadcrumbItem>
        <BreadcrumbItem active>About us</BreadcrumbItem>
      </Breadcrumb>

      <div className="m-5">
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
              find charities nearby (e.g. what they do, how much they receive,
              how much they give), and 
            </li>
            <li>
              contact charities to discuss how they can do their share (e.g.
              charity's address shown on a map).
            </li>
          </ul>
        </div>

        {/* data source */}
        <p className="h4-responsive font-weight-bold">Our data source</p>
        <p>
          <img src={acncLogo} alt="acnc-logo" className="img-responsive" />
          <br />
          We source open data from Australian Charities and Not-for-profits
          Commission (ACNC), the regulatory body for Australian charity sector.
          For more information, please refer to{" "}
          <a href="http://www.acnc.gov.au/" target="_blank">
            ACNC website
          </a>.
        </p>
      </div>
    </div>
  );
};

export default About;

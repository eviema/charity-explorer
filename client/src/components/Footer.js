import React from 'react';
import { Col, Container, Row } from "mdbreact";

const Footer = () => {
    if (window.location.pathname === "/charitySearch") {
        return <div />
    }

    return(
        <footer className="page-footer stylish-color-dark font-small">
            <Container className="py-5">
            <Row className="text-center d-flex justify-content-center">
                <Col md="2">
                    <h6 className="title font-weight-bold"><a href="/home">Home</a></h6>
                </Col>
                <Col md="2">
                    <h6 className="title font-weight-bold"><a href="/charities/dashboardAct">Charitable causes</a></h6>
                </Col>
                <Col md="2">
                    <h6 className="title font-weight-bold"><a href="/charitySearch">Charities</a></h6>
                </Col>
                <Col md="2">
                    <h6 className="title font-weight-bold"><a href="/about">About</a></h6>
                </Col>
                <Col md="2">
                    <h6 className="title font-weight-bold"><a href="/contact">Contact</a></h6>
                </Col>
            </Row>
            </Container>
            <div className="footer-copyright text-center py-4">
                <Container fluid>
                    &copy; {(new Date().getFullYear())} DonateNow
                    <br />
                    Powered by ACE Solutions
                </Container>
            </div>
        </footer>
    );
}

export default Footer;
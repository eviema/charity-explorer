import React, { Component } from 'react';
import ScrollableAnchor, { configureAnchors, goToAnchor } from 'react-scrollable-anchor';
import ScrollUpButton from 'react-scroll-up-button';
import binoculars from '../assets/binoculars.png';
import local from '../assets/local.png';
import magnifyingGlass from '../assets/analytics.png';
import target from '../assets/target.png';
import checklist from '../assets/checklist.png';
import donateFrequently from '../assets/stick-man.png';
import tax from '../assets/tax.png';

class Tips extends Component {

    handleClickToAnchor(tipNum) {
        configureAnchors({offset: -80, scrollDuration: 400});
        goToAnchor(`tip${tipNum}`);
      }

    render() {
        const titleRowStyle = {
            background: "url(https://images.unsplash.com/photo-1522836924445-4478bdeb860c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0a7086d4462707b61169f33db1abce35&auto=format&fit=crop&w=1050&q=80)",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "50vh",
        }

        const tipNumberingStyle = {
            borderRadius: "50%",
            background: "#00BFA5",
            color: "#fafafa",
            padding: ".5rem",
            width: "5.5rem",
            height: "5.5rem",
            fontWeight: "bold",
            textAlign: "center",

        }
    
        return <div className="container-fluid" style={{ padding: "0", background: "#F3F3F3" }}>
            <ScrollUpButton />

            {/* title row */}
            <div className="row d-flex align-items-center justify-content-end p-5" style={titleRowStyle}>
              <div className="pt-4 col-11 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <div className="p-4">
                  <p className="h1-responsive font-weight-bold mt-4" style={{ color: "#212121", textShadow: "1px 1px 8px #fafafa" }}>
                    7 Tips for Donors
                  </p>
                  <p className="h4-responsive pb-2" style={{ color: "#212121", textShadow: "1px 1px 8px #fafafa" }}>
                    Give with confidence to charities you trust.
                  </p>
                </div>
              </div>
            </div>

            {/* 6 tips */}
            <div className="p-4">
              <ScrollableAnchor id={"tip1"}>
                <div className="col col-12 col-sm-12 col-md-11 col-lg-10 col-xl-10 mx-auto mb-5">
                  <p className="row d-flex align-items-center justify-content-center m-3">
                    <span style={tipNumberingStyle}>
                      <span className="h4-responsive">Tip</span> <br />
                      <span className="h2-responsive">1</span>
                    </span>
                    <span className="col col-12 col-sm-8 col-md-8 col-lg-8 col-xl-7 h3-responsive text-center text-sm-center text-md-left font-weight-bold mx-3 my-2" style={{ color: "#424242" }}>
                      Find a cause that interests you the most and research on it
                    </span>
                    <img src={binoculars} alt="binoculars" className="ml-xl-auto" />
                  </p>
                  <p>
                    There are plenty of causes for charity. This world needs as much help as it can to become a better and more sustainable place for its dwellers. <a href="/causeExplorer">
                      Pick a cause
                    </a> which draws you the most and is closest to your heart. Donating to that cause should help you feel proud of yourself and give you a good night’s sleep.  Once you have found the issue or cause that interests you, do thorough research on which non-profit organizations out there are working hard towards solving it.
                  </p>
                  <div className="row d-flex justify-content-center">
                    <a className="btn btn-outline-info d-block d-sm-none" onClick={() => this.handleClickToAnchor("2")}>
                      Next Tip
                    </a>
                  </div>
                </div>
              </ScrollableAnchor>

              <ScrollableAnchor id={"tip2"}>
                <div className="col col-12 col-sm-12 col-md-11 col-lg-10 col-xl-10 mx-auto mb-5">
                  <p className="row d-flex align-items-center justify-content-center m-3">
                    <span style={tipNumberingStyle}>
                      <span className="h4-responsive">Tip</span> <br />
                      <span className="h2-responsive">2</span>
                    </span>
                    <span className="col col-12 col-sm-8 col-md-8 col-lg-8 col-xl-7 h3-responsive text-center text-sm-center text-md-left font-weight-bold mx-3 my-2" style={{ color: "#424242" }}>
                      Contribute to local charities
                    </span>
                    <img src={local} alt="local" className="ml-xl-auto" />
                  </p>
                  <p>
                    There are many advantages of donating to an
                    organization in your locality. It enables you to
                    walk up to them anytime you want and see their work
                    first-hand and verify that your donations are going
                    where they were supposed to go. You can use your
                    face-to-face skills and both you and the
                    organisation can gain trust in one another and
                    inspire collaboration, selflessness, and empathy for
                    the needful. Local non-profit organizations usually
                    employ members from the community and this has a
                    positive economic impact. Contributing locally with
                    the global perspective in mind, helps solve big
                    global problems by making small differences around
                    us.
                  </p>
                  <div className="row d-flex justify-content-center">
                    <a className="btn btn-outline-info d-block d-sm-none" onClick={() => this.handleClickToAnchor("3")}>
                      Next Tip
                    </a>
                  </div>
                </div>
              </ScrollableAnchor>

              <ScrollableAnchor id={"tip3"}>
                <div className="col col-12 col-sm-12 col-md-11 col-lg-10 col-xl-10 mx-auto mb-5">
                  <p className="row d-flex align-items-center justify-content-center m-3">
                    <span style={tipNumberingStyle}>
                      <span className="h4-responsive">Tip</span> <br />
                      <span className="h2-responsive">3</span>
                    </span>
                    <span className="col col-12 col-sm-8 col-md-8 col-lg-8 col-xl-7 h3-responsive text-center text-sm-center text-md-left font-weight-bold mx-3 my-2" style={{ color: "#424242" }}>
                      Check the ratings, reviews and critiques about the organization
                    </span>
                    <img src={magnifyingGlass} alt="magnifying glass" className="ml-xl-auto" />
                  </p>
                  <p>
                    Always check the ratings, reviews and critiques
                    about the organization given by previous donors.
                    These will help you confirm whether the organization
                    is working hard enough on the cause and its
                    relations with past and existing donors. This also
                    helps you know if the charity is legit. Google
                    search on the charity in order to check if they were
                    involved in any scandal or criminal activities. We
                    highly recommend that if the amount of money you are
                    donating is very high then visit the charity’s
                    office personally and talk to the administrators and
                    volunteers before making the payment.
                  </p>
                  <div className="row d-flex justify-content-center">
                    <a className="btn btn-outline-info d-block d-sm-none" onClick={() => this.handleClickToAnchor("4")}>
                      Next Tip
                    </a>
                  </div>
                </div>
              </ScrollableAnchor>

              <ScrollableAnchor id={"tip4"}>
                <div className="col col-12 col-sm-12 col-md-11 col-lg-10 col-xl-10 mx-auto mb-5">
                  <p className="row d-flex align-items-center justify-content-center m-3">
                    <span style={tipNumberingStyle}>
                      <span className="h4-responsive">Tip</span> <br />
                      <span className="h2-responsive">4</span>
                    </span>
                    <span className="col col-12 col-sm-8 col-md-8 col-lg-8 col-xl-7 h3-responsive text-center text-sm-center text-md-left font-weight-bold mx-3 my-2" style={{ color: "#424242" }}>
                      Focus on one or few charities
                    </span>
                    <img src={target} alt="target" className="ml-xl-auto" />
                  </p>
                  <p>
                    Of course, it is tempting to see your mail inbox
                    full of letters of appreciations and honor from
                    various charitable organizations you donate to but
                    we recommend not to donate to more than one or few
                    charities at a time. Please keep in mind that you do
                    not donate more money than in your budget. Also, if
                    you focus on donating to one or few charities then
                    your money will be invested further in to the cause.
                    Furthermore, you can build stronger relations with
                    the charities.  If you plan to give small amounts of
                    donations to many charities, keep in mind that there
                    is a processing cost involved with each payment
                    transaction. Therefore, the charities might receive
                    much lesser amount in hand to use for the cause.
                  </p>
                  <div className="row d-flex justify-content-center">
                    <a className="btn btn-outline-info d-block d-sm-none" onClick={() => this.handleClickToAnchor("5")}>
                      Next Tip
                    </a>
                  </div>
                </div>
              </ScrollableAnchor>

              <ScrollableAnchor id={"tip5"}>
                <div className="col col-12 col-sm-12 col-md-11 col-lg-10 col-xl-10 mx-auto mb-5">
                  <p className="row d-flex align-items-center justify-content-center m-3">
                    <span style={tipNumberingStyle}>
                      <span className="h4-responsive">Tip</span> <br />
                      <span className="h2-responsive">5</span>
                    </span>
                    <span className="col col-12 col-sm-8 col-md-8 col-lg-8 col-xl-7 h3-responsive text-center text-sm-center text-md-left font-weight-bold mx-3 my-2" style={{ color: "#424242" }}>
                      Verify the impact of your donation
                    </span>
                    <img src={checklist} alt="checklist" className="ml-xl-auto" />
                  </p>
                  <p>
                    You need to make sure that the money you are
                    donating is going to the cause and not just being
                    used for administration. Apart from this, check the
                    organization’s website for photographs, metrics,
                    success stories and various proofs to know the
                    progress and impact of its work in the community and
                    the usage of your money. You can also email the
                    charity organization and ask them for a detailed
                    account of how your donation was utilized.
                  </p>
                  <div className="row d-flex justify-content-center">
                    <a className="btn btn-outline-info d-block d-sm-none" onClick={() => this.handleClickToAnchor("6")}>
                      Next Tip
                    </a>
                  </div>
                </div>
              </ScrollableAnchor>

              <ScrollableAnchor id={"tip6"}>
                <div className="col col-12 col-sm-12 col-md-11 col-lg-10 col-xl-10 mx-auto mb-5">
                  <div className="row d-flex align-items-center justify-content-center m-3">
                    <span style={tipNumberingStyle}>
                      <span className="h4-responsive">Tip</span> <br />
                      <span className="h2-responsive">6</span>
                    </span>
                    <span className="col col-12 col-sm-8 col-md-8 col-lg-8 col-xl-7 h3-responsive text-center text-sm-center text-md-left font-weight-bold mx-3 my-2" style={{ color: "#424242" }}>
                      If possible, make a contribution every month
                    </span>
                    <img src={donateFrequently} alt="donate frequently" className="ml-xl-auto" />
                  </div>
                  <p>
                    Many charitable causes are an ongoing and continuous
                    process. For example, contribution towards medical
                    research related to finding a cure for diseases such
                    as Cancer or providing clean water to
                    underprivileged parts of the world. Making regular
                    contribution helps you plan your budget and improve
                    your connection towards the charitable cause and
                    relations with the charitable organization(s)
                  </p>
                  <div className="row d-flex justify-content-center">
                    <a className="btn btn-outline-info d-block d-sm-none" onClick={() => this.handleClickToAnchor("7")}>
                      Next Tip
                    </a>
                  </div>
                </div>
              </ScrollableAnchor>

              <ScrollableAnchor id={"tip7"}>
                <div className="col col-12 col-sm-12 col-md-11 col-lg-10 col-xl-10 mx-auto mb-5">
                  <p className="row d-flex align-items-center justify-content-center m-3">
                    <span style={tipNumberingStyle}>
                      <span className="h4-responsive">Tip</span> <br />
                      <span className="h2-responsive">7</span>
                    </span>
                    <span className="col col-12 col-sm-8 col-md-8 col-lg-8 col-xl-7 h3-responsive text-center text-sm-center text-md-left font-weight-bold mx-3 my-2" style={{ color: "#424242" }}>
                      Do good and save on tax!
                    </span>
                    <img src={tax} alt="save on tax" className="ml-xl-auto" />
                  </p>
                  <p>
                    If a charity is registered by the Australian Tax Office as a “Deductible Gift Recipient Organization” then any donation more than $2 you make can be claimed in your tax return. “CharityNow” shows if the charity you wish to donate to falls under this category or not after you select a charity of your interest. For more information visit <a href="https://www.etax.com.au/claim-tax-deductible-donations/" target="_blank" rel="noopener noreferrer">
                      https://www.etax.com.au/claim-tax-deductible-donations/
                    </a>.
                  </p>
                </div>
              </ScrollableAnchor>

              <div className="text-center mb-4">
                <a className="btn btn-default" href="/">
                  Let’s start giving!
                </a>
              </div>
            </div>
          </div>;
    }
    
}

export default Tips;
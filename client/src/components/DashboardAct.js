import React, { Component } from "react";
import Iframe from "react-iframe";
import { Redirect } from 'react-router';
import { Button, Card, CardImage, CardBody, CardTitle, CardText, Breadcrumb, BreadcrumbItem } from 'mdbreact';

class DashboardAct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToSearch: false,
        }
        this.handleOnClickToSearch = this.handleOnClickToSearch.bind(this);
    }

    handleOnClickToSearch = () => {
        this.setState({
            redirectToSearch: true
        });
    }

    render() {
        if (this.state.redirectToSearch) {
            return <Redirect push to="/charitySearch" />;
        }

        return (
            <div>
                {/* <div className="row my-4 d-flex justify-content-center">
                    <Link to="#" className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <Button color="info" rounded>
                            Explore charitable causes in your suburb
                        </Button>
                    </Link>
                    <Link to="/charities/dashboardLoc" className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <Button rounded>
                            Explore donations and bequests in your local area
                        </Button>
                    </Link>
                </div> */}
                <Breadcrumb>
                    <BreadcrumbItem><a href="/home"><i class="fa fa-home fa-lg"></i></a></BreadcrumbItem>
                    <BreadcrumbItem active>Charitable Causes</BreadcrumbItem>
                </Breadcrumb>
                <div className="mx-3">
                    <Card cascade>
                        <CardImage tag="div">
                            <div className="view #26c6da cyan lighten-1 p-3">
                                <h5 className="h4-responsive">Did you know...</h5>
                            </div>
                        </CardImage>
                        <CardBody color="#757575 grey darken-1">
                            <CardText>
                                There are <strong>19,696 homeless people</strong> living in Greater Melbourne. This number has increased by 13% since 2011... 
                                <br />
                                However, the Donations and Government grands that go to charities for <strong>housing activities</strong> still remain one of the <strong>least</strong>.
                                <br />

                                <hr />
                                <CardTitle>You can help!</CardTitle>
                                Below is a list of charitable causes that are supported by charities in Greater Melbourne, along with the total amount of donations and government grants received by each charity in 2016.
                                <br />
                                Wondering if the cause you're interested in is supported by charities in your suburb? Select your suburb on the right, and you'll see all the causes available there. 
                                <br />
                                Want to search for charities for a cause in a suburb? There will be a button below the graph that takes you to the search page. 
                            </CardText>
                        </CardBody>
                    </Card>         
                </div>
                <div style={{height:"80vh", width: "70vw"}}>
                    <Iframe url="https://public.tableau.com/views/BookMainActivity/Dashboard1?:embed=y&:display_count=yes&:showVizHome=no"
                            className="mt-3">
                        <param name="filter" value=":original_view=yes" />
                    </Iframe>   
                </div>
                <div className="row my-5 d-flex justify-content-center">
                    <Button className="mt-5" onClick={this.handleOnClickToSearch}>
                        Search for charities
                    </Button>
                </div>
                  
            </div>
        );
    }  
}

export default DashboardAct;

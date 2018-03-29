import React from "react";
import Iframe from "react-iframe";
import { Link } from 'react-router-dom';
import { Button } from 'mdbreact';

const DashboardAct = () => {
  return (
    <div>
        {/* <div className="row my-4 d-flex justify-content-center">
            <Link to="/charities/dashboardAct" className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <Button color="info" rounded>
                    Explore charitable causes in your suburb
                </Button>
            </Link>
            <Link to="#" className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <Button rounded>
                    Explore donations and bequests in your local area
                </Button>
            </Link>
        </div> */}

        <div>
            <Iframe url="https://public.tableau.com/views/CharityVisualisation_V10/Dashboard2?:embed=y&:display_count=yes&:showVizHome=no">
                <param name="filter" value=":original_view=yes" />
            </Iframe>
        </div>
        
    </div>
  );
};

export default DashboardAct;

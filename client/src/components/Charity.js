import React, { Component } from 'react';
import axios from 'axios';

class Charity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ABN: this.props.match.params.ABN,
            name: '',
            cause: '',
            gov_grants: 0,
            donation_bequest: 0,
        }
    }

    componentDidMount() {
        axios.get(`/api/charity/${this.state.ABN}`)
                .then((res) => {
                    const charity = res.data;
                    this.setState({
                        ABN: charity["ABN"],
                        name: charity["Charity_Name"],
                        cause: charity["Main_Activity"],
                        gov_grants: charity["Government_grants"],
                        donation_bequest: charity["Donations_and_bequests"]
                    });
                })
                .catch(function(e) {
                    console.log("ERROR", e);
                });
    }

    render() {
        return (
            <div>
                ABN: {this.state.ABN} <br />
                Charity name: {this.state.name} <br />
                Main activity: {this.state.cause} <br />
                Government grants: {this.state.gov_grants} <br />
                Donations and bequests: {this.state.donation_bequest}
            </div>
        );
    }      
}

export default Charity;
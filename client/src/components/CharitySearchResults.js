import React, { Component } from 'react';
import { Redirect } from "react-router";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { RadioGroup, Radio } from 'react-radio-group';
import { Card, CardBody, CardImage, CardTitle, CardText, 
        Breadcrumb, BreadcrumbItem, 
        Tooltip, } from 'mdbreact';
import Pagination from "react-js-pagination";
import ScrollUpButton from "react-scroll-up-button";

class CharitySearchResults extends Component {
    constructor(props) {

        super(props);
        
        const conditions = [
            {
                value: 'percUseHigh',
                label: '% of expenses for charitable use (High - Low)'
            },
            {
                value: 'amtAllLow',
                label: 'Lowest amount of donations and grants received'
            },
            {
                value: 'amtAllHigh',
                label: 'Highest amount of donations and grants received'
            },
        ];
        
        this.state = {
            cause: props.location.state.cause,
            location: props.location.state.location,
            council: props.location.state.council,
            isCouncilEmptyOfChar: props.location.state.isCouncilEmptyOfChar,
            charities: props.location.state.charities,
            charitiesDisplayed: props.location.state.charities,
            doneFilteringCharities: false, 
            currentPage: 1,
            charitiesPerPage: 5,
            sortByConditions: conditions,
            sortByCondCurrent: {},
            selectedTaxValue: 'taxAll',
            selectedSizeValue: 'sizeAll',
            isMobileDevice: false, 
            isCharityCardClicked: false,
            isBackToSearchRequired: false,
            charityABN: 0,
        }
        this.handleClickOnPageNumber = this.handleClickOnPageNumber.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleChangeOfTaxFilter = this.handleChangeOfTaxFilter.bind(this);
        this.handleChangeOfSizeFilter = this.handleChangeOfSizeFilter.bind(this);
        this.handleClickToResetFilters = this.handleClickToResetFilters.bind(this);
        this.handleClickToSearch = this.handleClickToSearch.bind(this);
        this.handleOnClickToCharityPage = this.handleOnClickToCharityPage.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        
        this.setState({
            sortByCondCurrent: {
                value: 'percUseHigh',
                label: '% of expenses for charitable use (High - Low)'
            }
        });

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        this.setState({
          isMobileDevice: window.innerWidth <= 768
        });
    }

    handleClickOnPageNumber(currentPageNumber) {        
        this.setState({
            currentPage: currentPageNumber
        });
        window.scrollTo(0, 0);
    }

    handleClickToSearch() {
        this.setState({
            isBackToSearchRequired: true,
        });
    }

    async handleSort(chosenCond) {

        // default condition: % of expenses going to charity use
        const condition = chosenCond === null ? {
            value: 'percUseHigh',
            label: '% of expenses for charitable use (High - Low)'
          } : chosenCond;

        await this.setState({
            sortByCondCurrent: condition
        });

        var charitiesSorted = [].concat(this.state.charitiesDisplayed);

        switch (this.state.sortByCondCurrent.value) {
            case 'percUseHigh':
                charitiesSorted = charitiesSorted.sort((charity1, charity2) => {
                    const charity1Perc = charity1.percUse,
                        charity2Perc = charity2.percUse;
                    return charity2Perc - charity1Perc;
                });
                break;
            case 'amtAllLow':
                charitiesSorted = charitiesSorted.sort((charity1, charity2) => {
                    const charity1TotalAmt = charity1.amtDonations + charity1.amtGovGrants,
                          charity2TotalAmt = charity2.amtDonations + charity2.amtGovGrants;
                    return charity1TotalAmt - charity2TotalAmt;
                });
                break;
            case 'amtAllHigh':
                charitiesSorted = charitiesSorted.sort((charity1, charity2) => {
                    const charity1TotalAmt = charity1.amtDonations + charity1.amtGovGrants,
                        charity2TotalAmt = charity2.amtDonations + charity2.amtGovGrants;
                    return charity1TotalAmt - charity2TotalAmt;
                }).reverse();
                break;
            default:
                charitiesSorted = charitiesSorted.sort((charity1, charity2) => {
                    const charity1Perc = charity1.percUse,
                        charity2Perc = charity2.percUse;
                    return charity2Perc - charity1Perc;
                });
                break;
        }

        this.setState({
            charitiesDisplayed: charitiesSorted,
            currentPage: 1,
        });
        
    }

    async handleFilter() {

        await this.setState({
            doneFilteringCharities: false,
        });

        const { selectedTaxValue, selectedSizeValue } = this.state;
        var allCharitiesMatched = [];

        
        if (selectedTaxValue === 'taxAll') {
            allCharitiesMatched = this.state.charities;
        }
        else if (selectedTaxValue === 'taxY') {
            this.state.charities.forEach(charity => {
                if (charity.dgrStatus === 'Y') {
                    if (!allCharitiesMatched.includes(charity)) {
                        allCharitiesMatched.push(charity);
                    }
                }
            }); 
        }
        else if (selectedTaxValue === 'taxN') {
            this.state.charities.forEach(charity => {
                if (charity.dgrStatus === 'N') {
                    if (!allCharitiesMatched.includes(charity)) {
                        allCharitiesMatched.push(charity);
                    }
                }
            }); 
        }

        var newAllCharitiesMatched = [];
        if (selectedSizeValue === 'sizeAll') {
            newAllCharitiesMatched = allCharitiesMatched;
        }
        else if (selectedSizeValue === 'sizeL') {
            allCharitiesMatched.forEach(charity => {
                if (charity.size === 'Large') {
                    if (!newAllCharitiesMatched.includes(charity)) {
                        newAllCharitiesMatched.push(charity);
                    }
                }
            });
        } 
        else if (selectedSizeValue === 'sizeM') {
            allCharitiesMatched.forEach(charity => {
                if (charity.size === 'Medium') {
                    if (!newAllCharitiesMatched.includes(charity)) {
                        newAllCharitiesMatched.push(charity);
                    }
                }
            });
        } 
        else if (selectedSizeValue === 'sizeS') {
            allCharitiesMatched.forEach(charity => {
                if (charity.size === 'Small') {
                    if (!newAllCharitiesMatched.includes(charity)) {
                        newAllCharitiesMatched.push(charity);
                    }
                }
            });
        } 
        
        this.setState({
            doneFilteringCharities: true,
            charitiesDisplayed: newAllCharitiesMatched,
        }); 
    }

    async handleChangeOfTaxFilter(newValue) {
        await this.setState({
            selectedTaxValue: newValue
        });
        this.handleFilter();
    }

    async handleChangeOfSizeFilter(newValue) {
        await this.setState({
            selectedSizeValue: newValue
        });
        this.handleFilter();
    }

    async handleClickToResetFilters() {
        await this.setState({
            selectedTaxValue: 'taxAll',
            selectedSizeValue: 'sizeAll',
        });
        this.handleFilter();
    }

    handleOnClickToCharityPage(ABN) {
        this.setState({
            isCharityCardClicked: true,
            charityABN: ABN,
        });
    }

    render() {

        if (this.state.isBackToSearchRequired) {
            return (
                <Redirect to={{
                    pathname: '/',
                    state: {
                        cause: this.state.cause,
                        location: this.state.location,
                        isSearchClicked: false,
                    }
                }}/>
            );
        }

        if (this.state.isCharityCardClicked) {
            return (
                <Redirect push to={{
                    pathname: `/charity/${this.state.charityABN}`,
                    state: {
                        cause: this.state.cause,
                        location: this.state.location,
                        council: this.state.council,
                        charities: this.state.charities,
                    }
                }} />
            );
        }

        var { cause } = this.state;
        var valueCause = cause && cause.value;

        var { location } = this.state;
        var valueLocation = location && location.value;

        var { sortByCondCurrent } = this.state;
        var valueSortByCond = sortByCondCurrent && sortByCondCurrent.value;

        var { selectedTaxValue, selectedSizeValue } = this.state;
        
        const { charities, charitiesDisplayed, currentPage, charitiesPerPage } = this.state;

        const charitySizeFilterTooltip = 
            <table>
                <tbody>
                    <tr style={{borderBottom: "1px solid #fff"}}>
                        <th>Size</th>
                        <th >Annual Turnover</th>
                    </tr>
                    <tr style={{borderBottom: "1px solid #fff"}}>
                        <th>Large</th>
                        <th >$1 million or more</th>
                    </tr>
                    <tr style={{borderBottom: "1px solid #fff"}}>
                        <td >Medium</td>
                        <td >$250,000 to $999,999</td>
                    </tr>
                    <tr>
                        <td >Small</td>
                        <td >less than $250,000</td>
                    </tr>
                </tbody>
            </table>
        ;

        const { council } = this.state;

        const indexOfLastCharity = currentPage * charitiesPerPage;
        const indexOfFirstCharity = indexOfLastCharity - charitiesPerPage;
        const currentCharityList = charitiesDisplayed.slice(indexOfFirstCharity, indexOfLastCharity);

        const renderCharities = currentCharityList.map((charity, index) => {
            var cardPercStyle = {};
            if (charity.percUse >= 80) {
                cardPercStyle = {
                    background:'#4CAF50',
                    borderRadius: "5px",
                } 
            }
            else if (charity.percUse >= 40) {
                cardPercStyle = {
                    background:'#FFA000',
                    borderRadius: "5px",
                }
            }
            else if (charity.percUse >= 10) {
                cardPercStyle = {
                    background:'#FF5722',
                    borderRadius: "5px",
                }
            }
            else {
                cardPercStyle = {
                    background:'#FF5722',
                    borderRadius: "5px",
                };
            }
            return (
                <li key={index} className="col col-12 d-flex align-items-stretch px-0 mb-3 hoverable"
                    onClick={() => this.handleOnClickToCharityPage(charity.ABN)} style={{cursor: "pointer"}}>
                    <Card cascade className="w-100">
                        <CardImage tag="div">
                            <div className="#4DD0E1 cyan lighten-2 p-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                <div className="d-flex align-items-center">
                                    <Tooltip 
                                        placement="left" tag="div" component="button" 
                                        componentClass="btn btn-link p-0 mb-1 mt-2"
                                        tooltipContent={charity.percUse + '% of all expenses of this charity went to charitable use.'}> 
                                            <span className="h2-responsive text-white p-2" style={cardPercStyle}>
                                                {charity.percUse >= 10 && charity.percUse}
                                                {charity.percUse < 10 && "<10"}
                                                %
                                            </span>
                                    </Tooltip>
                                    <h3 className="h3-responsive ml-2 my-0">{charity.name}</h3>
                                </div>
                                <a className="btn btn-primary" onClick={this.handleOnClickToCharityPage} >
                                    Learn more 
                                    <i className="fa fa-arrow-right fa-lg pl-2"></i>
                                </a>
                            </div>
                        </CardImage>
                        <CardBody className="d-flex flex-column justify-content-between align-items-stretch">
                            <div>
                                <CardTitle>{charity.cause}</CardTitle>
                                <p>{charity.suburb} VIC {charity.postcode}</p>
                                <CardText>
                                    <span>{charity.desc.length <= 200 ? charity.desc : charity.desc.slice(0,200).concat("... ")}</span>
                                </CardText>
                            </div>
                        </CardBody>
                    </Card>
                </li>
            );
        });

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(charities.length * 1.0 / charitiesPerPage); i++) {
            pageNumbers.push(i);
        }

        return(
            <div style={{background: "#F3F3F3"}} className="container-fluid px-0">
                <ScrollUpButton />

                <Breadcrumb className="small">
                    <BreadcrumbItem><a onClick={this.handleClickToSearch} style={{color: "#0275d8"}}><i className="fa fa-home"></i></a></BreadcrumbItem>
                    <BreadcrumbItem active>Search results</BreadcrumbItem>
                </Breadcrumb>

                <div className="row d-flex justify-content-center p-3">
                    <div className="col col-12 col-md-10 col-xl-9">

                        {/* title & top back-to-search button */}
                        <div className="row d-flex justify-content-start m-3">                          
                            {/* back to search button */}
                            <div className="col col-12 small">
                                <a className="btn btn-info btn-sm mx-0" onClick={this.handleClickToSearch}>Back to search</a>
                            </div>

                            {/* charity results title */}
                            <div className="col col-12 mt-3">
                                <div className="mb-2">
                                    <h5>
                                        Search results for charities in&nbsp; 
                                        <strong>{valueLocation}</strong>&nbsp; 
                                        that support <strong>{valueCause}</strong>
                                    </h5>
                                </div>
                            </div>
                        </div>

                        {/* search results, sort-by, filters */}
                        <div className="row d-flex justify-content-start align-items-start m-3">

                            {/* search results & sort-by dropdown */}
                            <div className="col col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">

                                {/* sort by */}
                                <div className="row d-flex align-items-center justify-content-start px-3 small">
                                    <span>Sort by </span>
                                    <Select name="sortBy" className="col-10 col-sm-8 col-md-10 col-lg-9 col-xl-8"
                                            value={valueSortByCond}
                                            onChange={this.handleSort}
                                            options={this.state.sortByConditions} />
                                </div>
                                
                                {/* result range displayer and pagination */}
                                <div className="row d-flex align-items-center justify-content-between px-3">
                                    <h6 className="small mb-0">
                                        Showing {Math.min((currentPage - 1) * charitiesPerPage + 1, charitiesDisplayed.length)} to {Math.min(currentPage * charitiesPerPage, charitiesDisplayed.length)} of {charitiesDisplayed.length} results
                                    </h6> 

                                    <div className="ml-2 mt-2">
                                        <Pagination
                                            hideDisabled
                                            linkClass="py-1 px-2"
                                            activeLinkClass="bg-primary rounded text-white"
                                            activePage={currentPage}
                                            itemsCountPerPage={charitiesPerPage}
                                            totalItemsCount={charitiesDisplayed.length}
                                            pageRangeDisplayed={5}
                                            onChange={this.handleClickOnPageNumber}
                                        />
                                    </div>
                                </div>
                                
                                {/* if no results for suburb & cause combo */}
                                {this.state.council !== '' && !this.state.isCouncilEmptyOfChar && 
                                    <div className="d-flex">
                                        <p style={{background: "#01579B", padding:"1rem", borderRadius:"5px", color: "white"}}>
                                            It seems no charities in {valueLocation} support {valueCause}. However, check out these charities in&nbsp;
                                            {this.state.council !== '' && !this.state.isCouncilEmptyOfChar && <span><strong>{council}</strong>, your local council:</span>}
                                            {this.state.council !== '' && this.state.isCouncilEmptyOfChar && <strong>Greater Melbourne:</strong>}
                                        </p>
                                    </div>
                                }
                                {this.state.council !== '' && this.state.isCouncilEmptyOfChar &&
                                    <div className="d-flex">
                                        <p style={{background: "#01579B", padding:"1rem", borderRadius:"5px", color: "white"}}>
                                            It seems no charities in {valueLocation} or in your local council support {valueCause}. However, check out these charities in&nbsp;
                                            {this.state.council !== '' && !this.state.isCouncilEmptyOfChar && <span><strong>{council}</strong>, your local council:</span>}
                                            {this.state.council !== '' && this.state.isCouncilEmptyOfChar && <strong>Greater Melbourne:</strong>}
                                        </p>
                                    </div>
                                }                                

                                {/* actual charity results */}  
                                {charitiesDisplayed.length > 0 &&
                                    <ul className="row card-group list-unstyled mx-0 px-0 mb-0 d-flex justify-content-center">{renderCharities}</ul>
                                }
                                {charitiesDisplayed.length === 0 && 
                                    <div className="my-4" style={{background: "#01579B", padding:"1rem", borderRadius:"5px", color: "white"}}>
                                        <p className="mb-2 h5-responsive" style={{fontWeight:"600"}}>
                                            Sorry, no results were found. 
                                        </p>
                                        <hr />
                                        <p style={{fontWeight:"500"}}>Search Suggestions:</p>
                                        <a onClick={this.handleClickToResetFilters}><u>Reset filters</u></a> <br />
                                        <a onClick={this.handleClickToSearch}><u>Modify search</u></a>
                                    </div>
                                }
                                
                                {/* result range displayer and pagination */}
                                <div className="row d-flex align-items-center justify-content-between px-3">
                                    <h6 className="small mb-0">
                                        Showing {Math.min((currentPage - 1) * charitiesPerPage + 1, charitiesDisplayed.length)} to {Math.min(currentPage * charitiesPerPage, charitiesDisplayed.length)} of {charitiesDisplayed.length} results
                                    </h6>

                                    <div className="ml-2 mt-2">
                                        <Pagination
                                            hideDisabled
                                            linkClass="py-1 px-2"
                                            activeLinkClass="bg-primary rounded text-white"
                                            activePage={currentPage}
                                            itemsCountPerPage={charitiesPerPage}
                                            totalItemsCount={charitiesDisplayed.length}
                                            pageRangeDisplayed={5}
                                            onChange={this.handleClickOnPageNumber}
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* filters */}
                            <div className="col col-10 col-sm-10 col-md-9 col-lg-3 col-xl-3 p-3 m-3" style={{background: "#fff", borderRadius: "5px",}}>
                                {/* by tax deductibility */}
                                <div>
                                    <div className="h6-responsive font-weight-bold d-flex align-items-center">
                                        Tax deductibility 
                                        <Tooltip 
                                            placement="right" tag="div" component="button" 
                                            componentClass="btn btn-link p-0 mb-1 mt-2"
                                            tooltipContent="Donations made to certain charities can be claimed in your tax return."> 
                                                <i className="far fa-question-circle fa-sm"></i>
                                        </Tooltip>
                                    </div>
                                    <RadioGroup name="tax" selectedValue={selectedTaxValue} onChange={this.handleChangeOfTaxFilter}>
                                        <Radio value="taxAll" />  All <br />
                                        <Radio value="taxY" />  Yes <br />
                                        <Radio value="taxN" />  No
                                    </RadioGroup>
                                </div>
                                
                                <hr />

                                {/* by charity size */}
                                <div>
                                    <div className="h6-responsive font-weight-bold d-flex align-items-center">
                                        Charity size
                                        {<Tooltip 
                                            placement="right" tag="div" component="button" 
                                            componentClass="btn btn-link p-0 mb-1 mt-2"
                                            tooltipContent={charitySizeFilterTooltip}> 
                                                <i className="far fa-question-circle fa-sm"></i>
                                        </Tooltip>}
                                    </div>
                                    <RadioGroup name="size" selectedValue={selectedSizeValue} onChange={this.handleChangeOfSizeFilter}>
                                        <Radio value="sizeAll" />  All <br />
                                        <Radio value="sizeL" />  Large <br />
                                        <Radio value="sizeM" />  Medium <br />
                                        <Radio value="sizeS" />  Small
                                    </RadioGroup>
                                </div>
                            </div>

                        </div>
                        
                        {/* back to search button */}
                        <div className="row d-flex justify-content-start m-3">
                            <div className="col col-12 pb-4 small">
                                <a className="btn btn-info btn-sm mx-0" onClick={this.handleClickToSearch}>Back to search</a>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        );

    }

}

export default CharitySearchResults;
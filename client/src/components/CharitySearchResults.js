import React, { Component } from 'react';
import { Redirect } from "react-router";
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
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
            doneFilteringCharities: false, 
            charitiesFiltered: [],
            currentPage: 1,
            charitiesPerPage: 5,
            sortByConditions: conditions,
            sortByCondCurrent: {},
            taxDeductFilterItems: [],
            sizeFilterItems: [],
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

        var charitiesSorted = [].concat(this.state.charities);

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
            charities: charitiesSorted,
            currentPage: 1,
        });
    }

    async handleFilter() {

        await this.setState({
            doneFilteringCharities: false,
        });
       
        const allFilterItems = this.state.taxDeductFilterItems.concat(this.state.sizeFilterItems);
        var allCharitiesMatched = allFilterItems.length === 0 ? this.state.charities : [];

        allFilterItems.forEach(filterItem => {
            var charitiesMatched = [];
            if (filterItem.slice(0,3) === 'tax') {
                console.log('tax filter being handled', filterItem)
                if (filterItem.slice(3) === 'Y') {
                    this.state.charities.forEach(charity => {
                        console.log(charity.dgrStatus)
                        if (charity.dgrStatus === 'Y') {
                            charitiesMatched.push(charity);
                        }
                    });
                    charitiesMatched.forEach(charity => {
                        if (!allCharitiesMatched.includes(charity)) {
                            allCharitiesMatched.push(charity);
                        }
                    }); 
                }
                else if (filterItem.slice(3) === 'N') {
                    this.state.charities.forEach(charity => {
                        console.log(charity.dgrStatus)
                        if (charity.dgrStatus === 'N') {
                            charitiesMatched.push(charity);
                        }
                    });
                    charitiesMatched.forEach(charity => {
                        if (!allCharitiesMatched.includes(charity)) {
                            allCharitiesMatched.push(charity);
                        }
                    }); 
                }
            }
            else if (filterItem.slice(0,4) === 'size') {
                console.log('size filter being handled', filterItem)
                if (filterItem.slice(4) === 'L') {
                    this.state.charities.forEach(charity => {
                        console.log(charity.size)
                        if (charity.size === 'Large') {
                            charitiesMatched.push(charity);
                        }
                    });
                    charitiesMatched.forEach(charity => {
                        if (!allCharitiesMatched.includes(charity)) {
                            allCharitiesMatched.push(charity);
                        }
                    }); 
                }
                else if (filterItem.slice(4) === 'M') {
                    this.state.charities.forEach(charity => {
                        console.log(charity.size)
                        if (charity.size === 'Medium') {
                            charitiesMatched.push(charity);
                        }
                    });
                    charitiesMatched.forEach(charity => {
                        if (!allCharitiesMatched.includes(charity)) {
                            allCharitiesMatched.push(charity);
                        }
                    }); 
                }
                else if (filterItem.slice(4) === 'S') {
                    this.state.charities.forEach(charity => {
                        console.log(charity.size)
                        if (charity.size === 'Small') {
                            charitiesMatched.push(charity);
                        }
                    });
                    charitiesMatched.forEach(charity => {
                        if (!allCharitiesMatched.includes(charity)) {
                            allCharitiesMatched.push(charity);
                        }
                    }); 
                }
            }
        })

        this.setState({
            doneFilteringCharities: true,
            charitiesFiltered: allCharitiesMatched,
        }); 
    }

    async handleChangeOfTaxFilter(newFilterItems) {
        await this.setState({
            taxDeductFilterItems: newFilterItems
        });
        this.handleFilter();
    }

    async handleChangeOfSizeFilter(newFilterItems) {
        await this.setState({
            sizeFilterItems: newFilterItems
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
                    pathname: '/home',
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

        var { taxDeductFilterItems, sizeFilterItems } = this.state;
        
        const { charities, charitiesFiltered, doneFilteringCharities, currentPage, charitiesPerPage } = this.state;

        const { council } = this.state;

        const indexOfLastCharity = currentPage * charitiesPerPage;
        const indexOfFirstCharity = indexOfLastCharity - charitiesPerPage;
        const charityList = doneFilteringCharities ? charitiesFiltered : charities;
        const currentCharityList = charityList.slice(indexOfFirstCharity, indexOfLastCharity);

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
                charity.percUse = '<10';
                cardPercStyle = {
                    background:'#FF5722',
                    borderRadius: "5px",
                };
            }
            return (
                <li key={index} className="col col-12 d-flex align-items-stretch mx-sm-3 mx-0 mb-3 px-0 hoverable"
                    onClick={() => this.handleOnClickToCharityPage(charity.ABN)} style={{cursor: "pointer"}}>
                    <Card cascade className="w-100">
                        <CardImage tag="div">
                            <div className="#4DD0E1 cyan lighten-2 p-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                <div className="d-flex align-items-center">
                                    <Tooltip 
                                        placement="left" tag="div" component="button" 
                                        componentClass="btn btn-link p-0 mb-1 mt-2"
                                        tooltipContent={charity.percUse + '% of all expenses of this charity went to charitable use.'}> 
                                            <span className="h2-responsive text-white p-2" style={cardPercStyle}>{charity.percUse}%</span>
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
                                <a onClick={this.handleClickToSearch}><u><strong>Back to search</strong></u></a>
                            </div>

                            {/* charity results title */}
                            <div className="col col-12 mt-3">
                                <div className="mb-2">
                                    {this.state.council !== '' && !this.state.isCouncilEmptyOfChar && 
                                        <p>It seems no charities in {valueLocation} support {valueCause}.</p>
                                    }
                                    {this.state.council !== '' && this.state.isCouncilEmptyOfChar &&
                                        <p>It seems no charities in {valueLocation} or in your local council support {valueCause}.</p>
                                    }
                                    <h5>
                                        Charities in&nbsp; 
                                        {this.state.council !== '' && !this.state.isCouncilEmptyOfChar && <span><strong>{council}</strong>, your local council</span>}
                                        {this.state.council !== '' && this.state.isCouncilEmptyOfChar && <strong>Greater Melbourne</strong>}
                                        {this.state.council === '' && <strong>{valueLocation}</strong>}&nbsp; 
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
                                        Showing {Math.min((currentPage - 1) * charitiesPerPage + 1, charityList.length)} to {Math.min(currentPage * charitiesPerPage, charityList.length)} of {charityList.length} results
                                    </h6> 

                                    <div className="ml-2 mt-2">
                                        <Pagination
                                            hideDisabled
                                            linkClass="py-1 px-2"
                                            activeLinkClass="bg-primary rounded text-white"
                                            activePage={currentPage}
                                            itemsCountPerPage={charitiesPerPage}
                                            totalItemsCount={charityList.length}
                                            pageRangeDisplayed={5}
                                            onChange={this.handleClickOnPageNumber}
                                        />
                                    </div>
                                </div>
                                
                                {/* actual charity results */}
                                {charityList.length > 0 &&
                                    <ul className="row card-group list-unstyled mb-0 d-flex justify-content-center">{renderCharities}</ul>
                                }
                                {charityList.length === 0 && 
                                    <p>We haven't got any exact matches for your search at the moment. </p>
                                }
                                
                                {/* result range displayer and pagination */}
                                <div className="row d-flex align-items-center justify-content-between px-3">
                                    <h6 className="small mb-0">
                                        Showing {Math.min((currentPage - 1) * charitiesPerPage + 1, charityList.length)} to {Math.min(currentPage * charitiesPerPage, charityList.length)} of {charityList.length} results
                                    </h6>

                                    <div className="ml-2 mt-2">
                                        <Pagination
                                            hideDisabled
                                            linkClass="py-1 px-2"
                                            activeLinkClass="bg-primary rounded text-white"
                                            activePage={currentPage}
                                            itemsCountPerPage={charitiesPerPage}
                                            totalItemsCount={charityList.length}
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
                                    <p className="h6-responsive font-weight-bold">Tax deductibility</p>
                                    <CheckboxGroup className="d-flex flex-column"
                                        name="tax" value={taxDeductFilterItems} 
                                        checkboxDepth={2} onChange={this.handleChangeOfTaxFilter}>
                                        <label><Checkbox value="taxY"/> Yes</label>
                                        <label><Checkbox value="taxN"/> No</label>
                                    </CheckboxGroup>
                                </div>
                                
                                <hr />

                                {/* by charity size */}
                                <div>
                                    <p className="h6-responsive font-weight-bold">Charity size</p>
                                    <CheckboxGroup className="d-flex flex-column"
                                        name="size" value={sizeFilterItems} 
                                        checkboxDepth={2} onChange={this.handleChangeOfSizeFilter}>
                                        <label><Checkbox value="sizeL"/> Large</label>
                                        <label><Checkbox value="sizeM"/> Medium</label>
                                        <label><Checkbox value="sizeS"/> Small</label>
                                    </CheckboxGroup>
                                </div>
                            </div>

                        </div>
                        
                        {/* back to search button */}
                        <div className="row d-flex justify-content-start m-3">
                            <div className="col col-12 pb-4 small">
                                <a onClick={this.handleClickToSearch}><u><strong>Back to search</strong></u></a>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        );

    }

}

export default CharitySearchResults;
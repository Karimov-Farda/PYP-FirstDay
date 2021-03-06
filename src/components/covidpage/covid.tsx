import React from 'react'
import { useState, useEffect } from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import CountUp from 'react-countup'
import Footer from '../footer'
import '../index.scss'
import { CovidUi } from './covidHeader';
const API_BASE = 'https://coronavirus-monitor.p.rapidapi.com/coronavirus';
const json = (res: any) => res.json();
const details = {
    headers: {
        'x-rapidapi-host': 'coronavirus-monitor.p.rapidapi.com',
        'x-rapidapi-key': '53009286a0mshdc8ec356f7aa205p1e0e80jsn5858f548ed53'
    }
};

const Pagination = ({ totalPageCount, handlePageChange, currentPage }: any) => {

    var elem = [];
    for (var x = totalPageCount - 1; x >= 0; x--) {
        elem.push(x)
    }
    return (
        <nav aria-label="Page navigation example" style={{ height: "90px", padding: "10px 0" }}>
            <ul className="pagination justify-content-center mb-0">
                <li className="page-item">
                    <button style={{ height: "70px" }} onClick={() => handlePageChange(
                        Math.max(currentPage - 1, 1))}
                        className="page-link font-weight-bold text-dark">Previous</button></li>
                {elem.reverse().map(num => (<li className={`page-item ${num + 1 === currentPage && 'active'}`} key={num}>
                    <button style={{ height: "70px" }} onClick={() => handlePageChange(num + 1)} className="page-link font-weight-bold text-dark">{num + 1} </button></li>
                ))}
                <li className="page-item"><button style={{ height: "70px" }} onClick={() => handlePageChange(
                    Math.min(currentPage + 1, totalPageCount)
                )} className="page-link font-weight-bold text-dark">Next</button></li>    </ul>
        </nav>)
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export default function CovidPage() {
    const classes = useStyles();

    let b: any = {}
    let [countries, setCountries] = useState(b)
    const catchJSON = (url: string, details: any) => fetch(url, details).then(json).then(data => { setCountries(data) });
    const random = (url: any) => `${API_BASE}/${url}.php?_=${Math.random()}`;
    const catchData = () => [
        catchJSON(random('cases_by_country'), details)
    ]
    const refresh = () => Promise.all(catchData()).then()
    document.addEventListener("DOMContentLoaded", refresh)
    const countriesArray = countries.countries_stat
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [totalPageCount, SetTotalPageCount] = useState(0);
    const [query, setQuery] = useState('');
    const handleItemsperPage = (evt: any) => {
        setItemsPerPage(parseInt(evt.target.value));
        setCurrentPage(1)
    }
    const computedRecords = (() => {
        let computed = countriesArray;
        computed = countriesArray && computed.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage)
        if (query) {
            computed = countriesArray && computed.filter((item: any) => item.country_name.toLowerCase().includes(query.toLowerCase()) || `${item.country_name}`.toLowerCase().includes(query.toLowerCase()))
        }
        return computed
    })();
    useEffect(() => {
        if (countriesArray && countriesArray.length) {
            const recordsLength = query.length ? true : countriesArray.length;
            let totalCount = Math.ceil(recordsLength / itemsPerPage);
            SetTotalPageCount(totalCount)
        }
    }, [countriesArray, query.length, itemsPerPage]);

    return (
        <div className="container-fluid w-100 covid-table" style={{ paddingRight: "0", paddingLeft: "0", background: `URL(https://www.howdengroup.com/sites/g/files/mwfley576/files/styles/video_poster_1280_720/public/2020-04/covid_virus_1.jpg?h=dbbf4568&itok=YVHEkBAM)` }}>
            {countriesArray ? '' : <Backdrop className={classes.backdrop} open>
                <CircularProgress color="inherit" />
                <h3 style={{ display: "block", marginLeft: '1rem' }}>   Loading ... </h3>
            </Backdrop>}
            <CovidUi />
            <div className="row" >
                <div className="col-xl-12 col-lg-12">
                    <div className="card shadow mb-4" style={{ width: "95%", margin: "0 auto" }} id="table-card">
                        <div className="card-header d-flex justify-content-between" style={{ height: "70px" }}>
                            <form className="search-container">
                                <input type="text" value={query} onChange={evt => setQuery(evt.target.value)} id="search-bar" placeholder="Search country name "></input>
                                <a href="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png"><img className="search-icon" alt="covid-background" src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png"></img></a>
                            </form>
                            <div className="w-25">
                                <label style={{ fontWeight: "bold", color: "black", paddingRight: "10px", display: "inline-block" }}>Items per page : </label>
                                <select onChange={handleItemsperPage} value={itemsPerPage} className="px-2 ml-2 bg-light text-danger py-1 border-none font-weight-bold" name="itemsPerPage" style={{ fontWeight: "bold", width: "20%", border: "none", display: "inline-block" }} id="itemsPerPage">
                                    <option className={'font-weight-bold'} style={{ cursor: "pointer" }} value="20">20</option>
                                    <option className={'font-weight-bold'} style={{ cursor: "pointer" }} value="30">30</option>
                                    <option className={'font-weight-bold'} style={{ cursor: "pointer" }} value="50">50</option>
                                </select>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table id="country-detail" className="table table-striped table-bordered table-hover">
                                    <thead className="table-dark">
                                        <tr className="covid-data-table-row">
                                            <th>#</th>
                                            <th>Country</th>
                                            <th>Cases</th>
                                            <th>New Cases</th>
                                            <th>Deaths</th>
                                            <th>New Deaths</th>
                                            <th>Active Cases</th>
                                            <th>Critical</th>
                                            <th>Recovered</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {countriesArray && computedRecords.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                                <td><b>{item.country_name}</b></td>
                                                <td>{countriesArray ? <CountUp end={Number(item.cases.split(",").join(""))} /> : 0}</td>
                                                <td><b className="text-warning font-weight-bold">{item.new_cases}</b></td>
                                                <td>{item.deaths}</td>
                                                <td><b className="text-danger font-weight-bold">{item.new_deaths}</b></td>
                                                <td>{item.active_cases}</td>
                                                <td>{item.serious_critical}</td>
                                                <td>{countriesArray ? <CountUp end={Number(item.total_recovered.split(",").join(""))} /> : 0}</td>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row">
                                <div className="col-12 ">
                                    <Pagination
                                        totalPageCount={totalPageCount}
                                        handlePageChange={setCurrentPage}
                                        currentPage={currentPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}




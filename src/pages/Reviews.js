import React, { useState, useEffect } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Divider } from "@mui/material";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReviewTable from "../components/ReviewTable";
import { getStorageToken,getUserID } from "../context/Auth";
import ReviewModal from "../components/ReviewModal.js";
import '../styles/Table.css'

const URL = process.env.REACT_APP_API_URL;

const tableHeadersAssigned = [
   'Venue', 'Paper', 'Status', " "
]
const tableHeadersProposed = [
    'Venue', 'Status', " "
 ]
 const tableHeadersSubmitted = [
    'Venue', 'Paper', 'Status'
 ]

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function getStatusLabel(status) {
    let color = "rgb(0, 0, 0)";
    if (status === "ACCEPTED") {color = "green" }
    else if (status === "RECEIVED") {color = "cyan" }
    else if (status === "REJECTED") {color = "red" }
    else if (status === "In Progress") {color = "rgb(163, 160, 249)" }
    else {color = "rgb(249, 160, 163)" }

    return (
        <Typography><span className='labelSpan' style={{backgroundColor: color}}>{status}</span></Typography>
    )
}


export default function Reviews() {
    const [value, setValue] = useState(0);
    const [assignedData, setAssignedData] = useState({head: tableHeadersAssigned, rows: [[]]});
    const [proposedData, setProposedData] = useState({head: tableHeadersProposed, rows: [[]]});
    const [submittedData, setSubmittedData] = useState({head: [], rows: [[]]});
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const openModalWithData = async (id,submission_id) => {
        await setModalData(assignedData.rows[id]);
        console.log("hereee",assignedData.rows[id])
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setModalData(null);
        fetchReviewerdata();
        console.log("Closing modal")
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const tableActions = (review,index,assigned) => {

        const accept = (review) => {
            //add api call for accepting review
            fetch(URL + `api/proposals/${review.id}/accept/`, {
                method: 'POST',
                credentials: "same-origin",
                headers: {
                    'Authorization': `Token ${getStorageToken()}`,
                    'Content-Type':'application/json'
                }
            })
            .then(resp=>{
                if (resp.status >= 400) throw new Error();
                return resp.json();
            })
            .then(resp=>{
                //update table
                fetchReviewerdata();
            })
            .catch(error=>{
                console.log(error);
            })
            
            }
        const submit = (review) => {
            //add api call for accepting review
            fetch(URL + `api/reviewers/${review.id}/`, {
                method: 'PATCH',
                credentials: "same-origin",
                headers: {
                    'Authorization': `Token ${getStorageToken()}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    "is_submitted": "true",
                })
            })
            .catch(error=>{
                console.log(error);
            })
            //update table
            fetchReviewerdata();
            }
        
        const edit = (review,index) => {
            //add api call for editing review
            //update table

            for(let i=0;i<100000;i++){}
            openModalWithData(index,review.id);

            }
        const del = (review) => {
            //add api call for deleting review
            //update table
            fetch(URL + `api/proposals/${review.id}/reject/`, {
                method: 'POST',
                credentials: "same-origin",
                headers: {
                    'Authorization': `Token ${getStorageToken()}`,
                    'Content-Type':'application/json'
                },
            })
            .then(resp=>{
                if (resp.status >= 400) throw new Error();
                return resp.json();
            })
            .then(resp=>{
                //update table
                fetchReviewerdata();
            })
            .catch(error=>{
                console.log(error);
            })
            //update table
            fetchReviewerdata();
            }

        return (
            <Typography>
                {/* <CheckCircleOutlinedIcon onClick={()=>{accept(review)}} sx={{ "&:hover": { color: "cyan" }, }}/> */}
                {/* <EditIcon onClick={()=>{edit(review)}} sx={{ "&:hover": { color: "red" } }}/>    */}
                {!assigned && review.status!="ACCEPTED" && <CheckCircleOutlinedIcon sx={{ "&:hover": { color: "green" } }} onClick={()=>{accept(review,index)}}/> }
                {/* {assigned && <CheckCircleOutlinedIcon sx={{ "&:hover": { color: "green" } }} onClick={()=>{submit(review,index)}}/> } */}
                {assigned && <EditIcon sx={{ "&:hover": { color: "cyan" } }} onClick={()=>{edit(review,index)}}/> }
                {!assigned && review.status!="ACCEPTED" && <DeleteIcon sx={{ "&:hover": { color: "red" } }} onClick={()=>{del(review,index)}}/> }
            </Typography>
        )
    }

    function fetchReviewerdata() {
        //for accepted table
        fetch(URL + `api/reviewers/?user_id=${getUserID()}`,
                {
                    method: 'GET',
                    credentials: "same-origin",
                    headers: {
                            'Authorization': `Token ${getStorageToken()}`,
                            'Content-Type':'application/json'
                    }
                })
                .then(resp=>{
                    if (resp.status >= 400) throw new Error();
                    return resp.json();
                })
                .then(resp=>{
                    let data = [];
                    resp.results.forEach((item, index) => {
                                    if(!item.is_submitted)
                                    {
                                        let pushdata = [
                                            item.submission.venue.name,
                                            item.submission.name,
                                            getStatusLabel("Assigned"),
                                            tableActions(item,index,true),
                                            // item.comments, //NAJIB
                                            item.id
                                        ];
                                        data.push(pushdata);
                                    }
                                    
                                    
                                })
                            
                            setAssignedData({head: tableHeadersAssigned, rows: data});
                })
                .catch(error=>{
                    console.log(error);
                })
        //for proposal table
        fetch(URL + `api/proposals/`,
            {
                method: 'GET',
                credentials: "same-origin",
                headers: {
                        'Authorization': `Token ${getStorageToken()}`,
                        'Content-Type':'application/json'
                }
            })
            .then(resp=>{
                if (resp.status >= 400) throw new Error();
                return resp.json();
            })
            .then(resp=>{
                let data = [];
                resp.results.forEach((item, index) => {
                                if(item.reviewer==getUserID())
                                {
                                    //again an api call to get venue name from venue id
                                    fetch(URL + `api/venues/${item.venue}/`,
                                    {
                                        method: 'GET',
                                        credentials: "same-origin",
                                        headers: {
                                                'Authorization': `Token ${getStorageToken()}`,
                                                'Content-Type':'application/json'
                                        }
                                    })
                                    .then(resp=>{
                                        if (resp.status >= 400) throw new Error();
                                        return resp.json();
                                    })
                                    .then(resp=>{
                                        if(item.status!="REJECTED")
                                        {
                                            let pushdata = [
                                                resp.name,
                                                getStatusLabel(item.status),
                                                tableActions(item,index,false),
                                                item.id,
                                                item.sent
                                            ];
                                            data.push(pushdata);
                                        }
                                        
                                        setProposedData({head: tableHeadersProposed, rows: data});
                                    })
                                    .catch(error=>{
                                        console.log(error);
                                    })

                                    
                                }
                                
                                
                            })
                        
            })
            .catch(error=>{
                console.log(error);
            })

        //for submitted table
        fetch(URL + `api/reviewers/?is_submitted=true`,
        {
            method: 'GET',
            credentials: "same-origin",
            headers: {
                    'Authorization': `Token ${getStorageToken()}`,
                    'Content-Type':'application/json'
            }
        })
        .then(resp=>{
            if (resp.status >= 400) throw new Error();
            return resp.json();
        })
        .then(resp=>{
            let data = [];
            resp.results.forEach((item, index) => {
                
                    let pushdata = [
                        item.submission.venue.name,
                        item.submission.name,
                        getStatusLabel("ACCEPTED")

                    ];
                    data.push(pushdata);
            })

            setSubmittedData({head: tableHeadersSubmitted, rows: data});
        })
        .catch(error=>{
            console.log(error);
        })
        
    }

    useEffect(() => {
        fetchReviewerdata()
    }, [])

    


    return (
        <React.Fragment>
            <h1>Reviews</h1>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Assigned" {...a11yProps(0)} />
            <Tab label="Proposed" {...a11yProps(1)} />
            <Tab label="Submitted" {...a11yProps(2)} />
            </Tabs>
                
            <TabPanel value={value} index={0}>
                    <ReviewTable data={assignedData}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                    <ReviewTable data={proposedData}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                    <ReviewTable data={submittedData}/>
            </TabPanel>
        
        { openModal && <ReviewModal data={modalData} isOpen={true} handleClose={closeModal} /> }
        </React.Fragment>
    )
}
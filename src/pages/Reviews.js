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
import { getStorageToken } from "../context/Auth";
import ReviewModal from "../components/ReviewModal.js";
import '../styles/Table.css'

const URL = process.env.REACT_APP_API_URL;

const tableHeadersAssigned = [
   'Venue', 'Paper', 'Status', " "
]
const tableHeadersProposed = [
    'Venue', 'Paper', " "
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
    if (status === "Done") {color = "rgb(150, 242, 119)" }
    else if (status === "Start") {color = "cyan" }
    else if (status === "Pending") {color = "rgb(254, 137, 111)" }
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

    const openModalWithData = (id) => {
        setModalData({results: assignedData.rows[id],reviewer_id:15});
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setModalData(null);
        console.log("Closing modal")
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const tableActions = (review,index) => {

        const accept = (review) => {
            //add api call for accepting review
            //update table
            }
        
        const edit = (review,index) => {
            //add api call for editing review
            //update table
            openModalWithData(index);

            }
        const del = (review) => {
            //add api call for deleting review
            //update table
            }

        return (
            <Typography>
                {/* <CheckCircleOutlinedIcon onClick={()=>{accept(review)}} sx={{ "&:hover": { color: "cyan" }, }}/> */}
                {/* <EditIcon onClick={()=>{edit(review)}} sx={{ "&:hover": { color: "red" } }}/>    */}
                <CheckCircleOutlinedIcon sx={{ "&:hover": { color: "green" } }}/> 
                {review.assigned && <EditIcon sx={{ "&:hover": { color: "cyan" } }} onClick={()=>{edit(review,index)}}/> }
                {!review.assigned && <DeleteIcon sx={{ "&:hover": { color: "red" } }}/> }
            </Typography>
        )
    }

    function fetchReviewerdata() {
        //add api call
        fetch(URL + 'api/submissions/?reviewers=1',
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
                    let assigned=true; //change for proposed
                    resp.results.forEach((item, index) => {
                                    item.assigned = assigned;
                                    let pushdata = assigned ? [
                                        item.venue.name,
                                        item.project.name,
                                        getStatusLabel(item.status),
                                        tableActions(item,index),
                                        item.comments
                                    ] : [
                                        item.venue.name,
                                        item.project.name,
                                        tableActions(item)
                                    ];
                                    data.push(pushdata);
                                    
                                })
                            
                            setAssignedData(assigned ? {head: tableHeadersAssigned, rows: data} : assignedData);
                            setProposedData(assigned ? proposedData : {head: tableHeadersProposed, rows: data});
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
        
        <ReviewModal data={modalData} isOpen={openModal} handleClose={closeModal} />
        </React.Fragment>
    )
}
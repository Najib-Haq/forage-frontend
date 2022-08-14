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
    else if (status === "Feedback") {color = "cyan" }
    else if (status === "Pending") {color = "rgb(254, 137, 111)" }
    else if (status === "In Progress") {color = "rgb(163, 160, 249)" }

    return (
        <Typography><span className='labelSpan' style={{backgroundColor: color}}>{status}</span></Typography>
    )
}


export default function Reviews() {
    const [value, setValue] = useState(0);
    const [assignedData, setAssignedData] = useState({head: [], rows: [[]]});
    const [proposedData, setProposedData] = useState({head: [], rows: [[]]});

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getTableData = (apidata,assigned) => {
        let data = []
        apidata.results.forEach((item, index) => {
            let pushdata = assigned ? [
                item.venue,
                item.paper,
                getStatusLabel(item.status),
                tableActions(item)
            ] : [
                item.venue,
                item.paper,
                tableActions(item)
            ];
            data.push(pushdata);
        })
        
        let tableData = assigned ? {head: tableHeadersAssigned, rows: data} : {head: tableHeadersProposed, rows: data};
        return tableData;
    };

    const tableActions = (review) => {

        const accept = (review) => {
            //add api call for accepting review
            //update table
            }
        
        const edit = (review) => {
            //add api call for editing review
            //update table
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
                {review.assigned && <EditIcon sx={{ "&:hover": { color: "cyan" } }}/> }
                {!review.assigned && <DeleteIcon sx={{ "&:hover": { color: "red" } }}/> }
            </Typography>
        )
    }

    function fetchReviewerdata() {
        //add api call
        var dummydata1 = 
        {
            "count": 4,
            "results": [
                {
                    "id": 14,
                    "venue": "CVPR'22",
                    "paper": "Firecracker: Lightweight Virtualization for Serverless Applications",
                    "status": "Pending",
                    "assigned" : true
                },
                {
                    "id": 13,
                    "venue": "CVPR'22",
                    "paper": "Faasm: Lightweight Isolation for Efficient Stateful Serverless Computing",
                    "status": "Feedback",
                    "assigned" : true
                },
                {
                    "id": 12,
                    "venue": "CVPR'22",
                    "paper": "Sledge: a Serverless-first, Light-weight Wasm Runtime for the Edge",
                    "status": "In Progress",
                    "assigned" : true
                },
                {
                    "id": 11,
                    "venue": "CVPR'22",
                    "paper": "Sledge: a Serverless-first, Light-weight Wasm Runtime for the Edge",
                    "status": "Feedback",
                    "assigned" : true
                }
            ]
        };
        setAssignedData(getTableData(dummydata1,true));

        var dummydata2 = 
        {
            "count" : 4,
            "results" : [
                {
                    "id": 14,
                    "venue": "CVPR'22",
                    "paper": "Firecracker: Lightweight Virtualization for Serverless Applications",
                    "assigned" : false
                },
                {
                    "id": 13,
                    "venue": "CVPR'22",
                    "paper": "Faasm: Lightweight Isolation for Efficient Stateful Serverless Computing",
                    "assigned" : false
                },
                {
                    "id": 12,
                    "venue": "CVPR'22",
                    "paper": "Sledge: a Serverless-first, Light-weight Wasm Runtime for the Edge",
                    "assigned" : false
                },
                {
                    "id": 11,
                    "venue": "CVPR'22",
                    "paper": "Sledge: a Serverless-first, Light-weight Wasm Runtime for the Edge",
                    "assigned" : false
                }
            ]
        };
        setProposedData(getTableData(dummydata2,false));
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
            </Tabs>
                
            <TabPanel value={value} index={0}>
                    <ReviewTable data={assignedData}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                    <ReviewTable data={proposedData}/>
            </TabPanel>
            
        </React.Fragment>
    )
}
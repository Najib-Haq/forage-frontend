import React, { useState, useEffect } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Divider } from "@mui/material";
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

import TaskTable from "../components/TaskTable";
import { getStorageToken } from "../context/Auth";
import '../styles/Table.css'

const URL = process.env.REACT_APP_API_URL;

const tableHeaders = [
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


function getTableData(apidata) {
    console.log(apidata);
    let data = []
    apidata.results.forEach((item, index) => {
        data.push([
            item.venue,
            item.paper,
            item.status
        ])
    })

    return {head: tableHeaders, rows: data};
}




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


export default function Reviews() {
    const [value, setValue] = useState(0);
    const [assignedData, setAssignedData] = useState({});
    const [proposedData, setProposedData] = useState({});

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                    "status": "Pending",
                    "assigned" : true
                },
                {
                    "id": 12,
                    "venue": "CVPR'22",
                    "paper": "Sledge: a Serverless-first, Light-weight Wasm Runtime for the Edge",
                    "status": "Pending",
                    "assigned" : true
                },
                {
                    "id": 11,
                    "venue": "CVPR'22",
                    "paper": "Sledge: a Serverless-first, Light-weight Wasm Runtime for the Edge",
                    "status": "Pending",
                    "assigned" : true
                }
            ]
        };
        setAssignedData(getTableData(dummydata1));

        var dummydata2 = 
        {
            "count" : 4,
            "results" : [
                {
                    "id": 14,
                    "venue": "CVPR'22",
                    "paper": "Firecracker: Lightweight Virtualization for Serverless Applications",
                    "status": "Pending",
                    "assigned" : false
                },
                {
                    "id": 13,
                    "venue": "CVPR'22",
                    "paper": "Faasm: Lightweight Isolation for Efficient Stateful Serverless Computing",
                    "status": "Pending",
                    "assigned" : false
                },
                {
                    "id": 12,
                    "venue": "CVPR'22",
                    "paper": "Sledge: a Serverless-first, Light-weight Wasm Runtime for the Edge",
                    "status": "Pending",
                    "assigned" : false
                },
                {
                    "id": 11,
                    "venue": "CVPR'22",
                    "paper": "Sledge: a Serverless-first, Light-weight Wasm Runtime for the Edge",
                    "status": "Pending",
                    "assigned" : false
                }
            ]
        };
        setProposedData(getTableData(dummydata2));
    }

    useEffect(() => {
        fetchReviewerdata()
    }, [])


    return (
        <React.Fragment>
            <h1>Reviews Page</h1>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Assigned" {...a11yProps(0)} />
            <Tab label="Proposed" {...a11yProps(1)} />
            </Tabs>
                
            <TabPanel value={value} index={0}>
                    <TaskTable data={assignedData}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            
        </React.Fragment>
    )
}
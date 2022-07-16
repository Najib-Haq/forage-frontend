import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

import TaskTable from "../components/TaskTable";
import { getStorageToken } from "../context/Auth";
import '../styles/Table.css'

const tableHeaders = [
   'ID', 'Task Name', 'Paper', 'Status', 'Project', 'Start Date', 'Due Date'
]

const URL = process.env.REACT_APP_API_URL;

function getDateLabel(date) {
    const currentDate = new Date();
    const givenDate = new Date(date);
    const text = givenDate.getDay() + "/" + givenDate.getMonth() + "/" + givenDate.getFullYear()

    // return (
    //     <Typography>
    //         <AccessTimeOutlinedIcon/>    
    //         <span className='labelSpan'>{text}</span>
    //     </Typography>
    // )
    return (
        <Typography>
            <span className='labelSpan'>
                <AccessAlarmOutlinedIcon/> {text}
            </span>
        </Typography>
    )

    return text;
}

function getTableData(apidata) {
    let data = []
    apidata.results.forEach((item, index) => {
        data.push([
            item.id, 
            item.name,
            item.project_paper, // TODO: need to change this to paper name
            <Typography><span className='labelSpan'>{item.status}</span></Typography>, // 
            item.project_paper, // TODO: need to change this to project name
            getDateLabel(item.start_date), 
            getDateLabel(item.due_date)
        ])
    })

    return {head: tableHeaders, rows: data};
}

export default function MyTasks() {
    const [data, setData] = useState({head: [], rows: [[]]});

    useEffect(() => {
        fetch(URL + 'api/tasks/', //TODO: filter using user id
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
                setData(getTableData(resp))
            })
            .catch(error=>{
                console.log(error);
            })
    }, [])


    
    return (
        <React.Fragment>
            <TaskTable data={data}/>
        </React.Fragment>
    );
}

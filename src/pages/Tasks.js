import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid'
import Typography from "@mui/material/Typography"
import Button, { ButtonProps } from '@mui/material/Button';
// import SearchBar from "../components/SearchBar"
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';
import TaskModal from "../components/TaskModal";
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import TaskTable from "../components/TaskTable";
import { getStorageToken } from "../context/Auth";
import { getStorageProjID, useProjID} from "../context/ProjectID";
import '../styles/Table.css'

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const URL = process.env.REACT_APP_API_URL;

const tableHeaders = [
   'ID', 'Task Name', 'Paper', 'Status', 'Project', 'Start Date', 'Due Date', " "
]


function getDateLabel(date, due, status) {
    const currentDate = new Date();
    const givenDate = new Date(date);
    // const text = givenDate.getDay().toString().padStart(2, "0") + "/" + givenDate.getMonth().toString().padStart(2, "0") + "/" + givenDate.getFullYear()
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const text = givenDate.toLocaleDateString("en-US", options)
    // console.log("in tasks ", givenDate, givenDate.getDay(), givenDate.getMonth())

    let spanClass = "labelSpan";
    if (status === "Done") {
        spanClass = "labelSpanDone"
    }
    else if (givenDate < currentDate) {
        spanClass = "labelSpanOverdue"
    }

    return (
        <Typography variant="h7">
            {
                due ? (
                    <span className={spanClass}>
                        {text} 
                        { spanClass === "labelSpanOverdue" && <AccessAlarmOutlinedIcon color="error" sx={{ fontSize: 15, margin: 0, padding: 0 }}/> }
                        { spanClass === "labelSpanDone" && <CheckCircleOutlinedIcon color="primary" sx={{ fontSize: 15, margin: 0, padding: 0 }}/> }
                    </span>
                ) : <span>{text}</span>
            }
        </Typography>
    )
    return text;
}


function getStatusLabel(status) {
    let color = "rgb(0, 0, 0)";
    if (status === "Done") {color = "rgb(150, 242, 119)" }
    else if (status === "Progress") {color = "cyan" }
    else if (status === "Later") {color = "rgb(254, 137, 111)" }
    else if (status === "Next") {color = "rgb(163, 160, 249)" }

    return (
        <Typography><span className='labelSpan' style={{backgroundColor: color}}>{status}</span></Typography>
    )
}


export default function Tasks() {
    const { projID } = useProjID();
    const [search, setSearch] = useState("");
    const [data, setData] = useState({head: [], rows: [[]]});
    const [openModal, setOpenModal] = useState(false);

    const handleModalClose = () => {
        setOpenModal(false);
        getTasks();
    }

    const getTableData = (apidata) => {
        let data = []
        apidata.forEach((item, index) => {
            console.log("in tble: ", item)
            data.push([
                item.id, 
                item.name,
                (item.project_paper === null) ? "" :item.project_paper.paper.substring(0, 20) + '...', 
                getStatusLabel(item.status), // 
                item.project.name, 
                getDateLabel(item.start_date, false), 
                getDateLabel(item.due_date, true, item.status),
                tableActions(item)
            ])
        })
    
        return {head: tableHeaders, rows: data};
    }

    const getTasks = () => {
        fetch(URL + `api/projects/${getStorageProjID()}`, //TODO: filter using user id
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
            console.log(resp.tasks)
            setData(getTableData(resp.tasks))
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const tableActions = (task) => {

        const updateTask = (task) => {
            if(task.status === "Done") task.status = "Next";
            else task.status = "Done"
    
            fetch(URL + `api/tasks/${task.id}/`, {
                method: 'PUT',
                credentials: "same-origin",
                headers: {
                    'Authorization': `Token ${getStorageToken()}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({ 
                    name: task.name, 
                    status: task.status, 
                    start_date: task.start_date,
                    due_date: task.due_date,
                    project_id: task.project.id,
                    project_paper_id: task.project_paper.id
                })
            })
            .catch(error=>{
                console.log(error);
            })
            getTasks();
        }
    
        const deleteTask = (task) => {
            fetch(URL + `api/tasks/${task.id}/`, {
                method: 'DELETE',
                credentials: "same-origin",
                headers: {
                    'Authorization': `Token ${getStorageToken()}`,
                    'Content-Type':'application/json'
                },
            })
            .then(resp=>{
                getTasks();
            })
            .catch(error=>{
                console.log(error);
            })
        }
    
        return (
            <Typography>
                <CheckCircleOutlinedIcon onClick={()=>{updateTask(task)}} sx={{ "&:hover": { color: "green" }}}/>
                <DeleteIcon onClick={()=>{deleteTask(task)}} sx={{ "&:hover": { color: "red" } }}/>   
                {/* <EditIcon sx={{ "&:hover": { color: "green" } }}/>  */}
            </Typography>
        )
    }

    useEffect(() => {
        if(projID != null) getTasks();
    }, [projID]);

    return (
        <React.Fragment>
            {/* <h1>Tasks Page</h1> */}

            <Grid container justifyContent="flex-end">
                {/* <Grid item>
                    <SearchBar
                        data={search}
                        handleSearch={(data) => {setSearch(data); console.log(data)}}
                    />
                </Grid> */}

                <Grid item>
                    <Button 
                        variant="outlined" 
                        size="large" 
                        startIcon={<AddIcon />}
                        style={{borderColor: "black", color: "black"}}
                        onClick={()=>{setOpenModal(true)}}
                        // color="black"
                    >Create Task</Button>
                </Grid> 
            </Grid>

            <TaskTable data={data} handleModalClose={getTasks}/>

            <TaskModal isOpen={openModal} handleClose={handleModalClose} projectTask={true}/>
        </React.Fragment>
    )
}
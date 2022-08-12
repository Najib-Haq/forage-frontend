import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';


import { getStorageToken } from "../context/Auth";
import { getStorageProjID } from "../context/ProjectID";


/* 
    define props=> 
        isOpen: will open the modal
        handleClose: what to do when closing the modal
        data: data to display
        projectTask: if True then project Tasks else user tasks only
*/

const URL = process.env.REACT_APP_API_URL;

export default function TaskModal(props) {
    const [task, setTask] = useState({
        id: "",
        name: "",
        status: "",
        start_date: new Date(),
        due_date: null,
        project_paper: {
            id: null,
            paper: ""
        },
        project: {
            id: null,
            name: ""
        },
        depends_on: [],
        next: []
    });
    const [projectTasks, setProjectTasks] = useState(null);
    
    const [list, setList] = useState("");
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(null);

    const addDependsOn = (taskid, depId) => {
        fetch(URL + `api/tasks/${taskid}/depends_on/`, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ dep_id: depId })
        })
        .catch(error=>{
            console.log(error);
        })
        loadData();
    }

    const updateTask = () => {
        fetch(URL + `api/tasks/${task.id}/`, {
            method: 'PUT',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ 
                name: name, 
                status: list, 
                start_date: startDate,
                due_date: dueDate,
                project_id: task.project.id
            })
        })
        .catch(error=>{
            console.log(error);
        })
        props.handleClose();
    }

    const createTask = () => {
        fetch(URL + `api/tasks/`, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ 
                name: name, 
                status: list, 
                start_date: startDate,
                due_date: dueDate,
                project_id: getStorageProjID(),
                project_paper_id: task.project_paper.id
            })
        })
        .then(resp=>{
            if (resp.status >= 400) throw new Error();
            return resp.json();
        })
        .then(resp=>{
            console.log("here : ", resp)
            setTask({...task, id:resp.id});
        })
        .catch(error=>{
            console.log(error);
        })
        // props.handleClose();
    }

    const deleteDependsOn = (task_id) => {
        fetch(URL + `api/tasks/${task.id}/`, {
            method: 'DELETE',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
        })
        .catch(error=>{
            console.log(error);
        })
    }


    const loadData = async () => {
        // Get the task
        await fetch(URL + `api/tasks/${props.data[0]}`, {
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
            // setProjectList(resp.results)
            // console.log(resp);
            setTask(resp);
            setName(resp.name);
            setList(resp.status);
            setStartDate(resp.start_date);
            setDueDate(resp.due_date);

            // // Get task for dependencies
            // fetch(URL + `api/projects/${task.project.id}`, {
            //     method: 'GET',
            //     credentials: "same-origin",
            //     headers: {
            //         'Authorization': `Token ${getStorageToken()}`,
            //         'Content-Type':'application/json'
            //     }
            // })
            // .then(resp=>{
            //     if (resp.status >= 400) throw new Error();
            //     return resp.json();
            // })
            // .then(resp=>{
            //     setProjectTasks(resp.tasks);
            // })
            // .catch(error=>{
            //     console.log(error);
            // })
        })
        .catch(error=>{
            console.log(error);
        })
    };

    const getTasks = (task_project_id) => {
        fetch(URL + `api/projects/${task_project_id}`, {
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
            setProjectTasks(resp.tasks);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    useEffect(() => {
        console.log(props.data);
        if (props.data)
            loadData();
    }, [props.data]);
    

    useEffect(() => {
        if(props.projectTask) getTasks(getStorageProjID());
    }, []);

  
    return (task &&
        <Dialog open={props.isOpen} onClose={props.handleClose}>
            <DialogTitle>{
                    task.id ? `Task #${task.id}` : "Add Task"
                }</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="name"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="demo-simple-select-label">List</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={list}
                        label="List"
                        onChange={(e) => setList(e.target.value)}
                    >
                        <MenuItem value=''></MenuItem>
                        <MenuItem value='Next'>Next</MenuItem>
                        <MenuItem value='Progress'>Progress</MenuItem>
                        <MenuItem value='Done'>Done</MenuItem>
                        <MenuItem value='Later'>Later</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <DateTimePicker
                        label="Start Date"
                        value={startDate}
                        onChange={setStartDate}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <DateTimePicker
                        label="Due Date"
                        value={dueDate}
                        onChange={setDueDate}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </FormControl>

                <hr />


                {
                    task.id && 
                    <React.Fragment>    
                        <FormControl fullWidth sx={{ pb: 3 }}>
                            <InputLabel id="depends-on">Depends on</InputLabel>
                            <Select
                                labelId="depends-on"
                                id="demo-simple-select"
                                // value=""
                                label="Depends on"
                                onChange={(e) => setTask({...task, depends_on:task.depends_on.concat(e.target.value)})}
                            >
                                {projectTasks && projectTasks.map((data, index) => (
                                    <MenuItem value={data.id} key={index} onClick={() => addDependsOn(task.id, data.id)}>
                                        {data.name}
                                    </MenuItem>
                                ))}
                            </Select>

                            <nav aria-label="secondary mailbox folders">
                                <List>
                                    {task.id && task.depends_on.map((data, index) => (
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                            <ListItemText primary={data.before} />
                                            </ListItemButton>
                                            <Button onClick={()=>{deleteDependsOn(task.id); setTask({...task, depends_on:task.depends_on.filter(item=> item.before!=data.before)})}}>X</Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </nav>
                        </FormControl>

                        <hr />
                        <FormControl fullWidth sx={{ pb: 3 }}>
                            <InputLabel id="depends-on">Next</InputLabel>
                            <Select
                                labelId="next"
                                id="demo-simple-select"
                                value={task.depends_on ? task.depends_on[0] : ""}
                                label="Next"
                                onChange={(e) => setTask({...task, next:task.next.concat(e.target.value)})}
                            >
                                {projectTasks && projectTasks.map((data, index) => (
                                    <MenuItem value={data.id} key={index} onClick={() => addDependsOn(data.id, task.id)}>
                                        {data.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <nav aria-label="secondary mailbox folders">
                                <List>
                                    {task && task.next.map((data, index) => (
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                            <ListItemText primary={data.after} />
                                            </ListItemButton>
                                            <Button onClick={()=>{deleteDependsOn(task.id); setTask({...task, next:task.next.filter(item=> item.after!=data.after)})}}>X</Button>
                                        
                                        </ListItem>
                                    ))}
                                </List>
                            </nav>
                        </FormControl>
                    </React.Fragment>
                }
                
                </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Back</Button>
                <Button variant="outlined" color="success" onClick={task.id ? updateTask : createTask}>Save</Button>
            </DialogActions>
        </Dialog>
    );
  }
  
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
        due_date: new Date(),
        project_paper: {
            id: null,
            paper: ""
        },
        project: {
            id: null,
            name: ""
        },
        collaborators: [],
        depends_on: [],
        next: []
    });
    const [projectTasks, setProjectTasks] = useState(null);
    const [projectPapers, setProjectPapers] = useState(null);
    const [projectColabs, setProjectColabs] = useState(null);
    
    const [list, setList] = useState("");
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(null);

    const addCollaborator = (taskid, colabId) => {
        fetch(URL + `api/tasks/${taskid}/assignees/`, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ colab_id: colabId })
        })
        .catch(error=>{
            console.log(error);
        })
        loadData();
    }

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
                project_id: task.project.id,
                project_paper_id: task.project_paper.id
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

    const deleteTask = () => {
        fetch(URL + `api/tasks/${task.id}/`, {
            method: 'DELETE',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
        })
        .then(resp=>{
            props.handleClose();
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const unassignCollaborator = (colabId) => {
        fetch(URL + `api/tasks/${task.id}/assignees/`, {
            method: 'DELETE',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ colab_id: colabId })
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const deleteDependsOn = (depId) => {
        fetch(URL + `api/tasks/${task.id}/depends_on/`, {
            method: 'DELETE',
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
    }

    const getPapers = (project_id) => {
        fetch(URL + `api/projects/${project_id}/papers`, {
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
            setProjectPapers(resp.results);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const getColabs = (project_id) => {
        fetch(URL + `api/projects/${project_id}/collaborators`, {
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
            // setProjectColabs(resp.results.map((item) => item.collaborator));
            setProjectColabs(resp.results);
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
            resp.collaborators = [];
            setTask(resp);
            setName(resp.name);
            setList(resp.status);
            setStartDate(resp.start_date);
            setDueDate(resp.due_date);
            
            // Get task for dependencies
            fetch(URL + `api/projects/${resp.project.id}`, {
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


            // get papers list
            getPapers(resp.project.id);

            // get colab list
            getColabs(resp.project.id);
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
        if(props.projectTask) {
            getTasks(getStorageProjID());
            getPapers(getStorageProjID());
            getColabs(getStorageProjID());
        }
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
                        value={dueDate}getPap
                        onChange={setDueDate}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </FormControl>


                {
                    projectPapers && <FormControl fullWidth sx={{ pb: 3 }}>
                        <InputLabel id="depends-on">Link Paper</InputLabel>
                        <Select
                            labelId="paper"
                            id="demo-simple-select"
                            value={task.project_paper ? task.project_paper.paper.name : ""}
                            label="Link Paper"
                            // onChange={(e) => setTask({...task, project_paper[paper]:task.depends_on.concat({"before": e.target.value})})}
                        >
                            {projectPapers && projectPapers.map((data, index) => (
                                <MenuItem value={data.paper.name} key={index} onClick={() => {setTask({...task, project_paper: {id: data.id, paper: data.paper.name}})}}>
                                    {data.paper.name.substring(0, 60) + "..."}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }
                
                <FormControl fullWidth sx={{ pb: 3 }}>
                    <InputLabel id="depends-on">Collaborators</InputLabel>
                    <Select
                        labelId="depends-on"
                        id="demo-simple-select"
                        value=""
                        label="Collaborators"
                        onChange={(e) => setTask({...task, collaborators:task.collaborators.concat(e.target.value)})}
                    >
                        {projectColabs && projectColabs.map((data, index) => (
                            <MenuItem value={data.collaborator.username} key={index}  onClick={() => addCollaborator(task.id, data.id)}>
                                {data.collaborator.username}
                            </MenuItem>
                        ))} 
                    </Select>

                    <nav aria-label="secondary mailbox folders">
                        <List>
                            {task.assignees && task.assignees.map((data, index) => (
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemText primary={data.collaborator.username} />
                                    </ListItemButton>
                                    <Button onClick={()=>{unassignCollaborator(data.id); setTask({...task, assignees:task.assignees.filter(item=> item.id !== data.id)})}}>X</Button>
                                </ListItem>
                            ))}
                        </List>
                    </nav>
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
                                value=""
                                label="Depends on"
                                onChange={(e) => setTask({...task, depends_on:task.depends_on.concat({"id": e.target.value.id, "name":e.target.value.name})})}
                            >
                                {projectTasks && projectTasks.map((data, index) => (
                                    <MenuItem value={data} key={index} onClick={() => addDependsOn(task.id, data.id)}>
                                        {data.name}
                                    </MenuItem>
                                ))} 
                            </Select>

                            <nav aria-label="secondary mailbox folders">
                                <List>
                                    {task.id && task.depends_on.map((data, index) => (
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                            <ListItemText primary={data.name} />
                                            </ListItemButton>
                                            <Button onClick={()=>{deleteDependsOn(data.id); setTask({...task, depends_on:task.depends_on.filter(item=> item.id!=data.id)})}}>X</Button>
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
                                onChange={(e) => setTask({...task, next:task.next.concat({"id": e.target.value.id, "name":e.target.value.name})})}
                            >
                                {projectTasks && projectTasks.map((data, index) => (
                                    <MenuItem value={data} key={index} onClick={() => addDependsOn(data.id, task.id)}>
                                        {data.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <nav aria-label="secondary mailbox folders">
                                <List>
                                    {task && task.next.map((data, index) => (
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                            <ListItemText primary={data.name} />
                                            </ListItemButton>
                                            <Button onClick={()=>{deleteDependsOn(task.id); setTask({...task, next:task.next.filter(item=> item.id!=data.id)})}}>X</Button>
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
                <Button variant="outlined" color="error" onClick={deleteTask}> Delete</Button>
                <Button variant="outlined" color="success" onClick={task.id ? updateTask : createTask}>Save</Button>
            </DialogActions>
        </Dialog>
    );
  }
  
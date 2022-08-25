import React, { useState, useEffect } from "react";
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { getStorageToken } from "../context/Auth";
import { getStorageProjID, useProjID } from "../context/ProjectID";
import { statusColor } from "../components/Helpers";
import TaskModal from "../components/TaskModal";

const URL = process.env.REACT_APP_API_URL;

// let tasks = [
//     {
//       start: new Date(2020, 1, 1),
//       end: new Date(2020, 3, 2),
//       name: 'Idea',
//       id: 1,
//       type:'task',
//       progress: 45,
//       isDisabled: true,
//       styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
//     },
// ];



export default function Schedule() {
    const { projID } = useProjID();
    const [tasks, setTasks] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handleModalClose = () => {
        setOpenModal(false);
        setModalData(null);
        getTasks();
    }
    
    const handleTaskClick = (task) => {
        console.log(task.id)
        setModalData([task.id]);
        setOpenModal(true);
    }

    const setTaskData = (data) => {
        let gnattData = [];
        let taskMap = {}
        // get mapping
        data.forEach(element => {
            taskMap[element.name] = element.id;
        })

        // fill actual data
        data.map((task) => {
            let newTask = {
                id: task.id,
                name: task.name,
                type:'task',
                start: new Date(task.start_date),
                end: new Date(task.due_date),
                dependencies: [],
                progress: 100,
                isDisabled: true,
                styles: { progressColor: statusColor(task.status), progressSelectedColor: statusColor(task.status) }
            }
            
            // depends_on
            {
                task.depends_on.map((item) => {newTask.dependencies.push(taskMap[item.name])})
            }

            // TODO do next

            console.log(newTask)
            gnattData.push(newTask);
        })

        setTasks(gnattData);
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
            setTaskData(resp.tasks)
        })
        .catch(error=>{
            console.log(error);
        })
    }

    useEffect(() => {
        if(projID != null) getTasks();
    }, [projID])

    return (
        <React.Fragment>
            {/* <h1>Schedule Page</h1> */}

            {
                tasks.length > 0 &&
                <Gantt
                    style={{overflow: 'auto'}}
                    viewMode={ViewMode.Month}
                    tasks={tasks} 
                    listCellWidth="" //{isChecked ? "155px" : ""}
                    columnWidth={150}
                    onClick={handleTaskClick}
                />
            }

            { openModal && <TaskModal data={modalData} isOpen={true} handleClose={handleModalClose}/> }
        </React.Fragment>
    )
}
import React, { useState, useEffect } from "react";
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { getStorageToken } from "../context/Auth";
import { getStorageProjID, useProjID } from "../context/ProjectID";

const URL = process.env.REACT_APP_API_URL;

let tasks = [
    {
      start: new Date(2020, 1, 1),
      end: new Date(2020, 3, 2),
      name: 'Idea',
      id: 1,
      type:'task',
      progress: 45,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
    {
        start: new Date(2020, 2, 1),
        end: new Date(2020, 5, 2),
        name: 'Idea',
        id: 1,
        type:'task',
        progress: 45,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        dependencies: [1]
      },
];



export default function Schedule() {
    const { projID } = useProjID();
    const [tasks, setTasks] = useState([]);

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
                progress: 45,
                isDisabled: true,
                styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
            }
            
            // depends_on
            {
                task.depends_on.map((item) => {newTask.dependencies.push(taskMap[item.before])})
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
                    viewMode={ViewMode.Month}
                    tasks={tasks} 
                    listCellWidth="" //{isChecked ? "155px" : ""}
                    columnWidth={150}
                />
            }
        </React.Fragment>
    )
}
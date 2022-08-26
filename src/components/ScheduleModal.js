import React, {useState, useEffect} from "react";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

import { getStorageToken } from "../context/Auth";

/* 
    define props=> 
        isOpen: will open the modal
        handleClose: what to do when closing the modal
        data: data to display 
*/


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


const URL = process.env.REACT_APP_API_URL;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '768px', //'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };


export default function ScheduleModal(props) {
    const [data, setData] = useState([]);
  
    const setUpData = () => {
        let tasks = [];
        console.log("Props here: ", props.data)
        if(props.data && props.data.length>0){
            props.data.map((item, index) => {
                tasks.push({
                    start: new Date(item.start),
                    end: new Date(item.end),
                    name: item.activity,
                    id: item.id,
                    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
                    dependencies: [index>1?props.data[index-1].id:null]
                })
            })
        }
        setData(tasks);
    }

    useEffect(() => {
        setUpData();
    }, [])

    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Gantt
                    style={{overflow: 'auto'}}
                    viewMode={ViewMode.Month}
                    tasks={data} 
                    listCellWidth="" //{isChecked ? "155px" : ""}
                    columnWidth={150}
                    // onClick={handleTaskClick}
                />
            </Box>
        </Modal>
    );
  }
  
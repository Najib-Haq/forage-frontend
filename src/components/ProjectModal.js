import React, {useState, useEffect} from "react";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { getStorageToken } from "../context/Auth";

/* 
    define props=> 
        isOpen: will open the modal
        handleClose: what to do when closing the modal
        data: data to display 
*/

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


export default function BasicModal(props) {
    const [data, setData] = useState({
        name: "",
        description: "",
        colab: [],
        keywords: []
    });
  
    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Create New Project 
                </Typography>

                <Divider />

                <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-title">Title</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-title"
                        value={data.name}
                        onChange={(event)=>{setData({...data, name:event.target.value})}}
                        label="Title"
                    />  
                </FormControl>

                <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-description">Description</InputLabel>
                    <OutlinedInput
                        placeholder="Project Description"
                        id="outlined-adornment-description"
                        value={data.description}    
                        onChange={(event)=>{setData({...data, description:event.target.value})}}
                        label="Description"
                        multiline={true}
                        rows={5}
                    />  
                </FormControl>

            </Box>
        </Modal>
    );
  }
  
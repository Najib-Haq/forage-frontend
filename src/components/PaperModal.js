import React, {useState, useEffect} from "react";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";

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
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };


export default function BasicModal(props) {
    const [data, setData] = useState({});

    useEffect(() => {
        if(props.data.id)
            fetch(URL + `api/papers/${props.data.id}`,
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
                    console.log("data is :", resp)
                    setData(resp)
                })
                .catch(error=>{
                    console.log(error);
                })
    }, [props.isOpen]);
    
  
    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {data.id} 
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {data.name}
                </Typography>
                <Divider light />
                <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    {data.abstract}
                </Typography>
            </Box>
        </Modal>
    );
  }
  
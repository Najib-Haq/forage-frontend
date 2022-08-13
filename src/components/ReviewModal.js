import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { RichTextEditor } from '@mantine/rte';

import { getStorageToken } from "../context/Auth";
import { getStorageProjID } from "../context/ProjectID";


/* 
    define props=> 
        isOpen: will open the modal
        handleClose: what to do when closing the modal
        data: data to display
*/

const URL = process.env.REACT_APP_API_URL;

export default function ReviewModal(props) {
    const [review, setReview] = useState("");
    const [isEditMode,setEditMode] = useState(true);
  
    return (<Dialog fullWidth
        maxWidth="sm" open={props.isOpen} onClose={props.handleClose}>
            <DialogTitle>{
                    review.id ? `Review #${review.id}` : "Add Review"
                }</DialogTitle>
            
            <Button>Read Manuscript</Button>
            
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <DialogContent>
                <FormControl fullWidth sx={{ mb: 3 }}>
                {isEditMode && <RichTextEditor 
                    controls={[
                        ['bold', 'italic', 'underline', 'link'],
                        ['unorderedList', 'h1', 'h2', 'h3'],
                        ['sup', 'sub'],
                      ]} 
                    value={review} onChange={setReview}/>}
                {!isEditMode && <p><div className="content" dangerouslySetInnerHTML={{__html: review}}></div></p>}
                </FormControl>
                <hr />
            </DialogContent>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <DialogActions>
                {isEditMode && <Button onClick={() => {setEditMode(false);}}>Save</Button>}
                {!isEditMode && <Button onClick={() => {setEditMode(true);}}>Edit</Button>}
                <Button onClick={props.handleClose}>Back</Button>
            </DialogActions>
            </Typography>
        </Dialog>
    );
  }
  
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
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Grid from "@mui/material/Grid";
import Comment from "./Comment";

import { getStorageToken } from "../context/Auth";
import { getStorageProjID } from "../context/ProjectID";


/* 
    define props=> 
        isOpen: will open the modal
        handleClose: what to do when closing the modal
        data: data to display
*/

const URL = process.env.REACT_APP_API_URL;

// const Accordion = styled((props: AccordionProps) => (
//     <MuiAccordion disableGutters elevation={0} square {...props} />
//     ))(({ theme }) => ({
//     border: `1px solid ${theme.palette.divider}`,
//     '&:not(:last-child)': {
//         borderBottom: 0,
//     },
//     '&:before': {
//         display: 'none',
//     },
// }));

// const AccordionSummary = styled((props: AccordionSummaryProps) => (
//     <MuiAccordionSummary
//         expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
//         {...props}
//     />
// ))(({ theme }) => ({
//     backgroundColor:
//         theme.palette.mode === 'dark'
//         ? 'rgba(255, 255, 255, .05)'
//         : 'rgba(0, 0, 0, .03)',
//     flexDirection: 'row-reverse',
//     '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
//         transform: 'rotate(90deg)',
//     },
//     '& .MuiAccordionSummary-content': {
//         marginLeft: theme.spacing(1),
//     },
// }));

// const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
//     padding: theme.spacing(2),
//     borderTop: '1px solid rgba(0, 0, 0, .125)',
// }));
  

export default function ReviewModal(props) {
    const [review, setReview] = useState("");
    const [isEditMode,setEditMode] = useState(true);

    // const handleChange =
    //     (panel) => (event, newExpanded) => {
    //     setExpanded(newExpanded ? panel : false);
    // };

    const commentBox = () => {
        // console.log(data)
        return (
            <React.Fragment>
            {/* { data.map((item, index) => (
                <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <Typography>{item.reviewer_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Comment data={item.comments} updateComments={updateComments}/>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        // startIcon={<AddIcon />}
                        style={{borderColor: "black", color: "black"}}
                        onClick={()=>{props.handleStepChange(3);}}
                        // color="black"
                    >Next</Button>
                </Grid>  */}
            {/* </Grid> */}
            </React.Fragment>
        )
    }


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
            {/* <div>
                { commentBox() }
            </div> */}
        </Dialog>
    );
  }
  
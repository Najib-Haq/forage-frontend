import React, {useState, useEffect} from "react";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider, requirePropFactory } from "@mui/material";
import SubmissionStep from "../components/SubmissionStep"
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
// import {DropzoneArea} from 'material-ui-dropzone' // HAS PROBLEMS
// import FileUpload from "react-mui-fileuploader"
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import PropTypes from 'prop-types';
import { getStorageToken } from "../context/Auth";
import pseudoData from "./constant";
import Comment from "./Comment";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';


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

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
} 

export default function ReviewModal(props) {
    const new_data = pseudoData[2];
    const [data, setData] = useState(new_data);
    const [expanded, setExpanded] = React.useState(null);
    const [files, setFiles] = React.useState([]);
    const [imageSrc, setImageSrc] = useState(undefined);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const updateComments = (reviewer_id, value) => {
        console.log(reviewer_id, value)
        new_data.forEach(item => {
            if(item.reviewer_id == reviewer_id) {
                // console.log("milse to")
                item.comments.push({
                    commenter: "John Doe",
                    comment: value
                })
            }
        })
        console.log(new_data, value)
        setData(new_data);
    }

    // const updateComments = (reviewer_id, value) => {
    //     let new_data = data
    //     new_data.push({
    //         commenter: "You",
    //         comment: value
    //     })
    //     setData(new_data)
    // }

    // const setComments = (comments) =>
    // {
    //     let new_data = []
    //     comments.forEach(element => {
    //         new_data.push({'commenter':element.user.id,
    //         'comment':element.text})
    //     });
    //     setData(new_data)
    // }

    // useEffect(() => {
    //     if(props.data)
    //     {
    //         console.log("props.data",props.data)
    //         setReviewerId(props.data.reviewerId);
    //         setComments(props.data.results[4]);
    //     }
    // }, [props.isOpen])



    const commentBox = () => {
        // console.log(data)
        return (
            <React.Fragment>
            { data.map((item, index) => (
               <Comment data={item.comments} updateComments={updateComments} reviewer={item.reviewer_id}/>
            ))}
            </React.Fragment>
        )
    }


    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Author" {...a11yProps(0)} />
                        <Tab label="Editor" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
            <Grid container justifyContent="flex-end">
                <Grid item>
                <FileDownloadIcon sx={{ "&:hover": { color: "green" } }}></FileDownloadIcon>
                </Grid> 
            </Grid>
            
            { commentBox() }
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Box>
                    <TextField
                        id="standard-multiline-static"
                        label="Add Review To Editor"
                        multiline
                        rows={4}
                        defaultValue=""
                        variant="standard"
                        sx={{style}}
                    />
                </Box>
            
            <Grid container justifyContent="flex-end">
                <Grid item>
                <Button variant="outlined" href="#outlined-buttons">
                            Submit
            </Button>
                </Grid> 
            </Grid>

            
            </TabPanel>
                
            </Box>
        </Modal>
    );
  }
  
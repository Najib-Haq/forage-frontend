import React, {useState, useEffect} from "react";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider, requirePropFactory } from "@mui/material";
import SubmissionStep from "../components/SubmissionStep"

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
// import {DropzoneArea} from 'material-ui-dropzone' // HAS PROBLEMS
// import FileUpload from "react-mui-fileuploader"
// import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import Button from '@mui/material/Button';
// import Grid from "@mui/material/Grid";
import MuiGrid from '@mui/material/Grid';
import LanguageIcon from '@mui/icons-material/Language';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useFilePicker } from 'use-file-picker';

import { getStorageProjID, useProjID } from "../context/ProjectID";
import { getStorageToken } from "../context/Auth";
import Comment from "./Comment";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import pseudoData from '../components/constant';

/* 
    define props=> 
        isOpen: will open the modal
        handleClose: what to do when closing the modal
        data: data to display 
        handleStepChange: what to do when changing step
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


const Grid = styled(MuiGrid)(({ theme }) => ({
    width: '100%',
    maxWidth: '800px',
    ...theme.typography.body2,
    '& [role="separator"]': {
      margin: theme.spacing(0, 2),
    },
  }));


const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));


const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));


const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
  

export default function SubmissionModal(props) {
    const new_data = pseudoData[0];
    const [data, setData] = useState(new_data);
    const [expanded, setExpanded] = React.useState(null);
    const [files, setFiles] = React.useState([]);
    const [imageSrc, setImageSrc] = useState(undefined);

    const { projID } = useProjID();
    const [openFileSelector, { filesContent, loading, plainFiles}] = useFilePicker({
        accept: '*', multiple: false
    });

    const handleChange =
        (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const updateComments = (reviewer_id, value) => {
        console.log(reviewer_id, value)
        new_data.forEach(item => {
            if(item.reviewer_id == reviewer_id) {
                // console.log("milse to")
                item.comments.push({
                    commenter: "Tahmeed",
                    comment: value
                })
            }
        })
        console.log(new_data, value)
        setData(new_data);
    }

    const updateFiles = (incommingFiles) => {
        console.log("incomming files", incommingFiles);
        uploadFiles(incommingFiles, 'ABSTRACT');
        setFiles(incommingFiles);
    };

    const uploadFiles = (file, type) => {
        fetch(URL + `api/files/`, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ 
                file: file,
                project_id: getStorageProjID(),
                content_type: type,
                uploader_id: 1
            })
        })
        .then(resp=>{
            if (resp.status >= 400) throw new Error();
            return resp.json();
        })
        .then(resp=>{
            console.log("here : ", resp)
            // getSelectedVenues();
        })
        .catch(error=>{
            console.log(error);
        })
    }

    useEffect(() => {
        uploadFiles(plainFiles[0], 'ABSTRACT');
    }, [plainFiles])

    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };
    const handleSee = (imageSource) => {
        setImageSrc(imageSource);
    };
    const handleClean = (files) => {
        console.log("list cleaned", files);
        setFiles([])
    };

    const dropzoneUI = (step) => {
        
        return (null)
    }
    
    const commentBox = () => {
        // console.log(data)
        return (
            <React.Fragment>
            { data.map((item, index) => (
                <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <Typography>{item.reviewer_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Comment data={item.comments} updateComments={updateComments} reviewer={item.reviewer_id}/>
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
                </Grid> 
            </Grid>
            </React.Fragment>
        )
    }


    const leftPart = (
        <Box>
            <SubmissionStep activeStep={props.activeStep} steps={props.steps}/>
        
            <Typography variant="h4" gutterBottom component="div">
                {props.steps[props.activeStep]}
            </Typography>

            <div>
                {
                    (props.activeStep == 0 || props.activeStep == 1) && dropzoneUI(props.activeStep)
                }

                {
                    props.activeStep == 2 &&
                    <div>
                        { commentBox() }
                    </div>
                }

                {
                    (props.activeStep == 3) &&
                    <div>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item>
                                {/* <CheckCircleOutlineIcon large sx={{color:'green', fontSize: 100 }}/> */}
                                <PendingOutlinedIcon large sx={{color:'grey', fontSize: 100 }}/>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" component="div">
                                    {/* Congratulations! Your submission has been accepted. */}
                                    Your submission is being processed.
                                </Typography>
                            </Grid>
                        </Grid>
                        
                    </div>
                }
            </div>
        </Box>
    )

    const rightPart = (
        <Box>
            <Typography variant="h7" sx={{m: 1}}>
                Links
            </Typography>
            <Button 
                variant="outlined" 
                size="medium" 
                fullWidth
                startIcon={<LanguageIcon />}
                style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5", margin: 10}}
                onClick={()=>{}}
            >Website</Button>
            <Divider sx={{m:1}}/>
            <Typography variant="h7" sx={{m: 1}}>
                Abstract Uploads
            </Typography>
            <div>
                <div style={{width:'80%', float:'left'}}>
                    <Button 
                        variant="outlined" 
                        size="medium" 
                        fullWidth
                        startIcon={<ArticleOutlinedIcon />}
                        sx = {{ ml: 1, mt: 1}}
                        style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5"}}
                        onClick={()=>{}}
                    >Draft 1</Button>
                </div>
                <div style={{width:'20%', float:'right', paddingLeft: '20px', paddingTop: '17px'}}>
                    <DeleteIcon onClick={()=>{}}  sx={{ "&:hover": { color: "red" } }}/>
                </div>
            </div>

            <div>
                <div style={{width:'80%', float:'left'}}>
                    <Button 
                        variant="outlined" 
                        size="medium" 
                        fullWidth
                        startIcon={<LanguageIcon />}
                        sx = {{ ml: 1, mt: 1}}
                        style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5"}}
                        onClick={()=>{}}
                    >Draft 1</Button>
                </div>
                <div style={{width:'20%', float:'right', paddingLeft: '20px', paddingTop: '17px'}}>
                    <DeleteIcon onClick={()=>{}}  sx={{ "&:hover": { color: "red" } }}/>
                </div>
            </div>
            <Button 
                variant="outlined" 
                size="medium" 
                fullWidth
                startIcon={<FileUploadOutlinedIcon />}
                sx = {{ ml: 1, mt: 1, mb: 3}}
                style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5"}}
                onClick={() => openFileSelector()}
            >Upload</Button>

            <Divider sx={{m:1}}/>
            <Typography variant="h7" sx={{m: 1}}>
                Manuscript Uploads
            </Typography>
            <div>
                <div style={{width:'80%', float:'left'}}>
                    <Button 
                        variant="outlined" 
                        size="medium" 
                        fullWidth
                        startIcon={<LanguageIcon />}
                        sx = {{ ml: 1, mt: 1}}
                        style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5"}}
                        onClick={()=>{}}
                    >Draft 1</Button>
                </div>
                <div style={{width:'20%', float:'right', paddingLeft: '20px', paddingTop: '17px'}}>
                    <DeleteIcon onClick={()=>{}}  sx={{ "&:hover": { color: "red" } }}/>
                </div>
            </div>
            <Button 
                variant="outlined" 
                size="medium" 
                fullWidth
                startIcon={<FileUploadOutlinedIcon />}
                style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5", margin: 10}}
                onClick={()=>{}}
            >Upload</Button>

            
        </Box>
    );

    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Grid container sx={style}>
                <Grid item xs>
                    {leftPart}
                </Grid>
                <Divider orientation="vertical" flexItem style = {{minWidth: "20px"}}>
                </Divider>
                <Grid item xs style = {{maxWidth: "200px"}}>
                    {rightPart}
                </Grid>
            </Grid>
        </Modal>
    );
  }
  
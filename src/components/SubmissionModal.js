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
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";

import { getStorageToken } from "../context/Auth";
import pseudoData from "./constant";
import Comment from "./Comment";


import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';

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
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };


const Accordion = styled((props: AccordionProps) => (
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

const AccordionSummary = styled((props: AccordionSummaryProps) => (
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

    // useEffect(() => {
    //     if(props.data.id)
    //         fetch(URL + `api/papers/${props.data.id}`,
    //             {
    //                 method: 'GET',
    //                 credentials: "same-origin",
    //                 headers: {
    //                         'Authorization': `Token ${getStorageToken()}`,
    //                         'Content-Type':'application/json'
    //                 }
    //             })
    //             .then(resp=>{
    //                 if (resp.status >= 400) throw new Error();
    //                 return resp.json();
    //             })
    //             .then(resp=>{
    //                 console.log("data is :", resp)
    //                 setData(resp)
    //             })
    //             .catch(error=>{
    //                 console.log(error);
    //             })
    // }, [props.isOpen]);


    const updateFiles = (incommingFiles) => {
        console.log("incomming files", incommingFiles);
        setFiles(incommingFiles);
    };
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
        
        return (
            <Dropzone
                style={{ maxWidth: "inherit" }}
                //view={"list"}
                onChange={updateFiles}
                // minHeight="195px"
                onClean={handleClean}
                onUploadFinish={()=>{props.handleStepChange(step+1); handleClean(" ")}}
                value={files}
                maxFiles={5}
                //header={false}
                // footer={false}
                maxFileSize={2998000}
                label="Click or drag files here to upload"
                //label="Suleta tus archivos aquí"
                accept=".pdf"
                // uploadingMessage={"Uploading..."}
                url="https://my-awsome-server/upload-my-file"
                //of course this url doens´t work, is only to make upload button visible
                //uploadOnDrop
                //clickable={false}
                fakeUploading
                //localization={"FR-fr"}
                disableScroll
                >
                {files.map((file) => (
                    <FileItem
                    {...file}
                    key={file.id}
                    onDelete={onDelete}
                    onSee={handleSee}
                    //localization={"ES-es"}
                    resultOnTooltip
                    preview
                    info
                    hd
                    />
                ))}
                {/* <FullScreenPreview
                    style={{ maxWidth: "inherit" }}
                    imgSource={imageSrc}
                    openImage={imageSrc}
                    onClose={(e) => handleSee(undefined)}
                /> */}
            </Dropzone>
            )
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

    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
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
        </Modal>
    );
  }
  
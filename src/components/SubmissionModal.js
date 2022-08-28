import React, {useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider, getTabScrollButtonUtilityClass, requirePropFactory, Avatar, Paper } from "@mui/material";
import SubmissionStep from "../components/SubmissionStep"
import PDFAnnotator from "./PDFAnnotator";
import { stringToColor } from "./Helpers";
import Switch from '@mui/material/Switch';


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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { Stack } from "@mui/material";
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
    width: 1024, //'auto',
    maxWidth: 1024,
    maxHeight: 768,
    bgcolor: 'background.paper',
    // bgcolor: 'cyan',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const label = { inputProps: { 'aria-label': 'Switch demo' } };

const Grid = styled(MuiGrid)(({ theme }) => ({
    width: '800px',
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


const UPLOADTYPE = [ 'ABSTRACT', 'MANUSCRIPT' ];

export default function SubmissionModal(props) {

    // props.venue has all current submission venue data

    const new_data = pseudoData[0];
    const [data, setData] = useState(new_data);
    const [expanded, setExpanded] = useState(null);
    const [files, setFiles] = useState([]);
    const [thisModalOpen, setThisModalOpen] = useState(true);
    const [highlights, setHighlights] = useState([]);

    const [abstracts, setAbstracts] = useState([]);
    const [manuscripts, setManuscripts] = useState([]);
    const [openPDF, setOpenPDF] = useState(false);
    const [pdfURL, setPDFURL] = useState(false);
    const [reviewer, setReviewer] = useState(null);
    const [revFile, setRevFile] = useState("");

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
        console.log("FILE ",file)
        let formData = new FormData();
        formData.append('file', file)
        formData.append('project_id', getStorageProjID())
        formData.append('name', file.name.slice(0, 5))
        formData.append('content', type)
        // formData.append('status', 'ACTIVE')
        // formData.append('upload_id', 1)


        fetch(URL + `api/files/`, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                // 'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundaryPJAVNBfjvMvPgX3n'
            },  
            body: formData
        })
        .then(resp=>{
            if (resp.status >= 400) throw new Error();
            return resp.json();
        })
        .then(resp=>{
            console.log("here : ", resp)
            getFiles(type);
            // getSelectedVenues();
        })
        .catch(error=>{
            console.log(error);
        })
        
    }

    const getFiles = (type) => {
        let url = `api/files/?content=${type}&project=${projID}`;
        fetch(URL + url, 
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
            if(type === UPLOADTYPE[0]) setAbstracts(resp.results);
            if(type === UPLOADTYPE[1]) {
                setManuscripts(resp.results);
                resp.results.map((item, index) => {
                    if(item.status == "ACTIVE") setRevFile(item.file);
                })
            }
        })
        .catch(error=>{
            console.log(error);
            if(type === UPLOADTYPE[0]) setAbstracts([]);
            if(type === UPLOADTYPE[1]) setManuscripts([]);
        })
    }

    const setFileActive = (file_id) => {
        fetch(URL + `api/files/${file_id}/set_active/`, {
            method: 'PUT',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
        })
        .catch(error=>{
            console.log(error);
        })
    }

    // useEffect(() => {
    //     if(plainFiles && plainFiles.length>0) uploadFiles(plainFiles[0], 'ABSTRACT');
    // }, [plainFiles])

    useEffect(() => {
        if(projID) {
            getFiles(UPLOADTYPE[0]);
            getFiles(UPLOADTYPE[1]);
        }
    }, [])


    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    
    const reviewerArea = () => {
        console.log("REVIEW AREA ", props.venue.reviewers)
        return (
            <Stack spacing={2}>
                {props.venue.reviewers.map((reviewer, index) => 
                    <Item style={{textAlign: 'left'}}>
                        <Stack direction="row" spacing={2}>
                            <Avatar key={index} alt={reviewer.username} src={reviewer.username} sx={{bgcolor : stringToColor(reviewer.username)}} />
                            <Typography variant="h6" gutterBottom>
                                { reviewer.full_name ? reviewer.full_name : reviewer.username  }
                            </Typography>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                // fullWidth
                                startIcon={<FileOpenIcon />}
                                style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5", margin: 1, marginLeft: 350, width: '250px'}}
                                onClick={()=>{setReviewer(reviewer.id); setOpenPDF(true); setPDFURL(revFile); setThisModalOpen(false);}}
                            >Reviewer FeedBack</Button>
                        </Stack>
                    </Item>
                )}
            </Stack>
        )
    } 

    const leftPart = (
        <Box>
            <SubmissionStep activeStep={props.activeStep} steps={props.steps}/>
        
            <Typography variant="h4" gutterBottom component="div">
                {/* {props.steps[props.activeStep]['activity']} */}
                {/* Smth Smth */}
            </Typography>

            <div>
                {/* {
                    (props.activeStep == 0 || props.activeStep == 1) && dropzoneUI(props.activeStep)
                } */}

                {
                    // props.activeStep == 2 &&
                    <div>
                        {/* { commentBox() } */}
                        { reviewerArea() }
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
                href={props.venue.website}
                target="_blank"
            >Website</Button>
            <Divider sx={{m:1}}/>
            <Typography variant="h7" sx={{m: 1}}>
                Abstract Uploads
            </Typography>
            
            {
                abstracts && abstracts.map((item, index) => (
                    <div>
                        <div style={{width:'80%', float:'left'}}>
                            <Button 
                                variant="outlined" 
                                size="medium" 
                                fullWidth
                                startIcon={<ArticleOutlinedIcon />}
                                sx = {{ ml: 1, mt: 1}}
                                style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5"}}
                                // onClick={()=>{setOpenPDF(true); setPDFURL(item.file); setThisModalOpen(false);}}
                                href={item.file}
                                target="_blank"
                            >{item.name}</Button>
                        </div>
                        <div style={{width:'20%', float:'right'}}>
                            <Switch 
                            {...label}
                            defaultChecked = {item.status === "ACTIVE" ? true : false}
                            onChange = {(event) => { if(event.target.checked) setFileActive(item.id)}}
                            />
                        </div>
                    </div>
                ))
            }
                
                
            <div style={{width:'80%', float:'left'}}>
                <Button 
                    variant="outlined" 
                    size="medium" 
                    fullWidth
                    startIcon={<AttachFileIcon />}
                    sx = {{ ml: 1, mt: 1, mb: 3}}
                    style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5"}}
                    onClick={() => openFileSelector()}
                >Attach</Button>
            </div>
            <div style={{width:'20%', float:'right', paddingLeft: '20px', paddingTop: '17px'}}>
                <FileUploadOutlinedIcon onClick={()=>{uploadFiles(plainFiles[0], UPLOADTYPE[0])}}  sx={{ "&:hover": { color: "red" } }}/>
            </div>


            <Divider sx={{m:1}}/>
            <Typography variant="h7" sx={{m: 1}}>
                Manuscript Uploads
            </Typography>
            {
                manuscripts && manuscripts.map((item, index) => (
                    <div>
                        <div style={{width:'80%', float:'left'}}>
                            <Button 
                                variant="outlined" 
                                size="medium" 
                                fullWidth
                                startIcon={<ArticleOutlinedIcon />}
                                sx = {{ ml: 1, mt: 1}}
                                style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5"}}
                                // onClick={()=>{setOpenPDF(true); setPDFURL(item.file); setThisModalOpen(false);}}
                                href={item.file}
                                target="_blank"
                            >{item.name}</Button>
                        </div>
                        <div style={{width:'20%', float:'right'}}>
                            <Switch {...label} 
                            defaultChecked = {item.status === "ACTIVE" ? true : false}
                            onChange = {(event) => { if(event.target.checked) setFileActive(item.id)}}
                            />
                        </div>
                    </div>
                ))
            }
            <div style={{width:'80%', float:'left'}}>
                <Button 
                    variant="outlined" 
                    size="medium" 
                    fullWidth
                    startIcon={<AttachFileIcon />}
                    sx = {{ ml: 1, mt: 1, mb: 3}}
                    style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5"}}
                    onClick={() => openFileSelector()}
                >Attach</Button>
            </div>
            <div style={{width:'20%', float:'right', paddingLeft: '20px', paddingTop: '17px'}}>
                <FileUploadOutlinedIcon onClick={()=>{uploadFiles(plainFiles[0], UPLOADTYPE[1])}}  sx={{ "&:hover": { color: "red" } }}/>
            </div>

            
        </Box>
    );

    const handlePDFClose = () => {
        setThisModalOpen(true);
        setOpenPDF(false);
    }

    return (
        <React.Fragment>
        <Modal
          open={thisModalOpen}
          onClose={props.handleClose}
        //   style={{ width: '896px'}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Grid container sx={style} style={{overflowY: 'auto'}}>
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

        { openPDF && <PDFAnnotator url={pdfURL} isOpen={true} handleClose={handlePDFClose} reviewer_id={reviewer} sub_id={props.venue.id}/>}
        </React.Fragment>
    );
  }
  
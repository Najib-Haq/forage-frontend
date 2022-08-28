import React, {useState, useEffect} from "react";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider, requirePropFactory, Paper } from "@mui/material";
import SubmissionStep from "../components/SubmissionStep"
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { RichTextEditor } from '@mantine/rte';
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
import Grid from "@mui/material/Grid";
import PropTypes from 'prop-types';
import { getStorageToken, getUserID } from "../context/Auth";
import pseudoData from "./constant";
import Comment from "./Comment";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PDFAnnotator from "./PDFAnnotator";
import FileOpenIcon from '@mui/icons-material/FileOpen';


import { useUser, removeStorageUser } from '../context/User';
// import { Stack } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


/* 
    define props=> 
        isOpen: will open the modal
        handleClose: what to do when closing the modal
        data: data to display
*/

const URL = process.env.REACT_APP_API_URL;

const SUB_ID = 1;
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


const modalStyle = {
    minHeight: '80vh',
    minWidth: '150vh',
    maxWidth: '150vh',
    overflow:'scroll'
} 
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
    const [reviewId, setReviewId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(true);
    const [noteToEditor,setNoteToEditor] = useState("")

    // for comment stuff
    const [openPDF, setOpenPDF] = useState(false);
    const [pdfURL, setPDFURL] = useState(false);
    const [thisModalOpen, setThisModalOpen] = useState(true);
    const { user } = useUser();

    console.log("props.dataaaaa is ", props.data)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


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

    const getFiles = () => {
        let url = `api/submissions/${SUB_ID}/`;
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
            console.log("Here is the url ", resp)
            let url = "http://localhost:8000" + resp.manuscript;
            console.log("Here is the url ", url)
            setPDFURL(url)
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const fetchData = () => {
        fetch(URL + `api/reviewers/`,
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
            resp.results.forEach((item, index) => {
                if(item.user==getUserID())
                {
                    setReviewId(item.id);
                    setNoteToEditor(item.review);
                    setIsEditMode(false);
                }
                
            })
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const handleSubmit = () => {
        fetch(URL + `api/reviewers/${reviewId}/`, {
            method: 'PATCH',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "is_submitted": "true",
            })
        })
        .catch(error=>{
            console.log(error);
        })
        props.handleClose();
        
    }

    useEffect(() => {
        if(props.data)
        {   
            console.log("props.data",props.data)
        }
        fetchData();
        getFiles();
    }, [props.isOpen])


    const commentBox = () => {
        // console.log(data)
        return (
            <React.Fragment>
                <Stack spacing={2}>
                    <Item style={{textAlign: 'left'}}>
                        <Stack direction="row" spacing={2}>
                            {/* <Avatar key={index} alt={reviewer.username} src={reviewer.username} sx={{bgcolor : stringToColor(reviewer.username)}} /> */}
                            <Typography variant="h6" gutterBottom>
                                Uploaded file : 
                            </Typography>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                // fullWidth
                                startIcon={<FileOpenIcon />}
                                style={{borderColor: "black", color: "black", backgroundColor: "#f5f5f5", margin: 1, marginLeft: 300, width: '250px'}}
                                onClick={()=>{setOpenPDF(true); setThisModalOpen(false);}}
                            >Go to Manuscript</Button>
                        </Stack>
                    </Item>
                </Stack>
            </React.Fragment>
        )
    }


    const handlePDFClose = () => {
        setThisModalOpen(true);
        setOpenPDF(false);
    }

    if(props.data.length==0)
        for(let i=0;i<1000000;i++){};

    return (
        <React.Fragment>
        <Modal
          open={thisModalOpen}
          onClose={props.handleClose}
        //   style={modalStyle}
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
                {!isEditMode &&
                        <div>
                            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                                <p><div className="content" dangerouslySetInnerHTML={{__html: noteToEditor}}></div></p>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={2}>
                            <Button variant="outlined" href="#outlined-buttons" onClick={() => {
                                    setIsEditMode(true);
                             }}>
                                    Edit
                                </Button>
                                </Stack>
                            </Typography>
                        </div>}
                {isEditMode &&
                    <div>
                    <div><RichTextEditor 
                    controls={[
                        ['bold', 'italic', 'underline', 'link'],
                        ['unorderedList', 'h1', 'h2', 'h3'],
                        ['sup', 'sub'],
                      ]} 
                    value={noteToEditor} onChange={setNoteToEditor}/></div>
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={2}>
                        <Button variant="outlined" href="#outlined-buttons" onClick={() => {
                            fetchData();
                        }}>
                            Save
                        </Button>
                        </Stack>
                    </Typography></div>}
                </Box>
            
            <Grid container justifyContent="flex-end">
                <Grid item>
                <Button variant="outlined" href="#outlined-buttons" onClick={handleSubmit}>
                            Submit
            </Button>
                </Grid> 
            </Grid>

            
            </TabPanel>
                
            </Box>
        </Modal>
        
        { openPDF && <PDFAnnotator url={pdfURL} isOpen={true} handleClose={handlePDFClose} reviewer_id={user[0]} sub_id={SUB_ID}/>}
        </React.Fragment>
    );
  }
  
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
import { Dropzone, FileItem } from "@dropzone-ui/react";

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
    const [data, setData] = useState({});
    const [expanded, setExpanded] = React.useState('panel1');
    const [files, setFiles] = React.useState([]);

    const handleChange =
        (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

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
    
  
    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <SubmissionStep activeStep={props.activeStep} steps={props.steps}/>
            
                <div>
                    {
                        (props.activeStep == 0 || props.activeStep == 1) && 
                        <Dropzone onChange={()=>{}} value={files}>
                            {files.map((file) => (
                                <FileItem {...file} preview />
                            ))}
                        </Dropzone>
                    }

                    {
                        props.activeStep == 2 &&
                        <div>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>Collapsible Group Item #1</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                            <Typography>Collapsible Group Item #2</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                            <Typography>Collapsible Group Item #3</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                                sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        </div>
                    }
                    
                </div>
            </Box>
        </Modal>
    );
  }
  
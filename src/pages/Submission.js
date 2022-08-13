import React, { useState, useEffect } from "react";
import SubmissionStep from "../components/SubmissionStep"
import SubmissionModal from "../components/SubmissionModal"
import Box from '@mui/material/Box';

const steps = [
    'Upload Abstract',
    'Upload Manuscript',
    'Peer Review',
    'Submit to Editor',
    'Approval Decision'
  ];



export default function Submission() {
    const [openModal, setOpenModal] = useState(false);

    const activeStep = 1;

    const handleModalClose = () => {
        setOpenModal(false);
    }

    return (
        <React.Fragment>
            <h1>Submission Page</h1>
            <Box onClick={()=>setOpenModal(true)}>
                <SubmissionStep activeStep={activeStep} steps={steps}/>
            </Box>

            <SubmissionModal isOpen={openModal} handleClose={handleModalClose} activeStep={activeStep} steps={steps}/>
        </React.Fragment>
    )
}
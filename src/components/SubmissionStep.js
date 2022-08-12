import React, { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

/*
    define props=>
        activeStep : index number of latest active step
        steps: array of steps to display
*/

const steps = [
    'Upload Abstract',
    'Upload Manuscript',
    'Peer Review',
    'Submit to Editor',
    'Approval Decision'
  ];


export default function SubmissionStep(props) {

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={props.activeStep} alternativeLabel>
                {props.steps.map((label) => (
                <Step key={label} onClick={()=>{console.log(label)}}>
                    <StepLabel>{label}</StepLabel>
                </Step>
                ))}
            </Stepper>
        </Box>
    )
}
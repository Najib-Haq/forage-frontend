import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import SubmissionStep from "../components/SubmissionStep"
import SubmissionModal from "../components/SubmissionModal"
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { Grid, Divider, Typography } from "@mui/material";
import pseudoData from "../components/constant";
import { getStorageProjID, useProjID } from "../context/ProjectID";

const steps = [
    'Upload Abstract',
    'Upload Manuscript',
    'Peer Review',
    'Submit to Editor',
    'Approval Decision'
  ];

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Submission() {
    const newData = pseudoData[1][0];
    const [openModal, setOpenModal] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    // const activeStep = 1;

    const handleModalClose = () => {
        setOpenModal(false);
    }

    const handleStepChange = (step) => {
        setActiveStep(step)
        // call to url too?
    }

    const venueInfo = (data) => {
        console.log(data)
        return (
            <div>
            {
                data.map((item, index) => (
                    <Item>
                        <h4>{item.deadline.date} - {item.deadline.event}</h4>
                        <GroupsOutlinedIcon large /> <h3>{item.venue_name}</h3>
                        <Divider style={{paddingBottom: "50px"}} />
                    </Item>
                ))
            }
            </div>
        )}

    return (
        <React.Fragment>
            <h1>Submission Page</h1>
            <Box onClick={()=>setOpenModal(true)}>
                <SubmissionStep activeStep={activeStep} steps={steps}/>
            </Box>

            <Grid container spacing={2} columns={12}>
            <Grid item xs={6}>
                <Item>
                    <Typography variant="h6" gutterBottom>
                        Upcoming
                    </Typography>
                    <Divider />
                    {venueInfo(newData.upcoming)}
                </Item>
            </Grid>
            {/* <Divider orientation="vertical"/> */}
            <Grid item xs={6}>
                <Item>
                    <Typography variant="h6" gutterBottom>
                        Suggestions
                    </Typography>
                    <Divider />
                    {venueInfo(newData.suggestions)}
                </Item>
            </Grid>
            </Grid>
            <SubmissionModal isOpen={openModal} handleClose={handleModalClose} activeStep={activeStep} steps={steps} handleStepChange={handleStepChange}/>
        </React.Fragment>
    )
}
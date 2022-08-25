import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import SubmissionStep from "../components/SubmissionStep"
import SubmissionModal from "../components/SubmissionModal"
import VenueCard from "../components/VenueCard"
import SearchBar from "../components/SearchBar"
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
    // 'Submit to Editor',
    'Approval Decision'
  ];

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    boxShadow: 'none', 
}));

export default function Submission() {
    const newData = pseudoData[1][0];
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
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
                    <VenueCard/>
                    // <Item>
                    //     <h4>{item.deadline.date} - {item.deadline.event}</h4>
                    //     <GroupsOutlinedIcon large /> <h3>{item.venue_name}</h3>
                    //     {/* <Divider style={{paddingBottom: "50px"}} /> */}
                    // </Item>
                ))
            }
            </div>
        )}
        // return (<div><VenueCard/></div>) 
    // }

    
    const upperPart = (<Box onClick={()=>setOpenModal(true)}>
            <SubmissionStep activeStep={activeStep} steps={steps}/>
        </Box>)

    return (
        <React.Fragment>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={16}>
                        <Typography variant="h5" gutterBottom sx={{pb:2}}>
                            Current Submission Timeline
                        </Typography>
                    </Grid>
                    <Grid item xs={16}>
                        <VenueCard onlyData={true}/>
                    </Grid>
                    <Grid item xs={16}>
                        { upperPart }
                        <Divider />
                    </Grid>
                    {/* <Divider /> */}
                    <Grid item xs={6}>
                        <Item>
                            <Typography variant="h5" gutterBottom sx={{pb:2}}>
                                Upcoming
                            </Typography>
                            {/* <Divider /> */}
                            {venueInfo(newData.upcoming)}
                        </Item>
                    </Grid>
                    <Grid item xs={1} >
                        <Divider orientation="vertical" style = {{width:'100%', m: "-10px", p: "0px" }}>
                        </Divider>
                    </Grid>
                    <Grid item xs={9}>
                        <Item sx={{pl:2}}>
                            <Grid container spacing={2} columns={6}>
                                <Grid item xs={4}>
                                    <Item>
                                        <Typography variant="h5" gutterBottom sx={{pb:2}}>
                                            Suggestions 
                                        </Typography>
                                    </Item>
                                </Grid>

                                <Grid item xs={2}>
                                    <Item>
                                        <SearchBar
                                            data={search}
                                            handleSearch={(data) => {setSearch(data); console.log(data)}}
                                        />
                                    </Item>
                                </Grid>
                            </Grid>

                            
                            {/* <Divider /> */}
                            {venueInfo(newData.suggestions)}
                        </Item>
                    </Grid>
                </Grid>
            </Box>
            <SubmissionModal isOpen={openModal} handleClose={handleModalClose} activeStep={activeStep} steps={steps} handleStepChange={handleStepChange}/>
        </React.Fragment>
    )
}
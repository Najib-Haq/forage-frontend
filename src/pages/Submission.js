import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import SubmissionStep from "../components/SubmissionStep"
import SubmissionModal from "../components/SubmissionModal"
import VenueCard from "../components/VenueCard"
import SearchBar from "../components/SearchBar"
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { Grid, Divider, Typography } from "@mui/material";
import pseudoData from "../components/constant";
import ScheduleModal from "../components/ScheduleModal";

import { getStorageProjID, useProjID } from "../context/ProjectID";
import { getStorageToken } from "../context/Auth";


const URL = process.env.REACT_APP_API_URL;

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
    const newData = pseudoData[1];
    const [curSubVenue, setCurSubVenue] = useState(null);
    const [selectedVenue, setSelectedVenue] = useState([]);
    const [venueData, setVenueData] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [activeStep, setActiveStep] = useState(2);
    const [openScheduleModal, setOpenScheduleModal] = useState(false);
    const [scheduleData, setScheduleData] = useState([]);
    // const activeStep = 1;
    const { projID } = useProjID();

    const handleModalClose = () => {
        setOpenModal(false);
        setOpenScheduleModal(false);
        setScheduleData([]);
    }

    const handleStepChange = (step) => {
        setActiveStep(step)
        // call to url too?
    }


    const makeSuggestedButtons = (data) => {
        return (
            <React.Fragment>
                <Button variant="outlined" sx={{ m: 1 , borderColor: "black", color: "black"}}
                    onClick={() => {saveSubmission(data)}}
                >Save</Button>
                <Button variant="outlined" sx={{ m: 1 , borderColor: "black", color: "black"}}
                    onClick={() => {setScheduleData(data.activities); setOpenScheduleModal(true);}}
                >Schedule</Button>
            </React.Fragment>
        )
    }


    const deleteUpcoming = (data) => {
        fetch(URL + `api/submissions/${data.id}/`, {
            method: 'DELETE',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
        })
        .then(resp=>{
            getSelectedVenues();
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const makeUpcomingButtons = (data) => {
        return (
            <React.Fragment>
                <Button variant="outlined" sx={{ m: 1 , borderColor: "black", color: "black"}}
                    onClick={() => {deleteUpcoming(data)}}
                >Delete</Button>
            </React.Fragment>
        )
    }

    useEffect(() => {console.log("Active step : ", activeStep)}, [activeStep])

    const venueInfo = (data) => {
        console.log("Populate venue : ")
        // populate with fake time? 
        data = data.map((item, index) => {
            if(item.activities.length == 0)
            {
                return {...item, activities: [
                    {
                        "id": 1,
                        "activity": "Abstract Submission",
                        "start": "2022-08-09T00:00:00+06:00",
                        "end": "2022-09-09T00:00:00+06:00"
                    },
                    {
                        "id": 2,
                        "activity": "Manuscript Submission",
                        "start": "2022-09-09T00:00:01+06:00",
                        "end": "2022-09-15T00:00:00+06:00"
                    },
                    {
                        "id": 3,
                        "activity": "Peer Review",
                        "start": "2022-09-15T00:00:01+06:00",
                        "end": "2022-12-15T00:00:00+06:00"
                    },
                    {
                        "id": 4,
                        "activity": "Final Decisions",
                        "start": "2022-12-15T00:00:01+06:00",
                        "end": "2023-03-01T00:00:00+06:00"
                    }
                ]}
            }
            // if(item.activities[0].start == null){
            //     return {...item, activities: [
            //         {
            //             "id": 1,
            //             "activity": "Abstract Submission",
            //             "start": null,
            //             "end": "2022-09-09T00:00:00+06:00"
            //         },
            //         {
            //             "id": 2,
            //             "activity": "Manuscript Submission",
            //             "start": "2022-09-09T00:00:01+06:00",
            //             "end": "2022-09-15T00:00:00+06:00"
            //         },
            //         {
            //             "id": 3,
            //             "activity": "Peer Review",
            //             "start": "2022-09-15T00:00:01+06:00",
            //             "end": "2022-12-15T00:00:00+06:00"
            //         },
            //         {
            //             "id": 4,
            //             "activity": "Final Decisions",
            //             "start": "2022-12-15T00:00:01+06:00",
            //             "end": "2023-03-01T00:00:00+06:00"
            //         }
            //     ]}
            // }
            else return item;
        })

        console.log("Venueinfo : ", data)

        return (
            <div>
            {
                data.map((item, index) => (
                    <VenueCard 
                        venueData = {item}
                        buttons = {makeSuggestedButtons(item)}
                    />
                ))
            }
            </div>
    )}

    const upcomingInfo = (data) => {
        data = data.map((item, index) => {
            if(item.activities.length == 0)
            {
                return {...item, activities: [
                    {
                        "activity": "Paper titles and abstracts",
                        "start": "2022-09-09T00:00:00+06:00",
                        "end": "2022-10-09T00:00:00+06:00"
                    }
                ]}
            }
            else return item;
        })

        return (
            <div>
            {
                data.map((item, index) => (
                    <VenueCard 
                        venueData = {{
                            name: item.venue.name, 
                            website: item.status,
                            schedule: item.activities
                        }}
                        buttons = {makeUpcomingButtons(item)}
                    />
                ))
            }
            </div>
    )}

    const saveSubmission = (data) => {
        fetch(URL + `api/submissions/`, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ 
                name: "Submission name", // TODO : CHANGE THIS 
                project_id: getStorageProjID(),
                venue_id: data.id
            })
        })
        .then(resp=>{
            if (resp.status >= 400) throw new Error();
            return resp.json();
        })
        .then(resp=>{
            console.log("here : ", resp)
            getSelectedVenues();
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const getSuggestedVenues = () => {
        let url = `api/venues/suggest/?project_id=${projID}`
        if (search) url = `api/venues/?search=${search}`
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
            // console.log("Suggested : ", resp)
            if(search) resp=resp.results; // ----------________________---------------
            setVenueData(resp);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const getSelectedVenues = () => {
        let url = `api/projects/${projID}/submissions/`
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
            let count = 0;
            resp.results.map((item, index) => {

                console.log(item.status + " : here ; " + item)
                if(item.status === "ONGOING") {
                    count += 1;
                    console.log("here is ongoing")
                    setCurSubVenue(item)
                    setActiveStep(item.ongoing_activity.id-1)
                }
            })

            if (count == 0){
                let item = resp.results[0]
                setCurSubVenue(item)
                setActiveStep(item.ongoing_activity.id-1)
            }
            setSelectedVenue(resp.results);
            // setActiveStep(2)
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const getSteps = (data) => {
        let steps = []
        if (data != null) {            
            data.activities.forEach((item, index) => {
                // console.log("IN LOOP : ", item, data)
                steps.push(
                    {
                        activity: item.activity,
                        time: new Date(item.end).toLocaleString('default', { month: 'short', day:'numeric' })
                    }
                )
            })
        }
        return steps;
    }


    useEffect(() => {
        // console.log("PROJ ID : ", projID)
        if(projID != null) getSuggestedVenues();
    }, [projID, search]);

    useEffect(() => {
        if(projID != null) getSelectedVenues();
    }, [projID]);

    
    const upperPart = (<Box onClick={()=>setOpenModal(true)}>
            <SubmissionStep activeStep={activeStep} steps={getSteps(curSubVenue)}/>
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
                    {
                        curSubVenue &&
                        (
                            <React.Fragment>
                                <Grid item xs={16}>
                                    <VenueCard onlyData={true} 
                                        venueData={{
                                            name: curSubVenue.venue.name, 
                                            website: curSubVenue.status,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={16}>
                                    { upperPart }
                                    <Divider />
                                </Grid>
                            </React.Fragment>
                        )
                    }
                        
                    {/* <Divider /> */}
                    <Grid item xs={6}>
                        <Item>
                            <Typography variant="h5" gutterBottom sx={{pb:2}}>
                                Upcoming
                            </Typography>
                            {/* <Divider /> */}
                            { selectedVenue != null && selectedVenue.length > 1 ? upcomingInfo(selectedVenue.filter((item) => item.status != "ONGOING")) : null}
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
                            { venueData != null && venueData.length > 0 ? venueInfo(venueData) : null}
                        </Item>
                    </Grid>
                </Grid>
            </Box>
            { openModal && <SubmissionModal isOpen={true} handleClose={handleModalClose} activeStep={activeStep} steps={getSteps(curSubVenue)} venue={curSubVenue} handleStepChange={handleStepChange}/> }
        
            { openScheduleModal && <ScheduleModal data={scheduleData} isOpen={true} handleClose={handleModalClose}/> }
        </React.Fragment>
    )
}
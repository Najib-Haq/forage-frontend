import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function VenueCard(props) {
    let elevation = 3;
    if (props.onlyData) elevation = 0;

    return (
    <Paper elevation={elevation}
        sx={{
        p: props.onlyData ? 0: 2,
        margin: 'auto',
        marginBottom: props.onlyData ? 0: 2,
        marginLeft: 0,
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
    >
        <Grid container>
        <Grid item>
            <GroupsOutlinedIcon fontSize="large"/>
        </Grid>
        <Grid item xs={4} sm container>
            <Grid item xs container direction="column">
                <Grid item xs sx={{ textAlign: 'left', ml:2 }}>
                    <Typography gutterBottom variant="subtitle1" component="div">
                    { props.venueData.name.length > 40 ? props.venueData.name.substring(0, 40) + "..." : props.venueData.name } 
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                    { props.venueData.website && props.venueData.website.length > 50 ? props.venueData.website.substring(0, 50) + "..." : props.venueData.website } 
                    </Typography>
                </Grid>

                {
                    props.onlyData ? null : (
                        <Grid item sx={{ textAlign: 'left', ml:1}}>
                            {props.buttons}
                        </Grid>
                    )
                }
            </Grid>
            {
                props.onlyData ? null : (
                    <Grid item>
                        <Typography variant="subtitle1" component="div">
                            { props.venueData.activities && <b>{new Date(props.venueData.activities[0].start).toLocaleString('default', { month: 'short', day:'numeric' })}</b> }
                        </Typography>
                    </Grid>
                )
            }
        </Grid>
        </Grid>
    </Paper>
    );
}
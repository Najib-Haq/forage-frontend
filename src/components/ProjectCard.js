import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { Button, CardActionArea, CardActions, CardHeader, AvatarGroup, Avatar } from '@mui/material';
import { stringToColor } from "./Helpers";
import { bgcolor } from "@mui/system";

import '../styles/Card.css'

export default function ProjectCard(props) {
    // const [data, setData] = useState({});

    const handleAdd = () => {
        console.log(props.data.id)
    }

    const handleGroupAvatar = (users) => {
        return users.map((user, index) => {
            return (
                <Avatar key={index} alt={user.username} src={user.username[0]} sx={{bgcolor : stringToColor(user.username)}} />
            )
        })
    }

    return (
    <Card sx={{ width: 300, maxWidth: 300, height: 150, maxHeight: 150}}>
        {/* <CardHeader
            action={
            <IconButton aria-label="settings" onClick={handleAdd}>
                <ControlPointIcon />
            </IconButton>
            }
        /> */}
        <CardActionArea onClick={props.onClick}>
            {/* <CardMedia
            component="img"
            // height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
            /> */}
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {props.data.name.length > 20 ? props.data.name.substring(0, 20) + "..." : props.data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
             {props.data.name.length > 0 ? <AvatarGroup max={4}>{handleGroupAvatar(props.data.collaborators)}</AvatarGroup> : null}
            </Typography>
            </CardContent>
        </CardActionArea>
        <CardActions disableSpacing>
            <EditIcon onClick={()=>{}} sx={{ "&:hover": { color: "green" }, mr:1}}/>
            <InfoIcon  onClick={()=>{}} sx={{ "&:hover": { color: "blue" } }}/> 
            <DeleteIcon className='CardItem-right-align' onClick={()=>{}} sx={{ "&:hover": { color: "red" } }}/> 
        </CardActions>
    </Card>
    );
  }
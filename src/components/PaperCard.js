import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import IconButton from '@mui/material/IconButton';
import { Button, CardActionArea, CardActions, CardHeader } from '@mui/material';


export default function PaperCard(props) {
    // const [data, setData] = useState({});

    const handleAdd = () => {
        console.log(props.data.id)
    }

    return (
    <Card sx={{ maxWidth: 345 }}>
        <CardHeader
            action={
            <IconButton aria-label="settings" onClick={handleAdd}>
                <ControlPointIcon />
            </IconButton>
            }
        />
        <CardActionArea onClick={props.onClick}>
            <CardMedia
            component="img"
            // height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {props.data.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {props.data.name}
            </Typography>
            </CardContent>
        </CardActionArea>
        {/* <CardActions>
            <Button size="small" color="primary">
            Share
            </Button>
        </CardActions> */}
    </Card>
    );
  }
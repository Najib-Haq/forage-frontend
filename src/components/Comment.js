import React, {useState, useEffect} from "react";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


export default function Comment(props) {

    const [data, setData] = useState(null);
    const fontColor = {
        style: { color: 'rgb(255, 0, 255)' }
    }

    return (
        // <div> style={{overflowX: 'auto'}}>
        <div>
            {
                props.data.map((comment, index) => (
                    // console.log(comment)
                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined" key={index}>
                        <InputLabel htmlFor="outlined-adornment-description">{comment.commenter}</InputLabel>
                        <OutlinedInput
                            // placeholder="Project Description"
                            id="outlined-adornment-description"
                            value={comment.comment}   
                            disabled={true}
                            fullWidth
                            // onChange={(event)=>{setData({...data, description:event.target.value})}}
                            label={comment.commenter}
                            multiline={true}
                            sx={{
                                backgroundColor: '#f5f5f5',
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "black",
                                },
                            }}
                            // style={{color:'black'}}
                            
                        />  
                    </FormControl>
                ))
            }

            <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-description">Your Comment</InputLabel>
                <OutlinedInput
                    // placeholder="Project Description"
                    id="outlined-adornment-description"
                    value={data}   
                    // disabled={true}
                    fullWidth
                    onChange={(event)=>{setData(event.target.value)}}
                    label="Your Comment"
                    multiline={true}
                    rows={2}
                />  
            </FormControl>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Button 
                        variant="outlined" 
                        size="large" 
                        // startIcon={<AddIcon />}
                        style={{borderColor: "black", color: "black"}}
                        onClick={()=>{props.updateComments(props.reviewer, data); setData("")}}
                        // color="black"
                    >Send Message</Button>
                </Grid> 
            </Grid>
            {/* <Button variant="outlined" color="primary">Send</Button> */}
            {/* <Button variant="outlined" color="primary">Upload</Button> */}

            
        </div>
    )
}
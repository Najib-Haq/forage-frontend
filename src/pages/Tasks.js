import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid'
import Typography from "@mui/material/Typography"
import Button, { ButtonProps } from '@mui/material/Button';
// import SearchBar from "../components/SearchBar"
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';
import TaskModal from "../components/TaskModal";

export default function Tasks() {
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);

    const handleModalClose = () => {
        setOpenModal(false);
    }


    return (
        <React.Fragment>
            {/* <h1>Tasks Page</h1> */}

            <Grid container justifyContent="flex-end">
                {/* <Grid item>
                    <SearchBar
                        data={search}
                        handleSearch={(data) => {setSearch(data); console.log(data)}}
                    />
                </Grid> */}

                <Grid item>
                    <Button 
                        variant="outlined" 
                        size="large" 
                        startIcon={<AddIcon />}
                        style={{borderColor: "black", color: "black"}}
                        onClick={()=>{setOpenModal(true)}}
                        // color="black"
                    >Create Task</Button>
                </Grid> 
            </Grid>

            <TaskModal isOpen={openModal} handleClose={handleModalClose} projectTask={true}/>
        </React.Fragment>
    )
}
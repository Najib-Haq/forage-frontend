import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid'
import Typography from "@mui/material/Typography"
import Button, { ButtonProps } from '@mui/material/Button';
import SearchBar from "../components/SearchBar"
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';

import ProjectModal from '../components/ProjectModal';

// const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
//     color: theme.palette.getContrastText(grey[500]),
//     backgroundColor: grey[500],
//     '&:hover': {
//       backgroundColor: grey[700],
//     },
// }));

export default function Home() {
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);

    const handleModalClose = () => {
        setOpenModal(false);
    }

    return (
        <React.Fragment>
            {/* <h1>Home Page</h1> */}


            <Grid container justifyContent="flex-end">
                <Grid item>
                    <SearchBar
                        data={search}
                        handleSearch={(data) => {setSearch(data); console.log(data)}}
                    />
                </Grid>

                <Grid item>
                    <Button 
                        variant="outlined" 
                        size="large" 
                        startIcon={<AddIcon />}
                        style={{borderColor: "black", color: "black"}}
                        onClick={()=>{setOpenModal(true)}}
                        // color="black"
                    >Create Project</Button>
                </Grid> 
            </Grid>

            <ProjectModal isOpen={openModal} handleClose={handleModalClose}/>
        </React.Fragment>
    )
}
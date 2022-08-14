import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid'
import Typography from "@mui/material/Typography"
import Button, { ButtonProps } from '@mui/material/Button';
import SearchBar from "../components/SearchBar"
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';
import PaperCard from '../components/PaperCard';
import ProjectModal from '../components/ProjectModal';
import Box from '@mui/material/Box';

import { getStorageToken } from "../context/Auth";
import { useProjID, setStorageProjID } from "../context/ProjectID";

const URL = process.env.REACT_APP_API_URL;

// const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
//     color: theme.palette.getContrastText(grey[500]),
//     backgroundColor: grey[500],
//     '&:hover': {
//       backgroundColor: grey[700],
//     },
// }));

export default function Home() {
    const [search, setSearch] = useState("");
    const [cardData, setCardData] = useState([])
    const [openModal, setOpenModal] = useState(false);

    const handleModalClose = () => {
        setOpenModal(false);
    }

    const getData = () => {
        fetch(URL + 'api/projects/',
                {
                    method: 'GET',
                    credentials: "same-origin",
                    headers: {
                            'Authorization': `Token ${getStorageToken()}`,
                            'Content-Type':'application/json'
                    }
                })
                .then(resp=>{
                    console.log(resp)
                    if (resp.status >= 400) throw new Error();
                    return resp.json();
                })
                .then(resp=>{
                    setCardData(resp.results)
                })
                .catch(error=>{
                    console.log(error);
                })
    }

    const handleCardClick = (proj_id) => {
        // setProjID(proj_id);
        setStorageProjID(proj_id);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <React.Fragment>
            {/* <h1>Home Page</h1> */}


            <Grid container justifyContent="flex-end" sx={{pb:5}}>
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

            {
                cardData.length > 0 && 
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        {
                            cardData.map((item, index) => {
                                return (<Grid item key={index}>
                                            <PaperCard 
                                                key={index} 
                                                data={item}
                                                onClick={()=>handleCardClick(item.id)}
                                            />
                                        </Grid>
                                )
                            })
                        }
                    </Grid>
                </Box>
            }
            <ProjectModal isOpen={openModal} handleClose={handleModalClose}/>
        </React.Fragment>
    )
}
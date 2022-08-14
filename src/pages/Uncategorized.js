import React, { useState, useEffect } from "react";
import { getStorageToken } from "../context/Auth";
import { useProjID } from "../context/ProjectID";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SearchBar from "../components/SearchBar"
import PaperCard from '../components/PaperCard';
import PaperModal from '../components/PaperModal';


const URL = process.env.REACT_APP_API_URL;

const getData = (data) => {
    return data.results.map(item => {
        return {
            id: item.id,
            name: item.name,
        }
    })
}


export default function Uncategorized() {

    const { projID } = useProjID();
    const [cardData, setData] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [search, setSearch] = useState(null);

    // to update project list
    useEffect(() => {
        // call api to get projects lists under user
        console.log("ID : ", projID)
        if(projID != 'null')
            fetch(URL + 'api/papers/unsorted',
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
                    setData(resp)
                })
                .catch(error=>{
                    console.log(error);
                })
    }, [projID]);

    const handleModalClose = () => {
        setOpenModal(false);
    }

    const handleCardClick = (index) => {
        setModalData({
            id: cardData[index].id,
            name: cardData[index].name
        })
        // console.log(cardData[index])
        setOpenModal(true);
    }


    return (
        <React.Fragment>
            {
                cardData.length > 0 && 
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container justifyContent="flex-end" sx={{pb:5}}>
                        <Grid item>
                            <SearchBar
                                data={search}
                                handleSearch={(data) => {setSearch(data); console.log(data)}}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        {
                            cardData.map((item, index) => {
                                return (<Grid item key={index}>
                                            <PaperCard 
                                                key={index} 
                                                data={item}
                                                onClick={()=>handleCardClick(index)}
                                            />
                                        </Grid>
                                )
                            })
                        }
                    </Grid>
                </Box>
            }
            {openModal && <PaperModal data={modalData} isOpen={true} handleClose={handleModalClose} unsorted={true}/>}
        </React.Fragment>
    )
}
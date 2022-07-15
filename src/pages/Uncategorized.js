import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PaperCard from '../components/PaperCard';
import PaperModal from '../components/PaperModal';

import apidata from '../constant.js' // TODO: remove this

const getData = (data) => {
    return data.results.map(item => {
        return {
            id: item.id,
            name: item.name,
        }
    })
} 


export default function Uncategorized() {

    const [cardData, setData] = useState(getData(apidata()))
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const handleModalClose = () => {
        setOpenModal(false);
    }

    const handleCardClick = (index) => {
        setModalData({
            id: cardData[index].id,
            name: cardData[index].name
        })
        console.log(cardData[index])
        setOpenModal(true);
    }


    return (
        <React.Fragment>
            <Box sx={{ flexGrow: 1 }}>
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
            <PaperModal data={modalData} isOpen={openModal} handleClose={handleModalClose}/>
        </React.Fragment>
    )
}
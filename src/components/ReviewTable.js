import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, 
         TableHead, TableRow, Paper, Typography, Card } from '@mui/material';
import ReviewModal from "./ReviewModal";


/*
    PROPS:
        data: {
            heads: [],
            rows: [[]]
        }
        handleModalClose: reload after closing modal
*/


// TODO: Handle style. Current way gives errros. 
const tableStyle = {minWidth: 650, borderCollapse: 'collapse'}
const tableHeadStyle = {
    // border: '0',
    // boxShadow: '0px 1px 0px 0px #D9D9D9',
    // borderRadius: '5px'
}
const tableRowStyle = {
    // border: 'solid',
    // borderColor: 'blue',
    // borderWidth: '1px 0',
    // backgroundColor: 'blue',
    // border: '1 px solid #e0e0e0',
    // border: '1px inset #e0e0e0',
    // borderRadius: '2px',
    // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    '&:first-of-type': {borderTopLeftRadius: '15', borderTopRightRadius: '15px'},
    // '&:last-child td, &:last-child th': { border: 0 }
}

export default function ReviewTable(props) {
    const [data, setData] = useState(props.data);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        console.log("Received data : ", props.data)
        setData(props.data)
    }, [props.data])

    const openModalWithData = (id) => {
        // alert(data.rows[id])
        setModalData(data.rows[id]);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setModalData(null);
        props.handleModalClose();
        console.log("Closing modal")
    }

    return (
        <React.Fragment>
            {
                data.head.length > 0 && 
                // <TableContainer component={Paper}>
                <Table sx={ tableStyle } size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow sx={ tableHeadStyle }>
                            {
                                data.head.map((headCell)=>(
                                    <TableCell align="left" key={headCell}>{headCell}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            data.rows.map((row, row_index) => (
                                <TableRow
                                    component={Card} // TODO: this gives warning :/
                                    key={row[0]} // TODO: or the index which has review id
                                    sx={tableRowStyle}
                                >
                                    {
                                        data.head.map((headCell, index)=>(
                                            <TableCell 
                                                onClick={() => {if (index != 7) openModalWithData(row_index)}}
                                                align="left" 
                                                key={index}>{row[index]}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                // </TableContainer>
            }  

            <ReviewModal data={modalData} isOpen={openModal} handleClose={closeModal} />
        </React.Fragment>
    );
}

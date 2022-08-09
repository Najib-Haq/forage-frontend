import React, { useState, useEffect } from "react";
import SubmissionStep from "../components/SubmissionStep"
import SubmissionModal from "../components/SubmissionModal"

const steps = [
    'Select master blaster campaign settings',
    'Create an ad group',
    'Create an ad',
  ];

export default function Submission() {
    const [openModal, setOpenModal] = useState(true);

    const handleModalClose = () => {
        setOpenModal(false);
    }

    return (
        <React.Fragment>
            <h1>Submission Page</h1>
            <SubmissionStep/>

            <SubmissionModal isOpen={openModal} handleClose={handleModalClose}/>
        </React.Fragment>
    )
}
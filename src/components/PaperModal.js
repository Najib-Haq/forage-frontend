import React, {useState, useEffect} from "react";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

import { getStorageToken } from "../context/Auth";

/* 
    define props=> 
        isOpen: will open the modal
        handleClose: what to do when closing the modal
        data: data to display 
*/

const URL = process.env.REACT_APP_API_URL;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }



export default function BasicModal(props) {
    const [data, setData] = useState({});
    const [abstract, setAbstract] = useState("");
    const [note, setNote] = useState("");
    const [value, setValue] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [abstractFull, setAbstractFull] = useState(false);
    const [notePrivacy, setNotePrivacy] = useState("Private");
    const [checked, setChecked] = useState(false);
    const [editorState, setEditorState] = useState(()=> EditorState.createEmpty())

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if(props.data.id)
            fetch(URL + `api/papers/${props.data.id}`,
                {
                    method: 'GET',
                    credentials: "same-origin",
                    headers: {
                            'Authorization': `Token ${getStorageToken()}`,
                            'Content-Type':'application/json'
                    }
                })
                .then(resp=>{
                    if (resp.status >= 400) throw new Error();
                    return resp.json();
                })
                .then(resp=>{
                    console.log("data is :", resp)
                    // resp.note = "there is a note";
                    setData(resp);
                    if(resp.note == "")
                        setIsEditMode(true);
                    setNote(resp.note);
                    setAbstract(resp.abstract);
                })
                .catch(error=>{
                    console.log(error);
                })
    }, [props.isOpen]);
    
  
    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            {/* <Box sx={style}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Item One" {...a11yProps(0)} />
                    <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    Item One
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
            </Box> */}
            <Box sx={style}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Basic" {...a11yProps(0)} />
                        <Tab label="Notes" {...a11yProps(1)} />
                        <Tab label="Relevant" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    <b>{data.name}</b>
                    </Typography>
                    {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <b>{data.name}</b>
                    </Typography> */}
                    <Divider light />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <b>Authors </b> 
                    <p>{data.authors}</p>
                    </Typography>
                    <Divider light />
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    <b>Abstract </b> 
                    </Typography>
                    {!abstractFull && 
                        <div><p><i>{abstract.substring(0,abstract.length/3)}...</i><Button onClick={() => {
                            setAbstractFull(true);
                        }}>
                            <b>See More</b>
                        </Button></p></div>}
                    {abstractFull && 
                    <div>
                        <p><i>{abstract}</i><Button onClick={() => {
                            setAbstractFull(false);
                        }}>
                            <b> See Less</b>
                            </Button>
                        </p>
                    </div>}
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    <b>Notes </b> 
                    </Typography>
                    {!isEditMode &&
                        <div>
                            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                                <p>{note}</p>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={2}>
                            <Button variant="outlined" href="#outlined-buttons" onClick={() => {
                                    setIsEditMode(true);
                             }}>
                                    Edit
                                </Button>
                                </Stack>
                            </Typography>
                        </div>}
                    {isEditMode &&
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                        <TextField fullWidth id="outlined-basic" variant="outlined" onChange={(e)=>setNote(e.target.value)}
                    value={note}/>
                        {/* <Editor editorState={editorState} onChange={setEditorState}/> */}
                        <Stack direction="row" spacing={2}>
                        <Button variant="outlined" href="#outlined-buttons" onClick={() => {
                            setIsEditMode(false);
                            //have to change this according to backend implementation
                            // fetch(URL + "api/note-to-paper/",
                            //         {
                            //             method: 'POST',
                            //             credentials: "same-origin",
                            //             headers: {
                            //                 'Authorization': `Token ${getStorageToken()}`,
                            //                 'Content-Type':'application/json'
                            //             },
                            //             body: JSON.stringify({ 'ppid':props.data.id, 'note':note })
                            //         })
                            //         .then(resp => {
                            //             if (resp.status == 200)
                            //                 return resp.json();
                            //             else if (resp.status >= 400){
                            //                 if (resp.status == 500) throw new Error();
                            //                 return resp.json();
                            //             }
                            //         })
                            //         .then(resp => {
                            //             console.log(resp);
                            //         })
                            //         .catch(error=>{
                            //             console.log(error);
                            //         })
                        }}>
                            Save
                        </Button>
                        </Stack>
                    </Typography>}
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={checked} onChange={(e) => {
                            setChecked(e.target.checked);
                            if(notePrivacy=="Private")
                                setNotePrivacy("Public");
                            else
                                setNotePrivacy("Private");
                            //add api call
                        }} />} label={notePrivacy} />
                    </FormGroup>
                    </Typography>
                </TabPanel>     
            </Box>
        </Modal>
    );
  }
  
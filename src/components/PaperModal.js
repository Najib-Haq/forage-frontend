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
import { RichTextEditor } from '@mantine/rte';



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
    const [noteData, setNoteData] = useState({});
    const [publicNoteData, setPublicNoteData] = useState({});
    const [value, setValue] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [abstractFull, setAbstractFull] = useState(false);
    const [noteFull, setNoteFull] = useState({});
    const [notePrivacy, setNotePrivacy] = useState("Private");
    const [checked, setChecked] = useState(false);


    //TODO : delete default values of the following after adding api calls
    const [venueType, setVenueType] = useState("Conference");
    const [venueValue, setVenueValue] = useState("NSDI 2020");
    const [list, setList] = useState("To Read");
    const [collaborators, setCollaborators] = useState(['tahmeed']);
    
    const collaboratorItems = collaborators.map((collaborator) =>
        <div>{collaborator}</div>
        );

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if(props.data)
        {
            console.log("paper id",props.data.paper_id);
            console.log("project paper id",props.data.pp_id);
            fetch(URL + `api/papers/${props.data.paper_id}`,
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
                    console.log("data is :", resp);
                    console.log("abstract is :", resp.abstract);
                    setData(resp);
                    setAbstract(resp.abstract);
                })
                .catch(error=>{
                    console.log(error);
                });

            
                fetch(URL + `api/notes/${props.data.pp_id}/`,
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
                    console.log("data is :", resp);
                    
                    if(resp.text.length == 0)
                        setIsEditMode(true);
                    if(resp.visibility=="Public")
                        setChecked(true);
                    setNotePrivacy(resp.visibility);
                    setNote(resp.text); 
                    setNoteData(resp);
                    
                })
                .catch(error=>{
                    console.log(error);
                });

                fetch(URL + `api/notes/?project_paper__paper=${props.data.pp_id}`,
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
                    console.log("public note data is :", resp);
                    setPublicNoteData(resp);
                    setNoteFull(new Array(resp.count).fill(true));
                    
                })
                .catch(error=>{
                    console.log(error);
                });
            
        }
            
    }, [props.isOpen]);
    
  
    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          style={{overflow:'scroll'}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
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
                    <Divider light />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <b><small>Authors</small> </b> 
                    <p>{data.authors}</p>
                    </Typography>
                    <Divider light />
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    <b><small>Abstract</small> </b> 
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
                    <Stack direction="row" spacing={6}>
                        <div><b><small>{venueType}</small></b><div>{venueValue}</div></div>
                        <div><b><small>List</small> </b><div>{list}</div></div>
                        <div><b><small>Assigned</small></b><div>{collaboratorItems}</div> </div>
                    </Stack>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    <b><small>Notes</small></b> 
                    </Typography>
                    {!isEditMode &&
                        <div>
                            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                                <p><div className="content" dangerouslySetInnerHTML={{__html: note}}></div></p>
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
                    <div>
                    <div><RichTextEditor 
                    controls={[
                        ['bold', 'italic', 'underline', 'link'],
                        ['unorderedList', 'h1', 'h2', 'h3'],
                        ['sup', 'sub'],
                      ]} 
                    value={note} onChange={setNote}/></div>
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={2}>
                        <Button variant="outlined" href="#outlined-buttons" onClick={() => {
                            setIsEditMode(false);
                            //have to change the hardcoded project paper id
                            fetch(URL + `api/notes/${props.data.pp_id}/`,
                                    {
                                        method: 'PUT',
                                        credentials: "same-origin",
                                        headers: {
                                            'Authorization': `Token ${getStorageToken()}`,
                                            'Content-Type':'application/json'
                                        },
                                        body: JSON.stringify(
                                            {
                                                "id": noteData.id,
                                                "text": note,
                                                "visibility": notePrivacy,
                                                "last_modified": noteData.last_modified,
                                                "creator": noteData.creator,
                                                "project_paper": noteData.project_paper
                                            }
                                            )
                                    })
                                    .then(resp => {
                                        if (resp.status == 200)
                                            return resp.json();
                                        else if (resp.status >= 400){
                                            if (resp.status == 500) throw new Error();
                                            return resp.json();
                                        }
                                    })
                                    .then(resp => {
                                        console.log(resp);
                                    })
                                    .catch(error=>{
                                        console.log(error);
                                    })
                        }}>
                            Save
                        </Button>
                        </Stack>
                    </Typography></div>}
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={checked} onChange={(e) => {
                            setChecked(e.target.checked);
                            if(notePrivacy=="Private")
                                setNotePrivacy("Public");
                            else
                                setNotePrivacy("Private");
                            //add api call

                            //have to change the hardcoded project paper id
                            fetch(URL + `api/notes/${props.data.pp_id}/`,
                            {
                                method: 'PUT',
                                credentials: "same-origin",
                                headers: {
                                    'Authorization': `Token ${getStorageToken()}`,
                                    'Content-Type':'application/json'
                                },
                                body: JSON.stringify(
                                    {
                                        "id": noteData.id,
                                        "text": note,
                                        "visibility": notePrivacy,
                                        "last_modified": noteData.last_modified,
                                        "creator": noteData.creator,
                                        "project_paper": noteData.project_paper
                                    }
                                    )
                            })
                            .then(resp => {
                                if (resp.status == 200)
                                    return resp.json();
                                else if (resp.status >= 400){
                                    if (resp.status == 500) throw new Error();
                                    return resp.json();
                                }
                            })
                            .then(resp => {
                                console.log(resp);
                            })
                            .catch(error=>{
                                console.log(error);
                            })


                        }} />} label={notePrivacy} />
                    </FormGroup>
                    </Typography>
                </TabPanel> 
                <TabPanel value={value} index={1}>
                    <Typography id="modal-modal-title" variant="h4" component="h4" sx={{ mt: 2 }}>
                        <b>Public Notes</b>
                    </Typography>
                    <Divider light />
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 2 }}>
                        <b>{data.name}</b>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 4 }}>

                    {
                        publicNoteData.count > 0 && 
                        <div>
                        {
                            publicNoteData.results.map((item, index) => {
                                return (
                                    <Box
                                        sx={{
                                        width: 1,
                                        p: 1,
                                        bgcolor: (theme) =>
                                            theme.palette.mode === 'dark' ? 'white' : 'white',
                                        color: (theme) =>
                                            theme.palette.mode === 'dark' ? 'black' : 'black',
                                        border: '1px solid',
                                        borderColor: (theme) =>
                                            theme.palette.mode === 'dark' ? 'black' : 'black',
                                        borderRadius: 2,
                                        fontSize: '0.875rem',
                                        fontWeight: '700',
                                        textAlign: 'left',
                                        margin : '1em',
                                        }}
                                    >
                                        {item.text.length<=50 && 
                                            <h2><b>"{item.text}"</b></h2>
                                        }
                                        {item.text.length>50 && 
                                            <h2><b>"{item.text.substring(0,50)}..."</b></h2>
                                        }
                                        <p><i>{item.text}</i></p>
                                        {/* for see more see less feature, check how to update state by changing array element, then add below code */}
                                        {/* {!noteFull[index] && 
                                            <div><p><i>{item.text.substring(0,item.text.length/3)}...</i><Button onClick={() => {
                                                setNoteFull(prevState => ({
                                                    items: {
                                                        ...prevState.items,
                                                        [prevState.items[index]]: true,
                                                    },
                                                }));
                                            }}>
                                                <b>See More</b>
                                            </Button></p></div>}
                                        {noteFull[index] && 
                                        <div>
                                            <p><i>{item.text}</i><Button onClick={() => {
                                                setNoteFull(prevState => ({
                                                    items: {
                                                        ...prevState.items,
                                                        [prevState.items[index]]: false,
                                                    },
                                                }));
                                            }}>
                                                <b> See Less</b>
                                                </Button>
                                            </p>
                                        </div>} */}
                                    <Divider light />
                                    <p><b>Last Updated: </b>{item.last_modified}</p>
                                    </Box>

                                )
                            })
                        }
                        </div>
                    }
                    
                    </Typography>
                </TabPanel>    
            </Box>
        </Modal>
    );
  }
  
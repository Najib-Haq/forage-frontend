import React, {useState, useEffect} from "react";
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import { getStorageToken } from "../context/Auth";
import MuiGrid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';

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
    width: '1200px', //'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };


const Grid = styled(MuiGrid)(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    '& [role="separator"]': {
      margin: theme.spacing(0, 2),
    },
  }));
  
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, collaboratorName, theme) {
    return {
      fontWeight:
        collaboratorName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  
const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function BasicModal(props) {
    const theme = useTheme();
    const [data, setData] = useState({
        name: "",
        description: "",
        colab: [],
        keywords: [],
        domains: [],
        start_date: ""
    });
    const [initialData, setinitialData] = useState({
        users: [],
        keywords: [],
        domains: []
    });
    const [startDate, setStartDate] = useState(new Date());
    const [collaboratorName, setCollaboratorName] = React.useState([]);
    const [keywords, setKeywords] = React.useState([]);
    const [domains, setDomains] = React.useState([]);
    const [keywordAnchorEl, setKeywordAnchorEl] = React.useState(null);
    const [domainAnchorEl, setDomainAnchorEl] = React.useState(null);
    const [keywordChipData, setKeywordChipData] = React.useState([]);
    const [domainChipData, setDomainChipData] = React.useState([]);

    const keywordPopOverOpen = Boolean(keywordAnchorEl);
    const domainPopOverOpen = Boolean(domainAnchorEl);
    const popKeywordId = keywordPopOverOpen ? 'simple-popover' : undefined;
    const popDomainId = domainPopOverOpen ? 'simple-popover' : undefined;

    useEffect(() => {
        if(props.data)
        {
            setinitialData(props.data);
            console.log(props.data);
            console.log("initialData.length",initialData.length);
        }
    }, [])


    const handleKeywordPopOverClick = (event) => {
        setKeywordAnchorEl(event.currentTarget);
      };
    
    const handleKeywordPopOverClose = () => {
        setKeywordAnchorEl(null);
    };

    const handleDomainPopOverClick = (event) => {
        setDomainAnchorEl(event.currentTarget);
      };
    
    const handleDomainPopOverClose = () => {
        setDomainAnchorEl(null);
    };

    const handleCollaboratorChange = (event) => {
        const {
          target: { value },
        } = event;
        setCollaboratorName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const handleKeywordsChange = (event) => {
        const {
            target: { value },
        } = event;
        setKeywords(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        
        let data;
        typeof value === 'string' ? data=value.split(',') : data=value;
        
        let chipdict = [];
        let idx=0;
        data.forEach(element => {
            chipdict.push({
                key : idx,
                label: element
            });
            idx++;
        });
        console.log("chipdict",chipdict);

        setKeywordChipData(chipdict);
    };

    const handleDomainsChange = (event) => {
        const {
            target: { value },
        } = event;
        setDomains(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        
        let data;
        typeof value === 'string' ? data=value.split(',') : data=value;
        
        let chipdict = [];
        let idx=0;
        data.forEach(element => {
            chipdict.push({
                key : idx,
                label: element
            });
            idx++;
        });
        console.log("chipdict",chipdict);

        setDomainChipData(chipdict);
    };

    const handleKeywordDelete = (chipToDelete) => () => {
        setKeywordChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
      };
    const handleDomainDelete = (chipToDelete) => () => {
        setDomainChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    const createProject = () => 
    {
        let kw = [];
        keywordChipData.forEach(element => {
            kw.push(element.label);
        });
        setKeywords(kw);

        let dom = [];
        domainChipData.forEach(element => {
            kw.push(element.label);
        });
        setDomains(dom);

        setData({...data, keywords:keywords, domains: domains, colab: collaboratorName, start_date: startDate});
        console.log("create project data",data);

        //TODO : add api call to create project

        props.handleClose();
    };


    const content = (
        <div>
        <Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Create New Project 
            </Typography>

            <Divider />

            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-title">Title</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-title"
                    value={data.name}
                    onChange={(event)=>{setData({...data, name:event.target.value})}}
                    label="Title"
                />  
            </FormControl>

            <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-description">Description</InputLabel>
                <OutlinedInput
                    placeholder="Project Description"
                    id="outlined-adornment-description"
                    value={data.description}    
                    onChange={(event)=>{setData({...data, description:event.target.value})}}
                    label="Description"
                    multiline={true}
                    rows={5}
                />  
            </FormControl>
        </Box>
        <Grid container spacing={2}>
            <Grid item xs={6}>
            <FormControl sx={{width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Collaborators</InputLabel>
                <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={collaboratorName}
                onChange={handleCollaboratorChange}
                input={<OutlinedInput label="Collaborators" />}
                MenuProps={MenuProps}
                >
                {initialData && initialData.users.map((name) => (
                    <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, collaboratorName, theme)}
                    >
                    {name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Grid>
            <Grid item xs={6}>
                <small>Keywords</small>
                <Paper
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: 0,
                    }}
                    component="ul"
                    >
                    {keywordChipData.map((data) => {
                        let icon;

                        return (
                        <ListItem key={data.key}>
                            <Chip
                            icon={icon}
                            label={data.label}
                            onDelete={handleKeywordDelete(data)}
                            />
                        </ListItem>
                        );
                    })}
                    </Paper>
            </Grid>
            <Grid item xs={6}>
                <DateTimePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={setStartDate}
                                    renderInput={(params) => <TextField {...params} />}
                        />
            </Grid>
            
            <Grid item xs={6}>
                <small>Domains</small>
                <Paper
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: 0,
                    }}
                    component="ul"
                    >
                    {domainChipData.map((data) => {
                        let icon;

                        return (
                        <ListItem key={data.key}>
                            <Chip
                            icon={icon}
                            label={data.label}
                            onDelete={handleDomainDelete(data)}
                            />
                        </ListItem>
                        );
                    })}
                    </Paper>
            </Grid>
        </Grid>
    </div>
      );

      const content2 = (
        <Box>
            <Button aria-describedby={popKeywordId} variant="contained" onClick={handleKeywordPopOverClick} fullWidth sx={{ m: 1 }}>
                Add Keywords
            </Button>
            <Popover
                id={popKeywordId}
                open={keywordPopOverOpen}
                anchorEl={keywordAnchorEl}
                onClose={handleKeywordPopOverClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>
                <FormControl sx={{width: 180 }}>
                    <InputLabel id="keyword-label">Keywords</InputLabel>
                    <Select
                    labelId="keyword-label"
                    id="keyword-name"
                    multiple
                    value={keywords}
                    onChange={handleKeywordsChange}
                    input={<OutlinedInput label="Keywords" />}
                    MenuProps={MenuProps}
                    >
                    {initialData && initialData.keywords.map((name) => (
                        <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, keywords, theme)}
                        >
                        {name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Typography>
                <Typography sx={{ p: 2 }}>
                <Button variant="contained" fullWidth sx={{ m: 1 }}>Create Keyword</Button>
                </Typography>
            </Popover>

            <Button aria-describedby={popDomainId} variant="contained" onClick={handleDomainPopOverClick} fullWidth sx={{ m: 1 }}>
                Add Domains
            </Button>
            <Popover
                id={popDomainId}
                open={domainPopOverOpen}
                anchorEl={domainAnchorEl}
                onClose={handleDomainPopOverClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>
                <FormControl sx={{width: 180 }}>
                    <InputLabel id="domain-label">Domains</InputLabel>
                    <Select
                    labelId="domain-label"
                    id="domain-name"
                    multiple
                    value={domains}
                    onChange={handleDomainsChange}
                    input={<OutlinedInput label="Domains" />}
                    MenuProps={MenuProps}
                    >
                    {initialData && initialData.domains.map((name) => (
                        <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, collaboratorName, theme)}
                        >
                        {name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Typography>
                <Typography sx={{ p: 2 }}>
                <Button variant="contained" fullWidth sx={{ m: 1 }}>Create Domain</Button>
                </Typography>
            </Popover>
            <Button variant="contained" fullWidth sx={{ m: 1 }} onClick={createProject}>Create</Button>
        </Box>
      );
  
    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
                    
                <Grid container sx={style}>
                    <Grid item xs>
                        {content}
                    </Grid>
                    <Divider orientation="vertical" flexItem style = {{minWidth: "20px"}}>
                    </Divider>
                    <Grid item xs style = {{maxWidth: "200px"}}>
                        {content2}
                    </Grid>
                </Grid>
            
        </Modal>
    );
  }
  
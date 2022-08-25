import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';

// logos
import logo from '../forage_logo.png';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';


import '../styles/Sidebar.css';
import { useAuth } from "../context/Auth";
import { useProjID, setStorageProjID } from "../context/ProjectID";

const URL = process.env.REACT_APP_API_URL;

const selectStyle = {
  textAlign : 'left',
  maxHeight : '80%',
  color: '#131313', // TODO: change this with default value stuff
}
const footerMenuStyle = { display: 'flex', flexDirection: 'row', padding: 0, paddingLeft: 7, alignItems: 'center', justifyContent: 'center'}

const quickAccessLabels = [
  'Home', 'My Tasks', 'Uncategorized', 'Reviews'
]
const quickAccessLogos = [
  <HomeOutlinedIcon/>, <NoteAltOutlinedIcon/>, <VisibilityOutlinedIcon/>, <ContentPasteSearchOutlinedIcon/>,
]
const projectAccessLabels = [
  'Papers', 'Tasks', 'Schedule', 'Submission'
]
const projectAccessLogos = [
  <FeedOutlinedIcon/>, <ListAltOutlinedIcon/>, <CalendarMonthOutlinedIcon/>, <ScheduleSendOutlinedIcon/>,
]
const footerLogos = [
  <PermIdentityOutlinedIcon/>, <SettingsOutlinedIcon/>, <NotificationsNoneOutlinedIcon/>,
]

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

function prepData(data) {
    const preppedData = []
    data.results.map(item => {
        if(!item.is_default) {
            preppedData.push({
                id: item.id,
                name: item.name
            })
        }
    })
    return preppedData;
}


export default function PermanentDrawerLeft(props) {
    const drawerWidth = props.drawerWidth;
    const routes = props.routes;

    const startingLocation = useLocation();
    // console.log("Starting location: " + startingLocation.pathname + " ; "  + [...quickAccessLabels, ...projectAccessLabels].at(routes.indexOf(startingLocation.pathname)));
    const { authToken } = useAuth();
    const [active, setActive] = useState(
        [...quickAccessLabels, ...projectAccessLabels].at(routes.indexOf(startingLocation.pathname))
    );

    // get project names
    const [projects, setProjects] = useState([]);
    const { projID, setProjID } = useProjID();
    
    // to update project list
    useEffect(() => {
        // call api to get projects lists under user
        if(authToken != 'null')
            fetch(URL + 'api/projects',
                {
                    method: 'GET',
                    credentials: "same-origin",
                    headers: {
                            'Authorization': `Token ${authToken}`,
                            'Content-Type':'application/json'
                    }
                })
                .then(resp=>{
                    if (resp.status >= 400) throw new Error();
                    return resp.json();
                })
                .then(resp=>{
                    console.log("data is :", prepData(resp))
                    setProjects(prepData(resp))
                })
                .catch(error=>{
                    console.log(error);
                })
    }, [authToken]);


    const handleChange = (event) => {
        setProjID(event.target.value);
        setStorageProjID(event.target.value);
    };

    return (
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                borderWidth: 1,
                borderColor: '#C3C3C3',
            },
            }}
            variant="permanent"
            anchor="left"
        >

        <ListItemIcon>
            {<img src={logo} className="App-logo" alt="logo" />}
        </ListItemIcon>

        <Divider variant='middle' light={true}/>

        {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
        </Search> */}

        <label className='Sidebar-header'> Quick Access </label>

        <List>
            {quickAccessLabels.map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton 
                        component={Link} 
                        to={routes.at(index)}
                        onClick={() => setActive(text)}
                        selected={active===text} 
                        sx={active===text ? {borderRadius: '5%', ml: 1, mr: 1, backgroundColor: '#D9D9D9'} : {ml: 1, mr: 1,}}>
                        <ListItemIcon>
                        {quickAccessLogos.at(index)}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>

        <label className='Sidebar-header'> Project  </label>

        <FormControl sx={{ m: 2 }}>
            {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
            <Select
                value={projID ? projID : ""}
                onChange={handleChange}
                displayEmpty
                sx= {selectStyle} //{styles.Select}
            >
                {   
                    projects.length > 0 &&  projects.map(item => {
                                                    return (
                                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                    )
                                                })
                }
            </Select>
        </FormControl>

        {/* show only when a project is selected */}
        
        {
            projID && 
            <List>
                {projectAccessLabels.map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton 
                            component={Link} 
                            to={routes.at(index+4)}
                            onClick={() => setActive(text)}
                            selected={active===text} 
                            sx={active===text ? {borderRadius: '5%', ml: 1, mr: 1, backgroundColor: '#D9D9D9'} : {ml: 1, mr: 1, }}>
                            <ListItemIcon>
                            {projectAccessLogos.at(index)}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        }
        
        <div className="bottomPush">
            <List style={footerMenuStyle}>
                {footerLogos.map((footerLogo, index) => (
                    <ListItem key={index} disablePadding>
                    <ListItemButton sx={{padding: 1.4,}}>
                        <ListItemIcon>
                        {footerLogo}
                        </ListItemIcon>
                    </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
      </Drawer>
  );
}

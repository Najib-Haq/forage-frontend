import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

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

import '../styles/Sidebar.css';

const selectStyle = {
  textAlign : 'left',
  maxHeight : '80%',
  color: '#C3C3C3', // TODO: change this with default value stuff
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


export default function PermanentDrawerLeft(props) {
  const drawerWidth = props.drawerWidth;
  const routes = props.routes;

  const startingLocation = useLocation();
  // console.log("Starting location: " + startingLocation.pathname + " ; "  + [...quickAccessLabels, ...projectAccessLabels].at(routes.indexOf(startingLocation.pathname)));
  const [active, setActive] = useState(
    [...quickAccessLabels, ...projectAccessLabels].at(routes.indexOf(startingLocation.pathname))
  );

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
        {/* <Toolbar 
            children={<img src={logo} className="App-logo" alt="logo" />}
        /> */}

        <Divider variant='middle' light={true}/>

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
                value={0}
                // onChange={handleChange}
                displayEmpty
                sx= {selectStyle} //{styles.Select}
                // inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value={0}>Select Project</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
        </FormControl>

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

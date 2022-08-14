import { Routes, Route } from "react-router-dom";
import { useAuth, removeStorageToken } from "./context/Auth";
import { useProjID, removeStorageProjID } from "./context/ProjectID";
import './styles/App.css';
import Sidebar from './components/Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// import pages
import Home from './pages/Home';
import MyTasks from "./pages/MyTasks";
import Uncategorized from "./pages/Uncategorized";
import Reviews from "./pages/Reviews";
import Papers from "./pages/Papers";
import Tasks from "./pages/Tasks";
import Schedule from "./pages/Schedule";
import Submission from "./pages/Submission";
import Error from './components/Error';

// search
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

const drawerWidth = 250;

const routing = [
  "/", "/mytasks", "/uncategorized", "/reviews", "/papers", "/tasks", "/schedule", "/submission"
]
const pages = [
  <Home />, <MyTasks />, <Uncategorized />, <Reviews />, <Papers />, <Tasks />, <Schedule />, <Submission />
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



function App() {
    const { setAuthToken } = useAuth();
    const { setProjID } = useProjID();
    const handleLogOut = () => {
        console.log("Logging Out");
        setAuthToken(null);
        removeStorageToken();

        localStorage.removeItem('username'); // TODO: remove user id if appended
        
        setProjID(null);
        removeStorageProjID();
    }
  
    return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}}
        >
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* Title */}
            </Typography>
            <Search>
                <SearchIconWrapper>
                <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                />
             </Search>
            <Button sx={{backgroundColor: "#a3a3a3", color: "black"}} onClick={handleLogOut}>Logout</Button>
        </Toolbar>
        </AppBar>
        
        { <Sidebar routes={routing} drawerWidth={drawerWidth}/> }

        <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
        <Toolbar/>
        <Routes>
            {pages.map((page, index) => {
                return (<Route path={routing[index]} element={page} key={index} />)
            })}
            <Route path="*" element={<Error />} />
        </Routes>
        </Box>

    </Box>
    );
}

export default App;

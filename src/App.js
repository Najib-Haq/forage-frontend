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

const drawerWidth = 250;

const routing = [
  "/", "/mytasks", "/uncategorized", "/reviews", "/papers", "/tasks", "/schedule", "/submission"
]
const pages = [
  <Home />, <MyTasks />, <Uncategorized />, <Reviews />, <Papers />, <Tasks />, <Schedule />, <Submission />
]

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
        <Toolbar sx={{backgroundColor: "#ffffff"}}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Title
            </Typography>
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
                return (<Route path={routing[index]} element={page} />)
            })}
            <Route path="*" element={<Error />} />
        </Routes>
        </Box>

    </Box>
    );
}

export default App;

import { Routes, Route } from "react-router-dom";
import './styles/App.css';
import Sidebar from './components/Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// import pages
import Home from './pages/Home';
import MyTasks from "./pages/MyTasks";
import Uncategorized from "./pages/Uncategorized";
import Reviews from "./pages/Reviews";
import Papers from "./pages/Papers";
import Tasks from "./pages/Tasks";
import Schedule from "./pages/Schedule";
import Submission from "./pages/Submission";
import Error from './pages/Error';

const drawerWidth = 250;

const routing = [
  "/", "/mytasks", "/uncategorized", "/reviews", "/papers", "/tasks", "/schedule", "/submission"
]
const pages = [
  <Home />, <MyTasks />, <Uncategorized />, <Reviews />, <Papers />, <Tasks />, <Schedule />, <Submission />
]

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
      </AppBar>
      
      <Sidebar routes={routing} drawerWidth={drawerWidth}/>

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

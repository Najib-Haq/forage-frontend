import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './context/Auth';
import { ProjIDProvider } from './context/ProjectID';
import { UserProvider } from './context/User';

import './styles/index.css';
import App from './App';
import Login from './pages/Login';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';


const Index = () => {
    return (
        // <React.StrictMode> /* strict mode doesnt work with react-trello */
            <Router>
                <UserProvider>
                    <AuthProvider
                        opt1= {
                            <ProjIDProvider>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <App />
                            </LocalizationProvider>
                            </ProjIDProvider>
                        }
                        opt2= {<Login />}
                    />
                </UserProvider>
            </Router>
        // </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
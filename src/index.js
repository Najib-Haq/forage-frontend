import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './context/Auth';
import { ProjIDProvider } from './context/ProjectID';

import './styles/index.css';
import App from './App';
import Login from './pages/Login';


const Index = () => {
    return (
        // <React.StrictMode> /* strict mode doesnt work with react-trello */
            <Router>
                <AuthProvider
                    opt1= {
                        <ProjIDProvider>
                            <App />
                        </ProjIDProvider>
                    }
                    opt2= {<Login />}
                />
            </Router>
        // </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
import React from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Link } from 'react-router-dom'  
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import forageIcon from '../forage_logo.png';
import { Toolbar } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getStorageToken, setStorageToken, useAuth } from '../context/Auth';
import { useUser } from '../context/User';


const theme = createTheme();
const URL = process.env.REACT_APP_API_URL;

export default function Login() {

    const [value, setValue] = React.useState(false);
    const [dob, setDob] = React.useState(new Date());
    // const navigate = useNavigate();

    const navigateSignup = () => {
        setValue(true);
      };
    const navigateLogin = () => {
        setValue(false);
    };

    const { setAuthToken } = useAuth();
    const { setUser } = useUser(); 

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');


        fetch(URL + "auth/token/",
            {
                method: 'POST',
                credentials: "same-origin",
                headers: {
                    'Content-type': 'application/json',
                    // 'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({ username, password })
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
                // console.log("login",resp);
                setAuthToken(resp.token);
                setStorageToken(resp.token);
                // localStorage.setItem('username', username);
                // console.log(`storage token: ${getStorageToken()}`);
                setUser([resp.user.id, resp.user.username]);
            })
            .catch(error=>{
                console.log(error);
            })
    };

    const login = (<ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <Toolbar>
                <img src={forageIcon} className="App-logo" alt="logo"/>
            </Toolbar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoComplete="username"
                autoFocus
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                />
                <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                />
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Sign In
                </Button>
                <Grid container>
                <Grid item xs>
                    {/* <Link href="#" variant="body2">
                    Forgot password?
                    </Link> */}
                </Grid>
                <Grid item>
                    <a onClick={navigateSignup} style={{cursor: 'pointer'}}>
                    {"Don't have an account? Sign Up"}
                    </a>
                </Grid>
                </Grid>
            </Box>
            </Box>
        </Container>
        </ThemeProvider>);

    const handleSignup = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('firstName')+" "+data.get('lastName'),
            affiliation: data.get('affiliation'),
            designation: data.get('designation'),
            email: data.get('email'),
            password: data.get('password'),
            date_of_birth : dob
        });

    //add api call
    fetch(URL + "api/users/",
            {
                method: 'POST',
                credentials: "same-origin",
                headers: {
                    'Content-type': 'application/json',
                    // 'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({
                  username: data.get('username'),
                  full_name: data.get('firstName')+" "+data.get('lastName'),
                  email: data.get('email'),
                  affiliation: data.get('affiliation'),
                  designation: data.get('designation'),
                  password: data.get('password')
              })
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
                console.log("signup",resp);
                navigateLogin();
            })
            .catch(error=>{
                console.log(error);
            })

    };

    const signup = (<ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Toolbar>
                  <img src={forageIcon} className="App-logo" alt="logo"/>
              </Toolbar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSignup} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="affiliation"
                    label="Affiliation"
                    id="affiliation"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="designation"
                    label="Designation"
                    id="designation"
                  />
                </Grid>
                <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={dob}
                  onChange={(newValue) => {
                    setDob(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <a onClick={navigateLogin} style={{cursor: 'pointer'}}>
                      Already have an account? Sign in
                  </a>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>);


    return (
        <div>{!value && login}{value && signup}</div>
    );
}

import React from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import forageIcon from '../forage_logo.png';
import { Toolbar } from '@mui/material';

import { useAuth, setStorageToken } from '../context/Auth';

const theme = createTheme();

var headers =  {
    'Content-Type': 'application/json'
}

export default function Login() {

    async function postData(url = '', data = {}, h = {'Content-Type': 'application/json'}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: h,
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

    const { setAuthToken } = useAuth();
    const URL = process.env.REACT_APP_API_URL;

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');

        console.log({
            username: data.get('username'),
            password: data.get('password'),
            // url: URL + 'api/papers/',
        });

        postData(URL + 'auth/token/', { username: 'tahmeed', password: 'tahmeed' }, headers)
        .then(data => {
            // localStorage['token'] = data['token'];
            console.log("inside function call="+localStorage['token']);
        // JSON data parsed by `data.json()` call
        });

        // fetch(URL + 'api/papers/',
        // {
        //     method: 'GET',
        //     mode: 'no-cors', // no-cors, *cors, same-origin
        //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //     credentials: 'include', // include, *same-origin, omit
        //     headers: {
        //             // 'Authorization': `Token ${getStorageToken()}`,
        //             'Content-Type':'application/json'}
        // }).then(resp=>{
        //     console.log("RESPONSE GET: ", resp);
        //     if (resp.status >= 400) throw new Error();
        //     return resp.json();
        // }).then(resp=>{
        //     console.log("GOTIT");
        // }).catch(error=>{
        //     console.log(error);
        // })

        // fetch(URL + "auth/token/",
        //     {
        //         method: 'POST',
        //         // mode: "no-cors",
        //         mode: 'cors', // no-cors, *cors, same-origin
        //         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //         credentials: 'same-origin', // include, *same-origin, omit
        //         // credentials: "include",
        //         headers: {
        //             'Content-type': 'application/json',
        //             // 'Access-Control-Allow-Credentials': true
        //         },
        //         redirect: 'follow', // manual, *follow, error
	    //         referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	  
        //         body: JSON.stringify({ username: 'tahmeed', password: 'tahmeed' })
        //     })
        //     .then(resp => {
        //         console.log("RESPONSE", resp)
        //         if (resp.status == 200)
        //             return resp.json();
        //         else if (resp.status >= 400){
        //             if (resp.status == 500) throw new Error();
        //             return resp.json();
        //         }
        //     })
        //     .then(resp => {
        //         console.log(resp);
        //         // setAuthToken(resp.token);
        //         // localStorage.setItem('username', resp.username);
        //     })
        //     .catch(error=>{
        //         console.log(error);
        //     })
    };

    return (
        <ThemeProvider theme={theme}>
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
                {/* <Grid item xs>
                    <Link href="#" variant="body2">
                    Forgot password?
                    </Link>
                </Grid> */}
                <Grid item>
                    <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
        </Container>
        </ThemeProvider>
    );
}

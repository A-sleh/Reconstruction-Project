import { assets } from "@/assets/assets.ts";
import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";

import './index.css'

const LoginForm = () => {
  return (
    <form onSubmit={() => alert("here")}>
      <Box>
        <img src={assets.logo} alt="logo" />
        <Typography variant="h1">Wellcome Back</Typography>
        <Typography variant="h6">Let's login to grab amazing deal</Typography>
      </Box>
      <Box>
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          type="email"
        />
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          color="secondary"
          type="password"
        />
        <Box>
          <label htmlFor="">Remember me</label>
          <a href=""> 
            <Checkbox color="info"/>
            Forgot Password?</a>
        </Box>
        <Button variant="contained" type="submit" color="secondary">
          Login
        </Button>
        <Typography variant="h4">Don't have an account? 
            <Button >Sign Up</Button>
        </Typography>
      </Box>
      <div id='abdo'>
        <img src={assets.buldingImage} alt="" />
      </div>
    </form>
  );
};

export default LoginForm;

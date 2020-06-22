// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {auth} from "../../firebaseConfig";
// import { generateUserDocument } from "../../firebaseConfig";
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Typography from '@material-ui/core/Typography';
// import Grid from '@material-ui/core/Grid';
// import firebase from '../../firebaseConfig';
// import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormControl from '@material-ui/core/FormControl';
// import clsx from 'clsx';
// import GoogleButton from 'react-google-button'
// import './SignUp.styles.scss';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& > *': {
//       margin: theme.spacing(1),
//       width: '100%',
//     },
//   },
//   margin: {
//     margin: theme.spacing(1),
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));

// const SignUp = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [displayName, setDisplayName] = useState("");
//   const [error, setError] = useState(null);
//   const classes = useStyles();

//   const onChangeHandler = event => {
//     const { name, value } = event.currentTarget;
//     if (name === "userEmail") {
//       setEmail(value.toString().trim());
//     } else if (name === "userPassword") {
//       setPassword(value.toString().trim());
//     } else if (name === "displayName") {
//       setDisplayName(value.toString().trim());
//     }
//   };

//   const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
//     event.preventDefault();
//     try{
//       const {user} = await auth.createUserWithEmailAndPassword(email, password);
//       generateUserDocument(user, {displayName});
//     }
//     catch(error){
//       setError('Error Signing up with email and password');
//     }
//     setEmail("");
//     setPassword("");
//     setDisplayName("");
//   };

//   const provider = new firebase.auth.GoogleAuthProvider();
//   const signInWithGoogle = () => {
//     auth.signInWithPopup(provider);
//   };

//   return (
//     <div id="wrapper">
//       <CssBaseline />
//       <Grid
//         id="white"
//         container
//         direction="column"
//         justify="center"
//         alignItems="center"
//         spacing={1}
//       >
//         <Grid id="title" item xs={12}>
//             <h1>Welcome to <span id="storify">Storify!</span></h1>
//         </Grid>
//         <Grid id="google-signup" item xs={12} lg={6}>
//             <GoogleButton
//               size="medium"
//               className={classes.margin}
//               onClick={(event) => { signInWithGoogle() }}
//             >
//             </GoogleButton>
//         </Grid>
        
//           <Grid id="email-signup" item xs={12} lg={6}>
//             <Typography>Sign up with an email address:</Typography>
            
//             {error !== null && (
//               <div className="py-4 bg-red-600 w-full text-center mb-3">
//                 {error}
//               </div>
//             )}
          
//             <FormControl className={clsx(classes.margin, classes.textField)} noValidate autoComplete="on">
//               <InputLabel htmlFor="displayName">Display Name:</InputLabel>    
//               <Input
//                 id="displayName"
//                 type={'text'}
//                 onChange={(event) => onChangeHandler(event)}
//             />
//           </FormControl>
//           <FormControl className={clsx(classes.margin, classes.textField)}>
//             <InputLabel htmlFor="email">Email:</InputLabel>    
//               <Input
//                 id="email"
//                 type={'email'}
//                 onChange={(event) => onChangeHandler(event)}
//             />
//           </FormControl>
//           <FormControl className={clsx(classes.margin, classes.textField)}>
//             <InputLabel htmlFor="userPassword">Password:</InputLabel>    
//               <Input
//                 id="userPassword"
//                 type={'password'}
//                 onChange={(event) => onChangeHandler(event)}
//               />
//               <Button
//                 id="signup-btn"
//                 className="btn btn-dark"
//                 variant="contained"
//                     onClick={(event) => { createUserWithEmailAndPasswordHandler(event, email, password) }}>
//                     Sign Up
//               </Button>
//             </FormControl>
//         </Grid>
        
//         <Typography id="links">
//             <Link to="/" className="text-blue-500 hover:text-blue-600">
//                   Sign in here
//             </Link>
//         </Typography>
//       </Grid>
//     </div>
//   );
// };
// export default SignUp;
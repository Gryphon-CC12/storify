import React from 'react';
import { GoogleLogout } from 'react-google-login';
//import {auth} from "firebase/auth";

import { useGoogleLogout } from 'react-google-login'
import logout from 'react-google-login'

//const { signOut, loaded } = useGoogleLogout({
        // jsSrc,
        // onFailure,
        // clientId,
        // cookiePolicy,
        // loginHint,
        // hostedDomain,
        // fetchBasicProfile,
        // discoveryDocs,
        // uxMode,
        // redirectUri,
        // scope,
        // accessType,
        // onLogoutSuccess
//      })



function Logout(props) {


//   const logout = (response) => {
//       console.log("LOGOUT RESPONSE", response)
//       console.log("logout?")
//       //auth.signOut()
//       //GoogleAuth.signOut();
// 	}  

	return (
		<GoogleLogout
			clientId="336851866169-pgf0mr1e3is106a8ptuu19h3urf8tp7n.apps.googleusercontent.com"
			buttonText="Logout"
			onLogoutSuccess={logout}
		>   
        </GoogleLogout>
	);
}
export default Logout;





    // initClient()
    // var GoogleAuth; // Google Auth object.
    // function initClient() {
    //   gapi.client.init({
    //       'apiKey': 'AIzaSyBtkdQm-zOXuSOPR0MSXdFLFrUurxGuqyc',
    //       'clientId': '336851866169-pgf0mr1e3is106a8ptuu19h3urf8tp7n.apps.googleusercontent.com',
    //       'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
    //       'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
    //   }).then(function () {
    //       GoogleAuth = gapi.auth2.getAuthInstance();
    //       // Listen for sign-in state changes.
    //       GoogleAuth.isSignedIn.listen(updateSigninStatus);
    //   });
    // }
  

import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";

const Styles = styled.div`
  .navbar {
    background-color: #222;
  }
  a,
  .navbar-brand,
  .navbar-nav .nav-link {
    color: #bbb;
    &:hover {
      color: white;
    }
  }
`;

const CustomNavbar = () => (
  <Styles>
    {/* <Navbar expand="lg"> */}
    <Navbar expand>
      <Navbar.Brand href="/">Code Life</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Item>
            <Nav.Link>
              <Link to="/">Home</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/about">About</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/contact">Contact</Link>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </Styles>
);

export { CustomNavbar };

// import React from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.styles.scss";
// import deleteAllEntries from "../../utils/deleteAllEntries";
// import deleteAllStoryDatabase from "../../utils/deleteAllStories";
// import deleteAllUserDatabase from "../../utils/deleteAllUserDatabase";
// import { Layout, Header, Navigation, Drawer, Content } from "react-mdl";

// function Navbar() {
//   return (
//     // <BreaksStrictMode>
//       <div className="demo-big-content">
//         {/* <Layout> */}
//         <Header title="STORIFY" scroll>
//           <Navigation>
//             <Link to="/createstory">Create Story</Link>
//             <Link to="/">Home</Link>
//             <Link to="/about">About</Link>
//             <Link to="/profile">Profile</Link>
//           </Navigation>
//         </Header>
//         <Drawer title="STORIFY">
//           <Navigation>
//             <Link to="/createstory">Create Story</Link>
//             <Link to="/">Home</Link>
//             <Link to="/about">About</Link>
//             <Link to="/profile">Profile</Link>
//           </Navigation>
//         </Drawer>
//         <Content>
//           <div className="page-content" />
//         </Content>
//         {/* </Layout> */}
//       </div>
//     // </BreaksStrictMode>
//   );
// }
// export default Navbar;

// import React from "react";
// import * as ReactBootStrap from "react-bootstrap";
// import { BrowserRouter as Router, Link } from "react-router-dom";

// const NavBar = () => {
//   return (
//     <div className="App">
//       <ReactBootStrap.Navbar
//         collapseOnSelect
//         expand="xl"
//         bg="danger"
//         variant="dark"
//       >
//         <ReactBootStrap.Navbar.Brand href="#home">
//           THICC BOIS HOURS
//         </ReactBootStrap.Navbar.Brand>
//         <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
//         <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
//           <ReactBootStrap.Nav className="mr-auto">
//             <Link to="/features">
//               <ReactBootStrap.Nav.Link href="#features">
//                 Features
//               </ReactBootStrap.Nav.Link>
//             </Link>
//             <Link to="/pricing">
//               <ReactBootStrap.Nav.Link href="#pricing">
//                 Pricing
//               </ReactBootStrap.Nav.Link>
//             </Link>
//             <ReactBootStrap.NavDropdown
//               title="YEET"
//               id="collasible-nav-dropdown"
//             >
//               <ReactBootStrap.NavDropdown.Item href="#action/3.1">
//                 Action
//               </ReactBootStrap.NavDropdown.Item>
//               <ReactBootStrap.NavDropdown.Item href="#action/3.2">
//                 Another action
//               </ReactBootStrap.NavDropdown.Item>
//               <ReactBootStrap.NavDropdown.Item href="#action/3.3">
//                 Something
//               </ReactBootStrap.NavDropdown.Item>
//               <ReactBootStrap.NavDropdown.Divider />
//               <ReactBootStrap.NavDropdown.Item href="#action/3.4">
//                 Separated link
//               </ReactBootStrap.NavDropdown.Item>
//             </ReactBootStrap.NavDropdown>
//           </ReactBootStrap.Nav>
//           <ReactBootStrap.Nav>
//             <Link to="/deets">
//               <ReactBootStrap.Nav.Link href="#deets">
//                 More deets
//               </ReactBootStrap.Nav.Link>
//             </Link>
//             <Link to="/dankmemes">
//               <ReactBootStrap.Nav.Link eventKey={2} href="#memes">
//                 Dank memes
//               </ReactBootStrap.Nav.Link>
//             </Link>
//           </ReactBootStrap.Nav>
//         </ReactBootStrap.Navbar.Collapse>
//       </ReactBootStrap.Navbar>
//     </div>
//   );
// };

// export default NavBar;

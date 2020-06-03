import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.styles.scss';
import deleteAllEntries from '../../utils/deleteAllEntries';
import deleteAllStoryDatabase from '../../utils/deleteAllStories';


function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
        <div id="nav-title">Storify</div>
        <Link to="/createstory">
          <button className="btn btn-success btn-sm">Create Story</button>
      </Link>
        <button className="btn btn-sm btn-danger" id="entry-input" onClick={deleteAllEntries}>Delete All Entries</button>
        <button className="btn btn-sm btn-danger"
        id = "entry-input"
        onClick = {
          deleteAllStoryDatabase
        } > Delete All StoryDatabase</button> 
        <form className="form-inline">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
    </nav>
  );
}

export default Navbar;

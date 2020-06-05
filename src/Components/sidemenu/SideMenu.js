import React from 'react';
import './SideMenu.styles.scss';
import { Link } from 'react-router-dom';
import { auth } from "../../firebaseConfig";

function SideMenu() {
	return (
		<div className="SideMenu">
			<div className="wrapper">
				<nav id="sidebar">
					{/* <div className="sidebar-header">
						<h3>Bootstrap Sidebar</h3>
					</div> */}

					<ul className="list-unstyled components">
					<p>Quick Links</p>
						<li className="active">
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to='/about'>About</Link>
						</li>
						<li>
							<a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
								{/* This probably requires bootstrap jquery/JS plugin to work properly */}
								Rankings
							</a>
							<ul className="collapse list-unstyled" id="pageSubmenu">
								<li>
									<a href="#">Most Liked</a>
								</li>
								<li>
									<a href="#">Newest</a>
								</li>
								<li>
									<a href="#">Browse by Genre</a>
								</li>
							</ul>
						</li>
						<li>
							<Link to="/profile">Profile</Link>
						</li>
						<li>
							<Link to="/">[TODO] Check for open stories</Link>
						</li>
						<li>
							<Link to="/">
								<button className="btn btn-sm btn-info" onClick ={() => {auth.signOut()}}>Sign out</button>
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default SideMenu;

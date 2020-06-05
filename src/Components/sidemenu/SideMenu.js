import React from 'react';
import './SideMenu.styles.scss';
import { Link } from 'react-router-dom';

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
								Pages
							</a>
							<ul className="collapse list-unstyled" id="pageSubmenu">
								<li>
									<a href="#">Page 1</a>
								</li>
								<li>
									<a href="#">Page 2</a>
								</li>
								<li>
									<a href="#">Page 3</a>
								</li>
							</ul>
						</li>
						<Link to="/profile">
							<li>
								<a href="/profile">Profile</a>
							</li>
						</Link>
						<li>
							<a href="#">Contact</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default SideMenu;

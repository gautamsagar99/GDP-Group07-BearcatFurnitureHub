import React from 'react';
import {
	Nav,
	NavLink,
	NavMenu,
	NavHome,
	NavBtn,
	NavBtnLink,
	SearchInput,
	NavNotificationBtnLink,
	SearchBtnLink
} from './NavbarElements';
import { FaBell, FaUser, FaEnvelope } from 'react-icons/fa';

const Navbar = () => {
	const bellIconStyle = {
		color: 'white', // Change the color to white
		fontSize: '24px', // Increase the font size
	};
	const profileIconStyle = {
		color: 'white', // Change the color to white
		fontSize: '24px', // Increase the font size
	};
	const messageIconStyle = {
		color: 'white', // Change the color to white
		fontSize: '24px', // Increase the font size
	};

	return (
		<>

			<Nav>

				<NavMenu>
					<NavHome activeStyle>
						<b>Bearcat Furniture Hub</b>
					</NavHome>

					<NavLink to='/home' activeStyle>
						All Products
					</NavLink>
					<NavLink to='/DonateFurniture' activeStyle>
						Donate Furniture
					</NavLink>
					{/* Second Nav */}
					{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
				</NavMenu>
				<SearchInput type="text" placeholder="Search for products">
				</SearchInput>
				
				<SearchBtnLink to='/home'>Search</SearchBtnLink>
				
				<NavBtn>
					<NavNotificationBtnLink>
						<FaBell style={bellIconStyle} />
					</NavNotificationBtnLink>
					<NavNotificationBtnLink>
						<FaEnvelope style={messageIconStyle} />
					</NavNotificationBtnLink>
					<NavNotificationBtnLink to='/ProfileDetails'>
						<FaUser style={profileIconStyle} />
					</NavNotificationBtnLink>
				</NavBtn>

				<NavBtn>
					<NavBtnLink to='/'>Signout</NavBtnLink>
				</NavBtn>

			</Nav>
		</>
	);
};

export default Navbar;

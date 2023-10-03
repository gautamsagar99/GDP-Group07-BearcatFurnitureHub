import React, { useState } from 'react';
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



const Navbar = ({ onSearch, onResetSearch }) => {
		const [searchQuery, setSearchQuery] = useState('');
	  
		const handleSearch = () => {
		  onSearch(searchQuery);
		};
		const allProducts = () => {
			if(searchQuery !== ""){
				onResetSearch();
				// setSearchQuery = ""
				// onSearch(" ");
				SearchInput.placeholder ="Search for products"
				setSearchQuery('');
			}
			
		};
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
					<NavHome>
						<b>Bearcat Furniture Hub</b>
					</NavHome>

					<NavLink to='/home' onClick={allProducts}>
						All Products
					</NavLink>
					<NavLink to='/DonateFurniture'>
						Donate Furniture
					</NavLink>
					{/* Second Nav */}
					{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
				</NavMenu>
				<SearchInput type="text" id="searchInput"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				placeholder="Search for products">
				</SearchInput>
				
				<SearchBtnLink onClick={handleSearch}>Search</SearchBtnLink>
				
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

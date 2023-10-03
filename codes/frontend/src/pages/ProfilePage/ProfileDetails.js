import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/index'
import Tab from "../../components/Tabs/Tabs"
import UserDetails from "../../components/UserDetails/UserDetails"
import { getUserDetails } from '../../utils/api';

const ProfileDetails = () => {
	const [userDetails, setUserDetails] = useState([]);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userData = await getUserDetails();
				setUserDetails(userData);
			} catch (error) {
				console.error("Error fetching user details:", error);
			}
		};

		fetchUserData();

		return () => {
			// Cleanup function (if needed)
			// You can add any cleanup code here
		};
	}, []); // Empty dependency array means this effect runs only once on mount

	return (
		<div>
			<Navbar />	
			<UserDetails
				first_name ={userDetails.first_name} 
				last_name = {userDetails.last_name}
				email="johndoe@example.com" />
			<Tab />
		</div>
	);
};

export default ProfileDetails;

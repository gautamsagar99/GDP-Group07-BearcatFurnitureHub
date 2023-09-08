import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  background: #006747;
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center; /* Center vertically */
  padding: 0 5px; /* Add padding to the left and right */
  font-size: 18px;
  z-index: 12;
`;

export const NavLink = styled(Link)`
  color: #F9F6EE;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 10px 18px; /* Add padding to the top and bottom and left and right */
  height: 100%;
  font-size: 18px;
  cursor: pointer;
  &.active {
    color: #D3D3D3;
	text-decoration: bold;
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #F9F6EE;
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px; /* Add margin to the left */
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-left: 20px; /* Add margin to the left */
`;
export const SearchBtnLink = styled(Link)`
  border-radius: 4px;
  background: #D3D3D3;
  padding: 8px 10px; /* Add padding to the top and bottom and left and right */
  color: black;
  text-color: white;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #808080;
  }
`;

export const SearchInput = styled.input`
  padding: 10px 20px; /* Add padding to the top and bottom and left and right */
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  font-size: 15px;
  margin: 0; /* Remove all margins */
  height: 20px;
  width: 300px;
  placeholder: search for products;
`;


export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: #D3D3D3;
  padding: 8px 8px; /* Add padding to the top and bottom and left and right */
  color: black;
  outline: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #808080;
  }
`;

export const NavNotificationBtnLink = styled(Link)`
  padding: 10px 20px; /* Add padding to the top and bottom and left and right */
  color: #000000;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
`;
export const NavHome = styled(Link)`
color: white;
display: flex;
align-items: center;
text-decoration: none;
height: 100%;
cursor: pointer;
&.active {
	color: white;
}
`;


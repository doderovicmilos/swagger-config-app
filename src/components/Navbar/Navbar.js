import React from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import './navbar.scss'
import SignUpPage from "../../pages/SignUp/SignUpPage";
import LogInPage from "../../pages/LogIn/LogInPage";

const Navbar = () => {

  const dispatch = useDispatch();

  const handleSignUpClick = () => dispatch({type: "SIGN_UP_OPEN"});
  const handleLogInClick = () => dispatch({type: "LOG_IN_OPEN"});

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <a onClick={handleSignUpClick}>Sign up</a>
          </li>
          <li>
            <a onClick={handleLogInClick}>Log in</a>
          </li>
        </ul>
      </nav>
      <SignUpPage/>
      <LogInPage/>
    </>
  );
};

export default Navbar;
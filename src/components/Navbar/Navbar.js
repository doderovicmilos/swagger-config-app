import React from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import './navbar.scss'
import SignUpPage from '../../pages/SignUp/SignUpPage';
import LogInPage from '../../pages/LogIn/LogInPage';
import { SIGN_UP_OPEN, LOG_IN_OPEN } from '../../store/types';


const Navbar = () => {

  const dispatch = useDispatch();
  const handleSignUpClick = () => dispatch({type: SIGN_UP_OPEN});
  const handleLogInClick = () => dispatch({type: LOG_IN_OPEN});

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to='/'>Home</Link>
          </li>
          <li className="nav-item">
            <a onClick={handleSignUpClick}>Sign up</a>
          </li>
          <li className="nav-item">
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
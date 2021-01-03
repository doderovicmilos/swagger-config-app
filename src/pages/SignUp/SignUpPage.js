import React, {useState} from 'react';
import {registerUser} from "../../api/api";
import Modal from "react-modal";
import {useDispatch, useSelector} from "react-redux";
import SignUpForm from "./components/SignUpForm";
import './signUp.scss';
import { SIGN_UP_CLOSE } from "../../store/types";

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '345px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

Modal.setAppElement('#root');

const SignUpPage = () => {
  const dispatch = useDispatch();
  // const [user, setUser] = useState({email: '', password: '', repeatedPassword: ''})
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const signUpOpen = useSelector(state => state.modal.signUpOpen);

  const handleSubmit = (user) => {

    registerUser(user)
      .then(response => response.json())
      .then(response => {
        //error
        if (response.Code) onSubmitError(response);
        //success
        else onSubmitSuccess(response);
      })
      .catch(error => console.error(error));
  };

  const onSubmitError = (error) => {
    setError(error);
  };

  const onSubmitSuccess = (response) => {
    setIsSuccess(true);
  };

  const onModalClose = () => {
    dispatch({type: SIGN_UP_CLOSE});
    setError(null);
    setIsSuccess(false);
  }

  return (
      <Modal
        isOpen={signUpOpen}
        onRequestClose={onModalClose}
        style={modalStyles}
      >
        {
          error
            ?
            <div className="alert alert-danger" role="alert">{error && error.Code}</div>
            :
            isSuccess
              ?
              <div className="alert alert-success" role="alert">User registration successful!</div>
              :
              <SignUpForm onSubmit={handleSubmit}/>
          }
      </Modal>
  );
};

export default SignUpPage;
import React, {useState, useEffect} from 'react';
import Modal from "react-modal";
import {logInUser, registerUser} from "../../api/api";
import {useDispatch, useSelector} from "react-redux";
import LogInForm from './components/LogInForm';


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

const LogInPage = () => {
  const dispatch = useDispatch();
  const logInOpen = useSelector(state => state.modal.logInOpen);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const onModalClose = () => {
    dispatch({type: "LOG_IN_CLOSE"});
    setError(null);
    setIsSuccess(false);
  }

  const handleSubmit = (user) => {
    logInUser(user)
      .then(response => response.json())
      .then(response => {
        //error
        if (response.Code && response.Message) onSubmitError(response);
        //success
        else onSubmitSuccess(response);
      })
      .catch(error => console.error(error));
  };


  const onSubmitError = (error) => {
    setError(error);
  };

  const onSubmitSuccess = (response) => {
    if(response && response.token) {
      localStorage.setItem('swaggerApiToken', response.token)
      setIsSuccess(true);
    }
    else setError({Code: 'Unknown', Message:'Unknown error'})
  };

  return (
    <Modal
    isOpen={logInOpen}
    //onAfterOpen={afterOpenModal}
    onRequestClose={onModalClose}
    style={modalStyles}
    contentLabel="Example Modal"
  >
    {
      error
        ?
        <div className="alert alert-danger" role="alert">{error && error.Message}</div>
        :
        isSuccess
          ?
          <div className="alert alert-success" role="alert">Log in successful!</div>
          :
          <LogInForm onSubmit={handleSubmit}/>

    }
  </Modal>);
}

export default LogInPage;
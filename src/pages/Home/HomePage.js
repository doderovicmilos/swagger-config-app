import React, {useState, useReducer, useEffect} from 'react';
import Modal from 'react-modal';
import modalReducer, { initialState } from '../../reducers/modalReducer'
import { useDispatch, useSelector } from 'react-redux';
// JS
// const input = document.getElementById('myText');
// const inputValue = input.value
// React
// value, onChange

import { getConfigs } from '../../api/api'
import {Link} from "react-router-dom";


const Home = () => {

  const [configs, setConfigs] = useState([]);

  useEffect(()=>{

    console.log("get configs");

    getConfigs().then(response=>response.json())
      .then(response=> setConfigs(response))
      .catch(error=>console.log(error));
  }, [])


  return (
    <section>

      { configs.map((config, index) => <div key={index}><Link to={`/config/${config.config_name}?version=${config.config_version}`}><span>{config.config_name}</span> <span>{config.config_version}</span></Link><br/></div>) }




    </section>
  );
}


export default Home;
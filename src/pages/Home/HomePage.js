import React, {useState, useReducer, useEffect} from 'react';
import { getConfigs } from '../../api/api'
import {Link} from "react-router-dom";


const Home = () => {

  const [configs, setConfigs] = useState([]);

  useEffect(()=>{
    getConfigs().then(response=>response.json())
      .then(response=> setConfigs(response))
      .catch(error=>console.log(error));
  }, [])


  return (
    <section className="page home-page">
      { configs.map((config, index) =>
        (<div key={index}>
          <Link to={`/config/${config.config_name}?version=${config.config_version}`}>
            <span>{config.config_name}</span>
            <span>{config.config_version}</span></Link><br/>
         </div>)
        )
      }

    </section>
  );
}


export default Home;
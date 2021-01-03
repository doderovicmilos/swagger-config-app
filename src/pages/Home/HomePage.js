import React, {useState, useEffect} from 'react';
import {getConfigs} from '../../api/api'
import {Link} from "react-router-dom";
import './homePage.scss'

const Home = () => {

  const [configs, setConfigs] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if(localStorage.swaggerApiToken){
      getConfigs().then(response => {
        return response.json()})
        .then(response => setConfigs(response))
        .catch(error => console.log(error));
    } else {
      setMessage("Please Log in to continue.");
    }
  }, [])


  return (
    <section className="page home-page">

      {message && <div className="alert alert-info" role="alert">{message}</div>}

      {configs.map((config, index) =>
        (
          <div key={index} className="list-item">
            <div className="list-item-title">
              <Link to={`/config/${config.config_name}?version=${config.config_version}`}>
                <span className="config-name">{config.config_name}</span> <span className="config-version">{config.config_version}</span>
              </Link>
            </div>
          </div>
        )
      )
      }

    </section>
  );
}


export default Home;
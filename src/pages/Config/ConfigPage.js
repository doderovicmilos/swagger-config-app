import React, {useState, useRef, useEffect} from 'react';
import { getConfig } from '../../api/api'
import { useParams } from "react-router-dom";
import './configPage.scss';

const ConfigPage = (props) => {
    const parsedUrl = new URL(window.location.href);
    const { name } = useParams();
    const version = parsedUrl.searchParams.get("version");
    const [config, setConfig] = useState({});
    const textAreaRef = useRef(null);

  useEffect(()=>{
    getConfig(name, version).then(response=>response.json())
      .then(response=> setConfig(JSON.stringify(response, undefined, 3)))
      .catch(error=>console.log(error));
  }, [])

  console.log(config);

  const handleTextChange = (e) => {
    e.preventDefault();
    setConfig(e.target.value);

  }

  const handleParseClick = () => {

    const newValue = JSON.parse(textAreaRef.current.value);

     setConfig(JSON.stringify(newValue, undefined, 3));

  }

  return (
    <section className="config-page">

      <textarea
        rows={20}
        value={config}
        onChange={handleTextChange}
        ref = {textAreaRef}
      ></textarea>

      <button className="btn btn-primary" onClick={handleParseClick}>Parse</button>

      {/*{ configs.map(config => <><Link to={`/about/${config.config_name}`}><span>{config.config_name}</span><span>{config.config_version}</span></Link><br/></>) }*/}

      <h1>{name}</h1>


    </section>
  );
}


export default ConfigPage;
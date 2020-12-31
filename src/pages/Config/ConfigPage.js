import React, {useState, useRef, useEffect, useCallback} from 'react';
import {getConfig, saveConfig} from '../../api/api'
import { useParams } from "react-router-dom";
import './configPage.scss';

const ConfigPage = (props) => {
    const parsedUrl = new URL(window.location.href);
    const { name } = useParams();
    const version = parsedUrl.searchParams.get("version");
    const [configString, setConfigString] = useState('');
    const [extractedConfigString, setExtractedConfigString] = useState('');
    const textAreaRef = useRef(null);



    const [numberOfRows, setNumberOfRows] = useState(1);


  useEffect(()=>{
    getConfig(name, version).then(response=>response.json())
      .then(response=> setConfigString(JSON.stringify(response, undefined, 3)))
      .catch(error=>console.error(error));
    }, []);



  useEffect(()=>{

    setNumberOfRows(configString.split("\n").length);

  }, [configString]);

  const handleTextChange = (e) => {
    e.preventDefault();
    setConfigString(e.target.value);
  }

  const handleParseClick = () => {
    const newValue = JSON.parse(textAreaRef.current.value);
     setConfigString(JSON.stringify(newValue, undefined, 3));
  }

  const handleSaveClick = () => {
    const config = JSON.parse(configString);

    const payload = { name: config.config_name, version: config.config_version, data: config.data  }



    saveConfig(payload).then(response=>response.json())
      .then(response=>console.log(response))
      .catch(error=>console.error(error));

  }

  const handleIndexClick = (e) => {

    const clickedLineNumber = parseInt(e.target.getAttribute("value"));



    const attribute = configString.split("\n")[clickedLineNumber].match(/"(.*?)"/) && configString.split("\n")[clickedLineNumber].match(/"(.*?)"/)[1];

    if(!extractedConfigString && attribute){

      const currentValue = JSON.parse(textAreaRef.current.value);

      const replacer = (key, value) => {

        if(key === attribute ) {
          if(typeof value === "object"  ) setExtractedConfigString( `\"${attribute}\"\:${JSON.stringify(value)},`);
        }

        if(key === attribute) return undefined;
        else return value;

      };
      const newValue = JSON.stringify(currentValue, replacer, 3)
      setConfigString(newValue);

    }
    else {

      const lines = textAreaRef.current.value.split("\n");

      lines.splice(clickedLineNumber + 1, 0, extractedConfigString)

      const newValueString = lines.join("\n");

      setExtractedConfigString("");

      const newValue = JSON.parse(newValueString);

      //setConfigString(newValueString);

      setConfigString(JSON.stringify(newValue, undefined, 3));


    }




  };

  return (
    <section className="page config-page">

      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{[...Array(numberOfRows)].map((it, index)=>(<div onClick={handleIndexClick} value={index}>{index}</div>))}</span>
        </div>
        <textarea
          rows={numberOfRows}
          value={configString}
          onChange={handleTextChange}
          ref = {textAreaRef}
          wrap="off"
          className="form-control" aria-label="With textarea"/>
      </div>

      <div className="button-container">
        <button className="btn btn-primary" onClick={handleParseClick}>Parse</button>
        <button className="btn btn-primary" onClick={handleSaveClick}>Save config</button>
      </div>


    </section>
  );
}


export default ConfigPage;
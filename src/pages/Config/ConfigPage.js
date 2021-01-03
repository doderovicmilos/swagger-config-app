import React, {useState, useRef, useEffect} from 'react';
import {saveConfig} from '../../api/api'
import {useParams} from "react-router-dom";
import './configPage.scss';
import extractSegment from "./utils/extractSegment";
import useConfig from "./useConfig";
import ActionButtonGroup from "./components/ActionButtonGroup";

const ConfigPage = () => {
  const parsedUrl = new URL(window.location.href);
  const params = useParams();
  const paramsConfigName = params.configName;
  const [configName, setConfigName] = useState(paramsConfigName);
  const [configVersion, setConfigVersion] = useState(parsedUrl.searchParams.get("version"));
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const textAreaRef = useRef(null);
  const {configString, setConfigString, extractedConfigString, setExtractedConfigString, numberOfRows, allowedActions} = useConfig(paramsConfigName, configVersion);

  useEffect(()=>{
    setError(false);
    setMessage(null);
  },[configString, configName, configVersion]);

  const formatConfig = (configString) => {
    const newValue = JSON.parse(configString);
    return JSON.stringify(newValue, undefined, 3);
  };

  const handleNameChange = (e) => {
    setConfigName(e.target.value);
  }

  const handleVersionChange = (e) => {
    setConfigVersion(e.target.value);
  }

  const handleTextChange = (e) => {
    e.preventDefault();
    setConfigString(e.target.value);
  }

  const handleFormatClick = () => {
    try{
      formatConfig(configString);
      setMessage("JSON is valid!")
    } catch (e){
      setError(true);
      setMessage("JSON is invalid!")
      console.error(e);
    }
  }

  const handleSaveClick = () => {
    const payload = {name: configName, version: configVersion, data: configString}
    saveConfig(payload).then(response => response.json())
      .then(response => {
        setMessage(response.Message);
        if (response.Code) setError(true);
      })
      .catch(error => console.error(error));
  }

  const handleCopyClick = (e) => {
    console.log(e);
    const lineNumber = parseInt(e.target.parentNode.getAttribute('value'));
    setExtractedConfigString(extractSegment(configString, lineNumber)['extractedSegment']);
  };

  const handleCutClick = (e) => {
    console.log(parseInt(e.target.parentNode.getAttribute('value')));
    const lineNumber = parseInt(e.target.parentNode.getAttribute('value'));
    setExtractedConfigString(extractSegment(configString, lineNumber)['extractedSegment']);
    setConfigString(formatConfig(extractSegment(configString, lineNumber)['newConfigValue']));
  };

  const handleDeleteClick = (e) => {
    console.log(e);
    const lineNumber = parseInt(e.target.parentNode.getAttribute('value'));
    setConfigString(formatConfig(extractSegment(configString, lineNumber)['newConfigValue']));
  };

  const handlePasteClick = (e) => {
    console.log(e);
    const lines = textAreaRef.current.value.split("\n");
    const clickedLineNumber = parseInt(e.target.parentNode.getAttribute("value"));

    const enteringToEmptyObject = lines[clickedLineNumber].match(/: {}/);
    const enteringToEmptyArray = lines[clickedLineNumber].match(/: \[\]/);

    if(enteringToEmptyObject){
      const lineToInsert = lines[clickedLineNumber].replace('}', extractedConfigString + '}');
      lines.splice(clickedLineNumber, 1, lineToInsert);
    }
    else if(enteringToEmptyArray){
      const lineToInsert = lines[clickedLineNumber].replace(']', extractedConfigString + ']');
      lines.splice(clickedLineNumber, 1, lineToInsert);
    }
    else {
      const enteringToLastPlace = lines[clickedLineNumber + 1].trim().charAt(0) === '}' || lines[clickedLineNumber + 1].trim().charAt(0) === ']';
      const lineToInsert = enteringToLastPlace ? ',' + extractedConfigString : extractedConfigString + ',';
      lines.splice(clickedLineNumber + 1, 0, lineToInsert);
    }

    const newValueString = lines.join("\n");
    setConfigString(formatConfig(newValueString));
  }

  return (
    <section className="page config-page">

      <div className='input-group name-version-input mb-2'>
        <label htmlFor='version' className='form-label'>Configuration: </label>
        <input
          type='text'
          id='name'
          name='name'
          value={configName}
          onChange={handleNameChange}
          className='form-control'
        />
        <input
          type='text'
          id='version'
          name='version'
          value={configVersion}
          onChange={handleVersionChange}
          className='form-control'
        />
      </div>

      <div className="input-group config-input">
        <div className="input-group-prepend">
          <span className="input-group-text">
            {
              [allowedActions.map(
                (it, index) => (
                  <div key={index}>
                    <ActionButtonGroup
                      index={index}
                      allowedActions={it}
                      handleCopyClick={handleCopyClick}
                      handleCutClick={handleCutClick}
                      handlePasteClick={handlePasteClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                    <span>{index}</span>
                  </div>
                )
              )]
            }
          </span>
        </div>
        <textarea
          rows={numberOfRows}
          value={configString}
          onChange={handleTextChange}
          ref={textAreaRef}
          wrap="off"
          className="form-control" aria-label="With textarea"/>


      </div>

      { message && <div className={error ? 'alert alert-danger' : 'alert alert-success'} role="alert">{message}</div>}


      <div className="button-container">
        <button className="btn btn-primary" onClick={handleFormatClick}>Format</button>
        <button className="btn btn-primary" onClick={handleSaveClick}>Save config</button>
      </div>

    </section>
  );
}


export default ConfigPage;
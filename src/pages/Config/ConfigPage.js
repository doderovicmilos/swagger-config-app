import React, {useState, useRef, useEffect, useCallback} from 'react';
import {getConfig, saveConfig} from '../../api/api'
import {useParams} from "react-router-dom";
import './configPage.scss';
import extractSegment from "./utils/extractSegment";
import useConfig from "./useConfig";
import ActionButtonGroup from "./components/ActionButtonGroup";

const ConfigPage = (props) => {
  const parsedUrl = new URL(window.location.href);
  const {configName} = useParams();
  const configVersion = parsedUrl.searchParams.get("version");
  const textAreaRef = useRef(null);
  const {configString, setConfigString, extractedConfigString, setExtractedConfigString, numberOfRows, setNumberOfRows, allowedActions, setAllowedActions} = useConfig(configName, configVersion);

  const handleTextChange = (e) => {
    e.preventDefault();
    setConfigString(e.target.value);
  }

  const handleParseClick = () => {
    formatConfig();
  }

  const formatConfig = (configString) => {
    const newValue = JSON.parse(configString);
    return JSON.stringify(newValue, undefined, 3);
  };

  const handleSaveClick = () => {
    const config = JSON.parse(configString);
    const payload = {name: config.config_name, version: config.config_version, data: config.data}
    saveConfig(payload).then(response => response.json())
      .then(response => console.log(response))
      .catch(error => console.error(error));
  }

  const handleCopyClick = (e) => {
    const lineNumber = parseInt(e.target.parentNode.getAttribute('value'));
    setExtractedConfigString(extractSegment(configString, lineNumber)['extractedSegment']);
  };

  const handleCutClick = (e) => {
    const lineNumber = parseInt(e.target.parentNode.getAttribute('value'));
    setExtractedConfigString(extractSegment(configString, lineNumber)['extractedSegment']);
    setConfigString(formatConfig(extractSegment(configString, lineNumber)['newConfigValue']));
  };

  const handleDeleteClick = (e) => {
    const lineNumber = parseInt(e.target.parentNode.getAttribute('value'));
    setConfigString(formatConfig(extractSegment(configString, lineNumber)['newConfigValue']));
  };

  const handlePasteClick = (e) => {
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
    setExtractedConfigString(null);
    setConfigString(formatConfig(newValueString));
  }

  return (
    <section className="page config-page">

      <div className="input-group">
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

      <div className="button-container">
        <button className="btn btn-primary" onClick={handleParseClick}>Parse</button>
        <button className="btn btn-primary" onClick={handleSaveClick}>Save config</button>
      </div>


    </section>
  );
}


export default ConfigPage;
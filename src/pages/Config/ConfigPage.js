import React, {useState, useRef, useEffect, useCallback} from 'react';
import {getConfig, saveConfig} from '../../api/api'
import { useParams } from "react-router-dom";
import './configPage.scss';
import CutIcon from "../../components/Icons/CutIcon";
import PasteIcon from "../../components/Icons/PasteIcon";
import TrashIcon from "../../components/Icons/TrashIcon";
import CopyIcon from "../../components/Icons/CopyIcon";
import extractSegment from "./utils/extractSegment";
import useConfig from "./useConfig";

const ConfigPage = (props) => {
    const parsedUrl = new URL(window.location.href);
    const { configName } = useParams();
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
    const payload = { name: config.config_name, version: config.config_version, data: config.data  }
    saveConfig(payload).then(response=>response.json())
      .then(response=>console.log(response))
      .catch(error=>console.error(error));
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
    const lineToInsert = lines[clickedLineNumber + 1].trim().charAt(0) === '}' || lines[clickedLineNumber + 1].trim().charAt(0) === ']' ? ',' + extractedConfigString : extractedConfigString + ',';
    lines.splice(clickedLineNumber + 1, 0, lineToInsert);
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
                  <div key={index} value={index}>
                    { it.copy && <button className="btn btn-outline-primary btn-sm"
                                                  onClick={handleCopyClick}
                    >
                      <CopyIcon />
                    </button> }
                    { it.cut && <button className="btn btn-outline-primary btn-sm"
                            onClick={handleCutClick}
                    >
                      <CutIcon/>
                    </button> }
                    { it.paste && <button className="btn btn-outline-primary btn-sm"
                      onClick={handlePasteClick}
                    >
                      <PasteIcon  />
                    </button>}
                    { it.del && <button className="btn btn-outline-danger btn-sm"
                      onClick={handleDeleteClick}
                    >
                      <TrashIcon />
                    </button> }
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
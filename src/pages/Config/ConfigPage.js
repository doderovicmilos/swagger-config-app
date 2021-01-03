import React, {useState, useRef, useEffect, useCallback} from 'react';
import {getConfig, saveConfig} from '../../api/api'
import { useParams } from "react-router-dom";
import './configPage.scss';
import CutIcon from "../../components/Icons/CutIcon";
import PasteIcon from "../../components/Icons/PasteIcon";
import TrashIcon from "../../components/Icons/TrashIcon";
import CopyIcon from "../../components/Icons/CopyIcon";
import extractSegment from "./utils/extractSegment";


const ConfigPage = (props) => {
    const parsedUrl = new URL(window.location.href);
    const { name } = useParams();
    const version = parsedUrl.searchParams.get("version");
    const [configString, setConfigString] = useState('');
    const [extractedConfigString, setExtractedConfigString] = useState(null);
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
    //setConfigString(formatConfig(extractSegment(configString, lineNumber)['newConfigValue']));
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
    console.log(lines[clickedLineNumber + 1].trim());
    const lineToInsert = lines[clickedLineNumber + 1].trim().charAt(0) === '}' || lines[clickedLineNumber + 1].trim().charAt(0) === ']' ? ',' + extractedConfigString : extractedConfigString + ',';
    lines.splice(clickedLineNumber + 1, 0, lineToInsert);
    const newValueString = lines.join("\n");
    setExtractedConfigString(null);

    setConfigString(formatConfig(newValueString));
  }

  const enableCut = (index) => {
    const lines = configString.split('\n');
    //clipboard is empty and attribute is named
    return extractedConfigString === null && ( lines[index] && lines[index].match(/"(.*?)":/) || lines[index] && lines[index].trim() === '{' );
  }

  const enablePaste = (index) => {
    const lines = configString.split('\n');
    //                                     start of array                    middle of array                  end of array
    const insideArray = lines[index+1] && (lines[index].slice(-1) === '[' || lines[index+1].trim() === '{' || lines[index+1].trim() === ']');

    //if extracted segment is unnamed
    if  (extractedConfigString && extractedConfigString.split('\n') && extractedConfigString.split('\n')[0] && extractedConfigString.split('\n')[0].trim() === '{') return insideArray;

    //if extracted segment is named
    else return extractedConfigString && !insideArray;
  }



  return (
    <section className="page config-page">

      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">
            {
              [...Array(numberOfRows)].map(
                (it, index) => (
                  <div key={index} value={index}>


                    { enableCut(index) && <button className="btn btn-outline-primary btn-sm"
                                                  onClick={handleCopyClick}
                    >
                      <CopyIcon />
                    </button> }


                    { enableCut(index) && <button className="btn btn-outline-primary btn-sm"
                            onClick={handleCutClick}
                    >
                      <CutIcon/>
                    </button> }



                    { enablePaste(index) && <button className="btn btn-outline-primary btn-sm"
                      onClick={handlePasteClick}
                    >
                      <PasteIcon  />
                    </button>}

                    { enableCut(index) && <button className="btn btn-outline-danger btn-sm"
                      onClick={handleDeleteClick}
                    >
                      <TrashIcon />
                    </button> }

                    <span>{index}</span>
                  </div>
                )
              )
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
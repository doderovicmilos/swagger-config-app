import React, {useState, useRef, useEffect, useCallback} from 'react';
import {getConfig, saveConfig} from '../../api/api'
import { useParams } from "react-router-dom";
import './configPage.scss';
import CutIcon from "../../components/Icons/CutIcon";
import PasteIcon from "../../components/Icons/PasteIcon";

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

  const handleCutClick = (e) => {
    const numberOfWhiteSpacesAtLineStart = (line) => line.search(/\S|$/);
    const lines = configString.split("\n");
    const clickedLineNumber = parseInt(e.target.parentNode.getAttribute("value"));
    const clickedLine = configString.split("\n")[clickedLineNumber];
    const clickedLineEndsWith = clickedLine.slice(-1);
    let segmentString = null;
    let configStringNewValue = null;
    let segmentLength = 1;

    //line that contains attribute
    if(clickedLineEndsWith === '[' || clickedLineEndsWith === '{') {

      let endOfSegmentLineNumber = clickedLineNumber + 1;
      //finds end of segment based on indentation
      while (numberOfWhiteSpacesAtLineStart(clickedLine) !== numberOfWhiteSpacesAtLineStart(lines[endOfSegmentLineNumber])) endOfSegmentLineNumber++;
      endOfSegmentLineNumber++;

      segmentLength = endOfSegmentLineNumber - clickedLineNumber;
    }
    //extracts segment
    segmentString = lines.splice(clickedLineNumber, segmentLength).join('\n');
    //removes trailing comma from extracted segment
    if(segmentString.slice(-1)===',') segmentString = segmentString.slice(0, -1);
    //removes trailing comma after previous element if element that was removed was last
    else if(lines[clickedLineNumber-1].slice(-1)===',') lines[clickedLineNumber-1]=lines[clickedLineNumber-1].slice(0, -1);
    //joins rest of lines without extracted segment
    configStringNewValue = lines.join('\n');

    setExtractedConfigString(segmentString);
    setConfigString(configStringNewValue);
  }

  const handlePasteClick = (e) => {
    const lines = textAreaRef.current.value.split("\n");
    const clickedLineNumber = parseInt(e.target.parentNode.getAttribute("value"));
    console.log(lines[clickedLineNumber + 1].trim());
    const lineToInsert = lines[clickedLineNumber + 1].trim().charAt(0) === '}' || lines[clickedLineNumber + 1].trim().charAt(0) === ']' ? ',' + extractedConfigString : extractedConfigString + ',';
    lines.splice(clickedLineNumber + 1, 0, lineToInsert);
    const newValueString = lines.join("\n");
    setExtractedConfigString(null);

    setConfigString(newValueString);

    const newValue = JSON.parse(newValueString);
    setConfigString(JSON.stringify(newValue, undefined, 3));



  }

  //const isAttributeLine =

  const enableCut = (index) => {
    const lines = configString.split('\n');
    //clipboard is empty and attribute is named
    return extractedConfigString === null && ( lines[index] && lines[index].match(/"(.*?)":/) || lines[index] && lines[index].trim() === '{' );
  }

  const enablePaste = (index) => {
    const lines = configString.split('\n');

    const insideArray = lines[index+1] && (
      //startOfArray
      lines[index] && lines[index].slice(-1) === '[' ||
      //middle of array
      lines[index] && lines[index+1].trim() === '{' ||
      //end of array
      lines[index] && lines[index+1].trim() === ']');


    //console.log(extractedConfigString && extractedConfigString.split('\n') && extractedConfigString.split('\n')[0] && extractedConfigString.split('\n')[0]);

    //if extracted segment is unnamed
    if  (extractedConfigString && extractedConfigString.split('\n') && extractedConfigString.split('\n')[0] && extractedConfigString.split('\n')[0].trim() === '{') return insideArray;

    //if extracted segment is named
    else return extractedConfigString && !insideArray;

    //return !insideArray;



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
                    <span>{index}</span>
                    <button className="btn btn-outline-primary btn-sm"
                            onClick={handleCutClick}
                            disabled={ !enableCut(index) }
                    >
                      <CutIcon/>
                    </button>
                    <button className="btn btn-outline-primary btn-sm"
                            onClick={handlePasteClick}
                            disabled={!enablePaste(index)}
                    >

                      <PasteIcon  />
                    </button>


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
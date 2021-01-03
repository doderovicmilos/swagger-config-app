import React, {useState, useRef, useEffect, useCallback} from 'react';
import {getConfig, saveConfig} from "../../api/api";

const useConfig = (configName, configVersion) => {

  const [configString, setConfigString] = useState('');
  const [extractedConfigString, setExtractedConfigString] = useState(null);
  const [numberOfRows, setNumberOfRows] = useState(1);
  const [allowedActions, setAllowedActions] = useState([]);

  const enableCutCopy = (lines, index) => {
    //clipboard is empty and attribute is named
    return extractedConfigString === null && ( lines[index] && lines[index].match(/"(.*?)":/) || lines[index] && lines[index].trim() === '{' );
  }

  const enableDelete = (lines, index) => {
    //clipboard is empty and attribute is named
    return lines[index] && lines[index].match(/"(.*?)":/) || lines[index] && lines[index].trim() === '{' ;
  }

  const enablePaste = (lines, index) => {
    //                                     start of array                    middle of array                  end of array
    const insideArray = lines[index+1] && (lines[index].slice(-1) === '[' || lines[index+1].trim() === '{' || lines[index+1].trim() === ']');
    //if extracted segment is unnamed
    if  (extractedConfigString && extractedConfigString.split('\n') && extractedConfigString.split('\n')[0] && extractedConfigString.split('\n')[0].trim() === '{') return insideArray;
    //if extracted segment is named
    else return extractedConfigString && !insideArray;
  }

  useEffect(()=>{
    getConfig(configName, configVersion).then(response=>response.json())
      .then(response=> setConfigString(JSON.stringify(response, undefined, 3)))
      .catch(error=>console.error(error));
  }, []);

  useEffect(()=>{
    const lines = configString.split("\n")
    setNumberOfRows(lines.length);

    setAllowedActions([...Array(lines.length)].map(
      (it, index) => {
        const allowedActions  = { cut: false, copy: false, paste: false, del:false }

        allowedActions.cut = enableCutCopy(lines, index);
        allowedActions.copy = enableCutCopy(lines, index);
        allowedActions.paste = enablePaste(lines, index);
        allowedActions.del = enableDelete(lines, index);

        return allowedActions;
      }))
  }, [configString]);



  return {configString, setConfigString, extractedConfigString, setExtractedConfigString, numberOfRows, setNumberOfRows, allowedActions, setAllowedActions};
};


export default useConfig;

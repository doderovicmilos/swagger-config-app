import {useState, useEffect} from 'react';
import {getConfig} from "../../api/api";

const useConfig = (configName, configVersion) => {

  const [configString, setConfigString] = useState('');
  const [extractedConfigString, setExtractedConfigString] = useState(null);
  const [numberOfRows, setNumberOfRows] = useState(1);
  const [allowedActions, setAllowedActions] = useState([]);

  useEffect(()=>{
    getConfig(configName, configVersion).then(response=>response.json())
      .then(response=> setConfigString(JSON.stringify(response.data, undefined, 2)))
      .catch(error=>console.error(error));
  }, []);

  const enableCutCopyDelete = (lines, index) => {
    //clipboard is empty and attribute is named
    //extractedConfigString === null &&
    return lines[index] && lines[index].match(/"(.*?)":/) || lines[index] && lines[index].trim() === '{' ;
  }

  const enablePaste = (lines, index) => {
    //                                     start of array                    middle of array                  end of array
    const insideArray = lines[index+1] && (lines[index].slice(-1) === '[' || lines[index+1].trim() === '{' || lines[index+1].trim() === ']' || lines[index].match(/: \[\]/) );
    //if extracted segment is unnamed
    if  (extractedConfigString && extractedConfigString.split('\n') && extractedConfigString.split('\n')[0] && extractedConfigString.split('\n')[0].trim() === '{') return insideArray;
    //if extracted segment is named
    else return extractedConfigString && !insideArray;
  }

  useEffect(()=>{
    const lines = configString.split("\n")
    setNumberOfRows(lines.length);

    setAllowedActions([...Array(lines.length)].map(
      (it, index) => {
        const allowedActions  = { cut: false, copy: false, paste: false, del:false }

        allowedActions.cut = enableCutCopyDelete(lines, index);
        allowedActions.copy = enableCutCopyDelete(lines, index);
        allowedActions.paste = enablePaste(lines, index);
        allowedActions.del = enableCutCopyDelete(lines, index);

        return allowedActions;
      }))
  }, [configString, extractedConfigString]);



  return {configString, setConfigString, extractedConfigString, setExtractedConfigString, numberOfRows, setNumberOfRows, allowedActions, setAllowedActions};
};


export default useConfig;

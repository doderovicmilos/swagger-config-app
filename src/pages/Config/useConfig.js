import React, {useState, useRef, useEffect, useCallback} from 'react';
import {getConfig} from "../../api/api";


const useConfig = () => {

  const [configString, setConfigString] = useState('');
  const [extractedConfigString, setExtractedConfigString] = useState(null);
  const [numberOfRows, setNumberOfRows] = useState(1);


  useEffect(()=>{
    getConfig(name, version).then(response=>response.json())
      .then(response=> setConfigString(JSON.stringify(response, undefined, 3)))
      .catch(error=>console.error(error));
  }, []);

  return {configString, setConfigString, extractedConfigString, setExtractedConfigString, numberOfRows, setNumberOfRows};
};

export default useConfig;

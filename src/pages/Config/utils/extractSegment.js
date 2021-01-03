const extractSegment = (config, clickedLineNumber) => {
  const numberOfWhiteSpacesAtLineStart = (line) => line.search(/\S|$/);
  const lines = config.split("\n");
  //const clickedLineNumber = lineNumber;
  const clickedLine = config.split("\n")[clickedLineNumber];
  const clickedLineEndsWith = clickedLine.slice(-1);
  let extractedSegment = null;
  let newConfigValue = null;
  let segmentLength = 1;

  //segment start
  if(clickedLineEndsWith === '[' || clickedLineEndsWith === '{') {
    let endOfSegmentLineNumber = clickedLineNumber + 1;
    //finds end of segment based on indentation
    while (numberOfWhiteSpacesAtLineStart(clickedLine) !== numberOfWhiteSpacesAtLineStart(lines[endOfSegmentLineNumber])) endOfSegmentLineNumber++;
    endOfSegmentLineNumber++;

    segmentLength = endOfSegmentLineNumber - clickedLineNumber;
  }
  //extracts segment
  extractedSegment = lines.splice(clickedLineNumber, segmentLength).join('\n');
  //removes trailing comma from extracted segment
  if(extractedSegment.slice(-1)===',') extractedSegment = extractedSegment.slice(0, -1);
  //removes trailing comma after previous element if element that was removed was last
  else if(lines[clickedLineNumber-1].slice(-1)===',') lines[clickedLineNumber-1]=lines[clickedLineNumber-1].slice(0, -1);
  //joins rest of lines without extracted segment
  newConfigValue = lines.join('\n');

  return {extractedSegment, newConfigValue};
};

export default extractSegment;
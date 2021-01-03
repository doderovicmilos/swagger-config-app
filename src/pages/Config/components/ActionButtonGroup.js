import CopyIcon from "../../../components/Icons/CopyIcon";
import CutIcon from "../../../components/Icons/CutIcon";
import PasteIcon from "../../../components/Icons/PasteIcon";
import TrashIcon from "../../../components/Icons/TrashIcon";

const ActionButtonGroup = (props) => {
  const { index, allowedActions, handleCopyClick, handleCutClick, handlePasteClick, handleDeleteClick } = props;
  return (
    <div className="btn-group" role="group" value={index}>
      <button
        onClick={handleCopyClick}
        disabled={!allowedActions.copy}
        type="button"
        className="btn btn-outline-primary btn-sm"
      ><CopyIcon/></button>
      <button
        onClick={handleCutClick}
        disabled={!allowedActions.cut}
        type="button"
        className="btn btn-outline-primary btn-sm"
      ><CutIcon/></button>
      <button
        onClick={handlePasteClick}
        disabled={!allowedActions.paste}
        type="button"
        className="btn btn-outline-primary btn-sm"
      ><PasteIcon/></button>
      <button
        onClick={handleDeleteClick}
        disabled={!allowedActions.del}
        type="button"
        className="btn btn-outline-danger btn-sm"
      ><TrashIcon/></button>
    </div>
  );
}

export default ActionButtonGroup;
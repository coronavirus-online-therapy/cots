import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Link from '@material-ui/core/Link';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  contract: {
  }
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function AcceptTerms(props) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [read, setRead] = useState(false);
  const [accepted, setAccepted] = useState(Boolean(props.defaultValue));
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleScroll = (event) => {
    let textarea = event.nativeEvent.target;
    //console.log(`scrollTop:${textarea.scrollTop} scrollHeight:${textarea.scrollHeight} offsetTop:${textarea.offsetTop} offset:Height:${textarea.offsetHeight}`);
    if(textarea.scrollTop + textarea.offsetHeight >= textarea.scrollHeight) {
      setRead(true);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = (event, value, reason) => {
    setAccepted(true);
    if(props.onChange) {
        props.onChange(new Date());
    }
    setOpen(false);
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="{props.id}-title">{props.contractTitle}</h2>
      <TextareaAutosize cols={60} rowsMax={20} id="{props.id}-description" className={classes.contract} value={props.contract} onScroll={handleScroll}/>
      <Button onClick={handleAccept} variant="contained" color="primary" disabled={!read}>Accept</Button>
    </div>
  );
    
  return (
    <div>
      <FormControlLabel
        control={<Checkbox name={props.id} color="primary" checked={accepted} required={props.required} onClick={handleOpen}/>}
        label={<span>{props.agreementText} <Link onClick={handleOpen}>{props.contractTitle}</Link></span>}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="{props.id}-title"
        aria-describedby="{props.id}-description"
      >
        {body}
      </Modal>
    </div>
  );
}

AcceptTerms.defaultProps = {
  id: 'agreement',
  required: true,
  agreementText: 'I have read and accept the',
  contractTitle: 'Terms of Service',
  contract: '',
  defaultValue: false
}

export default AcceptTerms;

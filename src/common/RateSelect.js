import React, {useState} from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

function RateSelect(props) {
  const [rate, setRate] = useState(props.defaultValue.toString());
  const handleRateChange = event => {
      let newValue = event.target.value;
      setRate(newValue);
      if(props.onChange) {
          props.onChange(parseInt(newValue));
      }
  }
  return (                
    <FormControl component="fieldset"> 
      <FormLabel component="legend">{props.label}</FormLabel>
      <RadioGroup aria-label="rate" name="rate" value={rate} onChange={handleRateChange}>
        {rates.map((rate,i) => <FormControlLabel key={i} value={rate.value} control={<Radio required={props.required}/>} label={rate.label} disabled={props.disabled}/>)}
      </RadioGroup>
    </FormControl>
   );
}

RateSelect.defaultProps = {
  label: 'I would be willing to offer sessions:',
  required: true,
  disabled: false,
  defaultValue: ''
}

export default RateSelect;

const rates = [
  {
    label: "Pro-bono/free", 
    value: "0"
  },
  {
    label: "For $15/session", 
    value: "15"
  },
  {
    label: "For $25/session", 
    value: "25"
  },
  {
    label: "For $50/session", 
    value: "50"
  }
];

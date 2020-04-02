import React, {useState} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';

function InsuranceInput(props) {
  const [value, setValue] = useState(props.defaultValue || []);
  const [helperText, setHelperText] = useState('');

  const handleFocus = event => {
    setHelperText(props.helperText);
  }

  const handleBlur = event => {
    setHelperText('');
  }

  const handleChange = (event, value, reason) => {
    if(props.max > 0 && value.length > props.max) {
      event.preventDefault()
      return;
    }
    if(props.onChange) {
        props.onChange(event, value, reason);
    }
    setValue(value);
  }
  return(<Autocomplete
            name={props.name}
            required={props.required}
            disabled={props.disabled}
            autoComplete={false}
            multiple
            onChange={handleChange}
            id={props.id}
            options={topInsurances}
            value={value}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant={props.variant} label={props.label} placeholder="" helperText={helperText} onFocus={handleFocus} onBlur={handleBlur}/>
            )}
      />);
}

InsuranceInput.defaultProps = {
  id: 'insurance',
  label: 'Accepted Insurance',
  variant: 'outlined',
  required: false,
  disabled: false,
  defaultValue: [],
  max: 0,
  helperText: 'Optional: Select the insurance plans that you accept. Type in unlisted plans to add.'
}

const topInsurances = [
  'Aetna',
  'BCBS',
  'Beacon',
  'Cigna',
  'Highmark',
  'Humana',
  'Kaiser',
  'Magellan',
  'Medicaid',
  'Medicare',
  'Optum',
  'Oxford',
  'Premera',
  'Regence',
  'Tricare',
  'United'
]


export default InsuranceInput;

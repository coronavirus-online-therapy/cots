import React, {useState} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

function LicenseTypeInput(props) {
  const [value, setValue] = useState(props.defaultValue);
  const [helperText, setHelperText] = useState('');

  const handleFocus = event => {
    setHelperText(props.helperText);
  }

  const handleBlur = event => {
    setHelperText('');
  }

  const handleChange = (event, value, reason) => {
    if(props.onChange) {
        props.onChange(event, value, reason);
    }
    setValue(value);
  }
  return(<Autocomplete
            name={props.name}
            required={props.required}
            disabled={props.disabled}
            onChange={handleChange}
            id={props.id}
            options={topLicenseTypes}
            value={value}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} variant={props.variant} label={props.label} placeholder="" required={props.required} helperText={helperText} onFocus={handleFocus} onBlur={handleBlur}/>
            )}
      />);
}

LicenseTypeInput.defaultProps = {
  id: 'therapyLicType',
  label: 'License Type',
  variant: 'outlined',
  required: true,
  disabled: false,
  defaultValue: '',
  helperText: 'Specify the type of license that you hold.'
}

const topLicenseTypes = [
  'LCSW',
  'LMSW',
  'LMHC',
  'PH.D',
  'LMFT'
]


export default LicenseTypeInput;

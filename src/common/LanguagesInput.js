import React, {useState} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';

function LanguagesInput(props) {
  const [value, setValue] = useState(props.defaultValue || []) ;
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
            options={topLanguages}
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

LanguagesInput.defaultProps = {
  id: 'languages',
  label: 'Languages Spoken',
  variant: 'outlined',
  required: false,
  disabled: false,
  defaultValue: [],
  helperText: 'Specify the top 3 languages that you speak.',
  max: 0
}

const topLanguages = [
  'English',
  'Spanish',
  'Chinese',
  'French',
  'Tagalog',
  'Vietnamese',
  'Korean',
  'German',
  'Arabic',
  'Russian'
]


export default LanguagesInput;

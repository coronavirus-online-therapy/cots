import React, {useState} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';

function ModalityInput(props) {
  const [value, setValue] = useState(props.defaultValue || []);
  const [helperText, setHelperText] = useState(props.helperText);

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
            autoSelect={true}
            required={props.required}
            disabled={props.disabled}
            autoComplete={false}
            multiple
            onChange={handleChange}
            id={props.id}
            options={topModalities}
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

ModalityInput.defaultProps = {
  id: 'modality',
  label: 'Types of therapy',
  helperText: 'Optional: Choose up to 3 of your top types of therapy.',
  variant: 'outlined',
  required: false,
  disabled: false,
  defaultValue: [],
  max: 0
}

export default ModalityInput;

const topModalities = [
  'AEDP',
  'Acceptance and Commitment (ACT)',
  'Applied Behavioral Analysis',
  'Art Therapy',
  'Attachment-based',
  'Brainspotting',
  'Cognitive Behavioral (CBT)',
  'Dialectical (DBT)',
  'EMDR',
  'Eclectic',
  'Emotionally Focused',
  'Exposure Response Prevention',
  'Family / Marital',
  'Family Systems',
  'Forensic Psychology',
  'Gestalt',
  'Hypnotherapy',
  'Imago',
  'Internal Family Systems (IFS)',
  'Interpersonal',
  'Jungian',
  'Mindfulness-Based (MBCT)',
  'Parent-Child Interaction (PCIT)',
  'Psychoanalytic',
  'Psychodynamic',
  'Rational Emotive Behavior (REBT)',
  'Relational',
  'Solution Focused Brief (SFBT)',
  'Somatic',
  'Trauma Focused'
  ]

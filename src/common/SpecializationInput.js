import React, {useState} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';

function SpecializationInput(props) {
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
            options={topSpecializations}
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

SpecializationInput.defaultProps = {
  id: 'specialization',
  label: 'Specializations',
  helperText: 'Optional: Choose up to 3 of your top specializations.',
  variant: 'outlined',
  required: false,
  disabled: false,
  defaultValue: [],
  max: 0
}

export default SpecializationInput;

const topSpecializations = [
  'ADHD',
  'Addiction/Alcohol & Use',
  'Anger Management',
  'Anxiety',
  'Asperger\'s/Autism',
  'Behavioral Issues',
  'Bipolar Disorder',
  'Borderline Personality',
  'Child or Adolescent',
  'Chronic Illness',
  'Codependency',
  'Couple\'s Therapy',
  'Depression',
  'Domestic Abuse/Violence',
  'Eating Disorders',
  'Grief , Loss & Bereavement',
  'Men\'s Issues',
  'Obsessive-Compulsive (OCD)',
  'Pregnancy, Prenatal, Postpartum',
  'Relationship Issues',
  'Self-Harming',
  'Sexual Abuse',
  'Sleep or Insomnia',
  'Spirituality',
  'Stress',
  'Transgender',
  'Trauma and PTSD',
  'Women\'s Issues'
]

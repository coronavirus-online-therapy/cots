
import React, {useState} from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(0),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));


function GenderSelect(props) {
    const classes = useStyles();
    const [gender, setGender] = useState(props.defaultValue);
    const [helperText, setHelperText] = useState(props.helperText);

    const handleFocus = event => {
        setHelperText(props.helperText);
    }

    const handleBlur = event => {
        setHelperText('');
    }

    const handleStateChange = event => {
        let newValue = event.target.value;
        setGender(newValue);
        if(props.onChange) {
            props.onChange(newValue);
        }
    }
    return (
        <FormControl fullWidth variant={props.variant} className={props.className || classes.formControl} required={props.required}>
            <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
            <Select
                native
                disabled={props.disabled}
                value={gender===null?undefined:gender}
                required={props.required}
                label={props.label}
                onChange={handleStateChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                inputProps={{
                    name: 'gender',
                    id: props.id,
                }}
            >
                <option value="" />
                {genders.map(gender => <option key={gender.value} value={gender.value}>{gender.label}</option>)}
            </Select>
            <FormHelperText disabled={props.disabled}>{helperText}</FormHelperText>
        </FormControl>
    );
}

GenderSelect.defaultProps = {
    id: 'gender-select',
    label: 'Gender Identification',
    variant: 'outlined',
    required: false,
    disabled: false,
    className: '',
    defaultValue: '',
    helperText: 'Optional: Select your gender identification'
}

const genders = [
    {
        "label": "Agender",
        "value": "AGENDER",
    },
    {
        "label": "Cisgender",
        "value": "CISGENDER",
    },
    {
        "label": "Gender Fluid",
        "value": "GENDER_FLUID",
    },
  {
      "label": "Male",
      "value": "MALE",
  },
  {
      "label": "Female",
      "value": "FEMALE",
  },
  {
      "label": "Non-binary",
      "value": "NON_BINARY",
  },
  {
      "label": "Genderqueer",
      "value": "GENDER_QUEER"
  },
  {
    "label": "Intersex",
    "value": "INTERSEX",
  },
  {
    "label": "Transgender",
    "value": "TRANSGENDER",
  },
  {
    "label": "Two-spirit",
    "value": "TWO_SPIRIT",
  },
];

export default GenderSelect;

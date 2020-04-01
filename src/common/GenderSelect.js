
import React, {useState} from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
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
                value={gender}
                required
                label={props.label}
                onChange={handleStateChange}
                inputProps={{
                    name: 'gender',
                    id: props.id,
                }}
            >
                <option value="" />
                {genders.map(gender => <option key={gender.value} value={gender.value}>{gender.label}</option>)}
            </Select>
        </FormControl>
    );
}

GenderSelect.defaultProps = {
    id: 'gender-select',
    label: 'Gender',
    variant: 'outlined',
    required: true,
    disabled: false,
    className: '',
    defaultValue: ''
}

const genders = [
  {
      "label": "Male",
      "value": "MALE",
  },
  {
      "label": "Female",
      "value": "FEMALE",
  },
  {
      "label": "Non-binary/Transgender",
      "value": "NON_BINARY",
  }
];

export default GenderSelect;

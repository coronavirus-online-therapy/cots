
import React, {useState} from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import States from './States';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(0),
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));


function StateSelect(props) {
    const classes = useStyles();
    const [state, setState] = useState(props.defaultValue);
    const [helperText, setHelperText] = useState(props.helperText);

    const handleFocus = event => {
        setHelperText(props.helperText);
    }

    const handleBlur = event => {
        setHelperText('');
    }

    const handleStateChange = event => {
        let newValue = event.target.value;
        setState(newValue);
        if(props.onChange) {
            props.onChange(newValue);
        }
    }
    return (
        <FormControl variant={props.variant} className={props.className || classes.formControl} required={props.required} fullWidth>
            <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
            <Select
                native
                disabled={props.disabled}
                value={state}
                required
                label={props.label}
                onChange={handleStateChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                inputProps={{
                    name: 'state',
                    id: props.id,
                }}
            >
                <option value="" />
                {States.map(state => <option key={state.Code} value={state.Code}>{state.State}</option>)}
            </Select>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    );
}

StateSelect.defaultProps = {
    id: 'state-select',
    label: 'State',
    variant: 'outlined',
    required: true,
    disabled: false,
    className: '',
    defaultValue: '',
    helperText: 'Select the state you are located in'
}

export default StateSelect;

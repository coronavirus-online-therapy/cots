
import React, {useState} from 'react';
import MaterialTable from "material-table";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import VerifiedIcon from '@material-ui/icons/VerifiedUser';
import UnverifiedIcon from '@material-ui/icons/NotInterested';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Tooltip from '@material-ui/core/Tooltip';
import { red, green } from '@material-ui/core/colors';

import States from './States';

function AccessPoints(props) {
  const [value, setValue] = useState(props.defaultValue.map(p => {return {licState: p.state, licNum: p.license, licVerified: p.verified === true, licExpiration: p.licenseExpiration}}));
  const [error, setError] = useState("");

  const validate = (data) => {
      let err = [];
      if(!data.licState) {
          err.push("State is required.");
      }
      if(!data.licNum) {
          err.push("License # is required.");
      }
      if(!data.licExpiration) {
          err.push("License Expiration is required.");
      }
      if(err.length > 0) {
          setError(err);
          throw new Error(err);
      }
  };

  const handleAdd = async (newData) => {
      validate(newData);    
      setError("");
      const newValue = [...value, newData]; 
      setValue(newValue);
      if(props.onAdd) {
        props.onAdd({
            state: newData.licState,
            license: newData.licNum,
            licenseExpiration: newData.licExpiration,
            verified: props.statusEditable?newData.licVerified:undefined,
        });
      }
  };
  const handleUpdate = async (newData, oldData) => {
      if(oldData) {
        validate(newData);
        setError("");
        const newValue = [...value]; 
        newValue[newValue.indexOf(oldData)] = newData;
        setValue(newValue);
        if(props.onUpdate) {
            props.onUpdate({
                state: newData.licState,
                license: newData.licNum,
                licenseExpiration: newData.licExpiration,
                verified: props.statusEditable?newData.licVerified:undefined,
            });
        }
      }
  };
  const handleDelete = async (oldData) => {
    const newValue = [...value]; 
    setError("");
    newValue.splice(newValue.indexOf(oldData), 1);
    setValue(newValue);
    if(props.onDelete) {
        props.onDelete({
            state: oldData.licState
        });
    }
  };
  const stateLookup = States.reduce((map, state) => {
      map[state.Code] = state.State;
      return map;
  }, {});

  return( 
    <FormControl fullWidth>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <MaterialTable
                disabled={props.disabled}
                columns={[
                    { title: "State", field: "licState", lookup: stateLookup, editable: 'onAdd' },
                    { title: "License #", field: "licNum" },
                    { title: "License Expiration", 
                      field: "licExpiration", 
                      width: 300,
                      editComponent: props => {
                        return (<KeyboardDatePicker
                                    disableToolbar
                                    autoOk
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    value={props.value===undefined?null:props.value}
                                    onChange={(e) => { 
                                        props.onChange(e.toLocaleDateString())}
                                    }
                                    label=""
                                />);
                      },
                    },
                    { 
                        title: "Status", 
                        field: "licVerified", 
                        editComponent: props => (<Checkbox checked={props.value===true} onClick={(e) => { props.onChange(e.target.checked) }}/>),
                        render: props => {
                            if(props !== undefined && props.licVerified===true) {
                                return (<Tooltip title="Verified"><VerifiedIcon style={{ color: green[500] }}/></Tooltip>);
                            } else {
                                return (<Tooltip title="Unverified"><UnverifiedIcon style={{ color: red[500] }}/></Tooltip>);
                            }
                        },
                        editable: props.statusEditable?'always':'never', 
                    }
                ]}
                data={value}
                options={{
                    paging: false,
                    search: false,
                    actionsColumnIndex: 4
                }}
                editable={props.disabled?{}:{
                    onRowAdd: handleAdd,
                    onRowUpdate: handleUpdate,
                    onRowDelete: handleDelete,
                }}
                title={props.label}
            />
            <FormHelperText error>{error}</FormHelperText>
        </MuiPickersUtilsProvider>
    </FormControl>);
}

AccessPoints.defaultProps = {
    id: 'access-points',
    label: 'Licensed States',
    variant: 'outlined',
    disabled: false,
    defaultValue: [],
    statusEditable: false,
}

export default AccessPoints;


import React, {useState} from 'react';
import MaterialTable from "material-table";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import States from './States';

function AccessPoints(props) {
  const [value, setValue] = useState(props.defaultValue);
  const [error, setError] = useState("");

  const validate = (data) => {
      let err = [];
      if(!data.licState) {
          err.push("State is required.");
      }
      if(!data.licNum) {
          err.push("License # is required.");
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
      if(props.onChange) {
        props.onChange(newValue);
      }
  };
  const handleUpdate = async (newData, oldData) => {
      if(oldData) {
        validate(newData);
        setError("");
        const newValue = [...value]; 
        newValue[newValue.indexOf(oldData)] = newData;
        setValue(newValue);
        if(props.onChange) {
            props.onChange(newValue);
        }
      }
  };
  const handleDelete = async (oldData) => {
    const newValue = [...value]; 
    setError("");
    newValue.splice(newValue.indexOf(oldData), 1);
    setValue(newValue);
    if(props.onChange) {
        props.onChange(newValue);
    }
  };
  const stateLookup = States.reduce((map, state) => {
      map[state.Code] = state.State;
      return map;
  }, {});

  return( 
    <FormControl fullWidth>
        <MaterialTable
            columns={[
                { title: "State", field: "licState", lookup: stateLookup },
                { title: "License #", field: "licNum" }
            ]}
            data={value}
            options={{
                paging: false,
                search: false,
                actionsColumnIndex: 2
            }}
            editable={{
                onRowAdd: handleAdd,
                onRowUpdate: handleUpdate,
                onRowDelete: handleDelete,
            }}
            title={props.label}
        />
        <FormHelperText error>{error}</FormHelperText>
    </FormControl>
    );
}

AccessPoints.defaultProps = {
    id: 'access-points',
    label: 'Licensed States',
    variant: 'outlined',
    disabled: false,
    defaultValue: []
}

export default AccessPoints;

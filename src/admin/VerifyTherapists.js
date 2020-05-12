import React from 'react';
import MaterialTable from "material-table";
import StateSelect from '../common/StateSelect';
import ProviderProfile from '../providers/Profile';
import { API, graphqlOperation } from "aws-amplify";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  stateSelect: {
    maxWidth: '50%'
  }
}));

class UnverifiedAccessPointsPager {
  constructor(state) {
    this.pageSize = 5;
    this.state = state;
    this.reset();
  }

  reset() {
    this.nextPage = 0;
    this.nextPageToken = null;
    this.data = [];
  }

  async ensurePageLoaded(pageNum) {
    if(pageNum !== this.nextPage) {
      return;
    }

    let limit = this.pageSize+1;
    let nextToken = this.nextPageToken;
    let state = this.state;
    if(state === null || state === "") {
      state = undefined
    }

    let found = 0;
    while (found < this.pageSize) {
      let { data: {listAccessPoints}} = await API.graphql(graphqlOperation(getUnverifiedAccessPointsQuery, {limit, nextToken, state})).catch(e => e);
      const data = listAccessPoints.items.map(item => ({
        ...item.provider,
        owner: item.owner,
        state: item.state,
        license: item.license,
      }));
      found += data.length;
      this.data.push(...data);

      if(listAccessPoints.nextToken !== null) {
        if(found < this.pageSize) {
          nextToken = listAccessPoints.nextToken;
        } else {
          this.nextPage = pageNum + 1;
          this.nextPageToken = listAccessPoints.nextToken;
          break;
        }
      } else {
        break;
      }
    }
  }
}

function VerifyTherapists() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [state, setState] = React.useState();
  const [pager, setPager] = React.useState(new UnverifiedAccessPointsPager(state));

  React.useEffect(() => {
    if(state !== pager.state) {
      setPager(new UnverifiedAccessPointsPager(state));
    }
  }, [state, setPager, pager.state]);

  React.useEffect(() => {
    const doLoad = async () => {
      setLoading(true);
      await pager.ensurePageLoaded(page)
      setPage(0);
      setData(pager.data);
      setLoading(false);
    }
    doLoad();
  }, [pager, page, setData]);

  const verifyAccessPoint = async (event, rowData) => {
    setLoading(true);
    for (let row of rowData) {
      const resp = await API.graphql(graphqlOperation(verifyAccessPointMutation, {owner: row.owner, state: row.state}));
      console.log(resp);
    }
    setLoading(false);
    setPager(new UnverifiedAccessPointsPager(state));
  }
  return (
    <div>
      <StateSelect defaultValue={state} onChange={setState} className={classes.stateSelect} helperText=""/>
      <MaterialTable
          columns={[
              { title: "Name", field: "fullName", sorting: false },
              { title: "State", field: "state", sorting: false },
              { title: "License Type", field: "licenseType", sorting: false },
              { title: "License #", field: "license", sorting: false },
              { title: "Email", field: "email", sorting: false },
          ]}
          data={data}
          isLoading={loading}
          initialPage={page}
          actions={[
            {
              icon: 'verified_user',
              tooltip: 'Verify User',
              onClick: verifyAccessPoint,
            }
          ]}
          options={{
              selection: true,
              paging: true,
              pageSize: pager.pageSize,
              pageSizeOptions: [pager.pageSize],
              search: false,
              showSelectAllCheckbox: false,
          }}
          localization={{
            pagination: {
              labelDisplayedRows: "{from}-{to}"
            } 
          }}
          title='Unverified Therapists'
          onChangePage={setPage}
          detailPanel={rowData => {
            return (<ProviderProfile providerId={rowData.owner}/>);
          }}
      />
    </div>
  );
}

export default VerifyTherapists;

const getUnverifiedAccessPointsQuery = /* GraphQL */ `
  query GetUnverifiedAccessPoints($limit: Int, $nextToken: String, $state: String) {
  listAccessPoints(filter: {verified: {ne: true}, state: {eq: $state}}, limit: $limit, nextToken: $nextToken) {
    items {
      license
      provider {
        fullName
        email
        phone
        liabilityPolicy
        licenseType
        url
      }
      state
      verified
      owner
    }
    nextToken
  }
}
`;

export const verifyAccessPointMutation = /* GraphQL */ `
  mutation VerifyAccessPoint(
    $state: String!
    $owner: String!
  ) {
    updateAccessPoint(input: {state: $state, owner: $owner, verified: true}) {
      verified
    }
  }
`;

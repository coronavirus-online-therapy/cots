import React from 'react';
import MaterialTable from "material-table";
import { API, graphqlOperation } from "aws-amplify";

function Stats() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const doLoad = async () => {
      setLoading(true);
      const byState = {};
      let nextToken = null;
      while(true) {
        let { data: {listAccessPoints}} = await API.graphql(graphqlOperation(apStatesQuery, {limit: 100, nextToken}));
        for(let item of listAccessPoints.items) {
          if(byState[item.state] === undefined) {
            byState[item.state] = {
              count: 0,
              verifiedCount: 0,
              unverifiedCount: 0,
            }
          }
          byState[item.state].count++;
          if(item.verified) {
            byState[item.state].verifiedCount++;
          } else {
            byState[item.state].unverifiedCount++;
          }
        }
        if(listAccessPoints.nextToken === null) {
          break;
        } 
        nextToken = listAccessPoints.nextToken;
      }
      const d = Object.entries(byState).map(([key, value]) => ({...value, state: key}));
      setData(d);
      setLoading(false);
    }
    doLoad();
  }, [setLoading, setData]);

  return (
    <MaterialTable
      columns={[
          { title: "State", field: "state"},
          { title: "# Verified", field: "verifiedCount"},
          { title: "# Unverified", field: "unverifiedCount"},
          { title: "# Total", field: "count"},
      ]}
      data={data}
      isLoading={loading}
      options={{
          paging: false,
          search: true,
      }}
      title='Therapists by State'
    />
  );
}

export default Stats;

const apStatesQuery = /* GraphQL */ `
  query AccessPointStates($limit: Int, $nextToken: String) {
  listAccessPoints(limit: $limit, nextToken: $nextToken) {
    items {
      state
      verified
    }
    nextToken
  }
}
`;

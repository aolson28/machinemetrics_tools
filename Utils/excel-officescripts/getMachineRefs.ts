async function main(workbook: ExcelScript.Workbook, apiKey: string) { 
  const endpointUrl = 'https://api.machinemetrics.com/graphql';
  const sheet = workbook.getActiveWorksheet();
  async function getMachineRefs() {
    let res: [] = [];
    const machineQuery = `query MyQuery {
      machines(where: {decommissionedAt: {_is_null: true}}) {
        name
        machineRef        
      }
    }`;
    const machinesBody = {
      query: machineQuery
    };
    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(machinesBody)
      });
      const json: {} = await response.json();
      console.log(json);
      json.data.machines.map((item) => {
        res.push(Object.values(item));
      });
    } catch (err) {
      console.log(err);
    }
    return res;
  }

  const data = await getMachineRefs();
  sheet.getCell(0,0).setValue("name");
  sheet.getCell(0,1).setValue("machineRef");
  sheet.getRangeByIndexes(1, 0, data.length, data[0].length).setValues(data);  
}

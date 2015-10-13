import fs from 'fs'

import generate from './generate'

/*['TestBoundary', 'TestBuffer', 'TestCentroid',
'TestConvexHull', 'TestEqualsExact', 'TestFunctionAA', 'TestFunctionLA',
'TestFunctionLL', 'TestFunctionPA', 'TestFunctionPL', 'TestFunctionPP',
'TestRelateAA', 'TestRelateAC', 'TestRelateLA', 'TestRelateLC',
'TestRelateLL', 'TestRelatePA', 'TestRelatePL', 'TestRelatePP', 'TestSimple']*/
['TestBuffer']
.forEach(xml => {
  const fileName = 'testxml/general/' + xml + '.xml';
  const data = fs.readFileSync(fileName, { encoding: "utf8" });
  generate(data, xml);
});


function NameFilter_FullRpt() { 
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues().slice(1);  
  var selectedName = sheet.getSelection().getActiveRange().getValue().toLowerCase();
  _init(sheet.getDataRange().getValues());
  
  var filterData =  data.filter(function(el) {
    return el[0].toLowerCase() == selectedName;
  });
  _fullRptSave(_nameFilterWork(filterData),selectedName+"_FullReport");
}
function _nameConvention(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function NameFilter_MiniRpt() {
  var sheet = SpreadsheetApp.getActiveSheet();
  _init(sheet.getDataRange().getValues());
  
  var data = sheet.getDataRange().getValues().slice(1);  
  var selectedName = sheet.getSelection().getActiveRange().getValue().toString();

  var filterData =  data.filter(function(el) {
    return el[0].toLowerCase() == selectedName.toLowerCase();
  });
  _miniRptSave(_miniRptWork(_nameFilterWork(filterData)), selectedName+"_MiniReport");
}

function _nameFilterWork(compiledData) {  
  var oneRecord = '';
  var row = [];
  var stage;

  compiledData.forEach(function(el, colI) {
    for (var i in el) {
      if (FIELDS[i] == 'STAGE') {
        stage = el[i];           
        row.push(FIELDS[i] + ": "+el[i]); 
      }
      else {          
        oneRecord += FIELDS[i] + ": "+el[i] + '\n';
        row.push(FIELDS[i] + ": "+el[i]);          
      }
    }
    if (stage) {
      if (stageSorted.hasOwnProperty(_stageAbr(stage))) {        
        stageSorted[_stageAbr(stage)].push(row);
        oneRecord = '\n';
        row = [];
      }
      else {
        SpreadsheetApp.getUi().alert('Invalide stage type: '+stage+"\ncheck record,\n"+el);        
      }
    }
  });
//  Logger.log(stageSorted);
  return stageSorted;
}
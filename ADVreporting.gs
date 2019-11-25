function ADVreport() {  
  var spreadSheetsInA = SpreadsheetApp.openByUrl(spreadSheetAURL)
  var sheet = spreadSheetsInA.getSheetByName(REPORT_TYPES["active"]);
  var data = sheet.getDataRange().getValues();
  var stageAndBuffer = {stage: '', text: title};
  
  var stageSortedData = _fullReportWorkADV(data, stageAndBuffer);
  delete stageSortedData.CONTACT;
  delete stageSortedData["Long term"];
  
  
  var title = "📄"+ info + " FRUIT REPORT: " + SCJ_newDate() + '\n\r';
  var text = _compileAllFieldsToText(stageSortedData, title, stageAndBuffer);
  
//  Logger.log(text);
  _saveAsText(text, "ADVreport");
}

function _fullReportWorkADV(rawData, stageAndBuffer) {
  var oneRecord = '';
  var row = [];
  _init(rawData);
  var pureData = rawData.slice(1);
  
  pureData.forEach(function(el, colI) {
    for (var i in el) {      
      if (FIELDS[i] == 'STAGE') {
//        Logger.log(el[i]);
        stageAndBuffer.stage = el[i];
//        Logger.log(stageAndBuffer);
        oneRecord += FIELDS[i] + ": "+el[i] + '\n';
        row.push(FIELDS[i] + ": "+el[i]);        
      }      
      else {            
        oneRecord += FIELDS[i] + ": "+el[i] + '\n';
        row.push(FIELDS[i] + ": "+el[i]);
      }
    }
    if (stageAndBuffer.stage) {
//      Logger.log(stageAndBuffer);
      if (stageSorted.hasOwnProperty(_stageAbr(stageAndBuffer.stage))) {        
        stageSorted[_stageAbr(stageAndBuffer.stage)].push(row);
        oneRecord = '\n';
        row = [];
      }
      else {
        SpreadsheetApp.getUi().alert('Invalide stage type: '+stageAndBuffer.stage+"\ncheck record,\n"+el+'\nValid Stages: CT, BT, PP, BB, LT');
      }
    }
  });
  return stageSorted;          
}

function _compileAllFieldsToText(compiledData, title, stageAndBuffer) {
  stageAndBuffer.text = title;  
  Object.keys(compiledData).forEach(function(stage) {
    stageAndBuffer.stage = stage;
    stageAndBuffer.text += stageAndBuffer.stage  + ": " + compiledData[stage].length +'\n\r';
    if (compiledData[stageAndBuffer.stage].length == 0 ) stageAndBuffer.text += '_ \n\r';
    else {
      compiledData[stage].forEach(function(item) {
        for (var i=0; i<item.length; i++) {
          if (item[i].substring(0, item[i].indexOf(':')) == FIELD_OB["CELL MEMBER"]) {
            stageAndBuffer.text += item[i].substring(item[i].indexOf(':')+2) + '\n';            
          }
          else if (item[i].substring(0, item[i].indexOf(':')) != "STAGE") {            
            dataForStage(item[i].substring(0, item[i].indexOf(':')), item[i], stageAndBuffer);
            
          }         
        }
//        Logger.log("SPACE");
       stageAndBuffer.text += '\n';        
      });
    }
    stageAndBuffer.text += '\n\r\n\r';
  });
  return stageAndBuffer.text;
}

function dataForStage(field, record, stageAndBuffer) {
  switch (stageAndBuffer.stage) {
    case "BB": stageAndBuffer.text += record + '\n'; //Logger.log(record); //Logger.log('BB');
    break;
    default:
      if (field != FIELD_OB["BB TEACHER"] && field != FIELD_OB["MEETING DAYS/TIMES"]) {       
        stageAndBuffer.text += record + '\n';
      }
  }  
}


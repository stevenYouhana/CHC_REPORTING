
var count = 0;
var records = [];

function _purifyRecord(rawRecord) {
  return rawRecord.substr(rawRecord.indexOf(':')+2);
}

function _formatMiniRep(field, rawRecord, textOb) {
  
  var record = _purifyRecord(rawRecord);
  var temp;
  var stage = null;
  var prevStage;
  if (!stage) {
    stage, prevStage = textOb.stage;
  }
  else {
    if (stage != textOb.stage) {
      stage = textOb.stage;
    }    
  }
  
  switch(field) {
     case FIELD_OB["CELL MEMBER"]:
      textOb.text += " (" + record + "): ";
      break;
    case FIELD_OB["FRUIT"]:
      if (stage != prevStage) {
        temp = textOb.text.split('');
        temp.unshift('\n'+prevStage.toUpperCase() + '\n' + '🍏'+record);
        textOb.text = temp.join('');        
        textOb.stage = null;
      }
      else {
        temp = textOb.text.split('');
        temp.unshift('🍏'+record);
        textOb.text = temp.join(''); 
      }
    break;
    case FIELD_OB["PROBLEM"]:      
      if (record && /[a-zA-Z0-9]/.test(record)) textOb.text += record + '.\n';
    break;
    case FIELD_OB["PLAN"]:      
      textOb.text += record;
      break;      
    case FIELD_OB["LAST UPDATE"]:      
      textOb.text += ' (LAST UPDATE: ' + record + ')\n';
      records.push(textOb.text);
      textOb.text = '';
      break;
  }
  prevStage = stage;
}

function _miniRptWork(compiledData) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  _init(data);
  
  var textOb = {text: '', stage: null};
  var finalText = '';
  Object.keys(compiledData).forEach(function(stageData, l) {       
    textOb.stage = stageData + ' (' + compiledData[stageData].length + '): ';
    compiledData[stageData].forEach(function(recordData, i) {      
      recordData.forEach(function(rawRecord, fldI) {        
        _formatMiniRep(FIELDS[fldI], rawRecord, textOb);        
      });
    });
  });
  return records;
}

function miniReport() {
  _miniRptSave(_miniRptWork(_fullReportWork()), "MiniReport", null);
}

function _miniRptSave(arr, file, name) {
  var totalText;
  Logger.log('name: '+name)
  if (name) totalText = '🧾 FRUIT SUMMARY (' + name + '): ' + SCJ_newDate() +'\n';  
  else totalText = '🧾 FRUIT SUMMARY '+SCJ_newDate() +'\n';
  arr.forEach(function(el) {    
    totalText += el;
  });
  _saveAsText(totalText, file);
}
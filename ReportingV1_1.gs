var FIELDS = [];
var FIELD_OB = {};

function _init(activeCells) {
  
  FIELDS = activeCells[0].map(function(el) {
    return el.toString();
  });  
  for (var i=0; i<FIELDS.length; i++) {
    FIELD_OB[FIELDS[i]] = FIELDS[i];
  } 
}

var stageSorted = {
  "CONTACT": [], 
  "BUCKET": [],
  "PROSPECT": [], 
  "Ready for BB": [],
  "BB": [],
  "Long term": []
};

function _stageAbr(abr) {
  switch (abr.toUpperCase()) {
    case 'CT': return 'CONTACT';
    case 'BT': return 'BUCKET';
    case 'PP': return 'PROSPECT';
    case 'BB': return 'BB';
    case 'R4BB' : return 'Ready for BB';
    case 'LT' : return 'Long term';
    default: return 'invalid stage type, check stage!';
  }
}

function _saveAsText(text, fileName) {  
  DriveApp.createFile(fileName+'_'+new Date(), text,  MimeType.PLAIN_TEXT);
}

function formatDate(date) {
  return Utilities.formatDate(date, "GMT+24", "MM/dd/yyyy");  
}

function _fullReportWork() {
  var oneRecord = '';
  var row = [];
  var sheet = SpreadsheetApp.getActiveSheet();
  _init(sheet.getDataRange().getValues());
  var data = sheet.getDataRange().getValues().slice(1);
  var stage;
  
  data.forEach(function(el, colI) {
    for (var i in el) {
      if (FIELDS[i] == 'STAGE') {        
        stage = el[i];
        oneRecord += FIELDS[i] + ": "+el[i] + '\n';
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
        SpreadsheetApp.getUi().alert('Invalide stage type: '+stage+"\ncheck record,\n"+el+'\nValid Stages: CT, BT, PP, BB, R4BB, LT');
      }
    }
  });
  return stageSorted;          
}

function _fullRptSave(compiledData, file) {
  var text = '📄FRUIT REPORT: ' + SCJ_newDate() + '\n\r'; 
  Object.keys(compiledData).forEach(function(stage) {
    text += stage  + ": " + compiledData[stage].length +'\n\r';
    if (compiledData[stage].length == 0 ) text += '_ \n\r';
    else {
      compiledData[stage].forEach(function(item) {
        for (var i=0; i<item.length; i++) {
          if (item[i].substring(0, item[i].indexOf(':')) == FIELD_OB["CELL MEMBER"]) {
            text += item[i].substring(item[i].indexOf(':')+2) + '\n';
          }
          else if (item[i].substring(0, item[i].indexOf(':')) != "STAGE") text += item[i] + '\n';
        }
        text += '\n';        
      });
    }
    text += '\n\r\n\r';
  });
//  Logger.log(text);
  _saveAsText(text, file);
}

function fullReport() {
  _fullRptSave(_fullReportWork(), "FullReport");
}



/*
"Ready for BB": [], REMOVED
added _compileAllFieldsToText
added new served file "ADVreportin" for ADV reporting
*/
var FIELDS = [];
var FIELD_OB = {};
var allsheets = [];
var REPORT_TYPES = {
  active: "Active Fruits",
  centre: "CTR",
  longterm: "Dropped/LT",
  due_for_update: "Due"
};
var stageSorted = {
  "CONTACT": [], 
  "BUCKET": [],
  "PROSPECT": [],
  "BB": [],
  "Long term": []
};

 
function _init(activeCells) {  
  FIELDS = activeCells[0].map(function(el) {
    
    return el.toString();
  });
  var i;
  for (i=0; i<FIELDS.length; i++) {
    FIELD_OB[FIELDS[i]] = FIELDS[i];
  } 
}
function _nameConvention(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

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
  DriveApp.createFile(_nameConvention(fileName) + '_' + new Date(), text,  MimeType.PLAIN_TEXT);
}

function formatDate(date) {
  return Utilities.formatDate(date, "GMT+24", "MM/dd/yyyy");  
}

function _fullReportWork(rawData) {
  var oneRecord = '';
  var row = [];
  _init(rawData);
  var pureData = rawData.slice(1);
  var stage;  
  pureData.forEach(function(el, colI) {
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
        SpreadsheetApp.getUi().alert('Invalide stage type: '+stage+"\ncheck record,\n"+el+'\nValid Stages: CT, BT, PP, BB, LT');
      }
    }
  }); 
  return stageSorted;          
}


function _fullRptSave(compiledData, file) {
  var title = '📄FRUIT REPORT: ' + SCJ_newDate() + '\n\r'; 
  _compileAllFieldsToText(compiledData, title);
  _saveAsText(text, file);
}

function fullReport() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  _fullRptSave(_fullReportWork(data), "FullReport");
}



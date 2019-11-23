
function _fiveDayAgoDate() {
  return SCJ_newDate() - 5;
}

function OverDue_RPT() {
  var spreadSheetAURL = "https://docs.google.com/spreadsheets/d/1rc_iBfXCL-sFVaaCqOyJwB1NosCl47EpFiab_nev42c/edit#gid=545305235";   
  var spreadSheetsInA = SpreadsheetApp.openByUrl(spreadSheetAURL)
  var data = spreadSheetsInA.getSheetByName(REPORT_TYPES["active"])
    .getDataRange().getValues();
  _init(data);
  
  var lastupdateIndex = FIELDS.indexOf("LAST UPDATE");
  
  var filterData =  data.filter(function(el) {
//    Logger.log(el);
    return el[lastupdateIndex] <= _fiveDayAgoDate();
  });
  filterData.unshift(data[0])
//  Logger.log(filterData);
   _miniRptSave(_miniRptWork(_fullReportWork(filterData)),
                 "DUE TO UPDATE", null, REPORT_TYPES["due_for_update"]);
}
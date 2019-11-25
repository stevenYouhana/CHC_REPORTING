function _droppedRptWord(name) {  
  var spreadSheetsInA = SpreadsheetApp.openByUrl(spreadSheetAURL)
  var droppedData = spreadSheetsInA.getSheetByName(REPORT_TYPES["longterm"])
    .getDataRange().getValues();
  
  if (name) {
//    Logger.log("if (name) {");
    var filterData =  droppedData.slice(1).filter(function(el) {
    return el[0].toLowerCase() == name.toLowerCase();
  });
    _miniRptSave(_miniRptWork(_nameFilterWork(filterData)), 
                 _nameConvention(name)+"_Dropped_LT_MiniReport",
                 _nameConvention(name),
      REPORT_TYPES["longterm"]);
  }
  else {
    _miniRptSave(_miniRptWork(_fullReportWork(droppedData)),
                 "Dropped_LT_MiniReport", null, REPORT_TYPES["longterm"]);
  }
}

function nameFilter_DroppedMini() {
  var sheet = SpreadsheetApp.getActiveSheet();
  _init(sheet.getDataRange().getValues());
  var selectedName = sheet.getSelection().getActiveRange().getValue().toString();
  _droppedRptWord(selectedName);
}

function droppedMini() {
  _droppedRptWord(null);
}
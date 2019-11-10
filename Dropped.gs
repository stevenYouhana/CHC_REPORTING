function _droppedRptWord(name) {
  
  var spreadSheetAURL = "https://docs.google.com/spreadsheets/d/1rc_iBfXCL-sFVaaCqOyJwB1NosCl47EpFiab_nev42c/edit#gid=545305235";   
  var spreadSheetsInA = SpreadsheetApp.openByUrl(spreadSheetAURL)
  var droppedData = spreadSheetsInA.getSheetByName(AVAILABLE_SHEETS["longterm"])
    .getDataRange().getValues();
  
  if (name) {
//    Logger.log("if (name) {");
    var filterData =  droppedData.slice(1).filter(function(el) {
    return el[0].toLowerCase() == name.toLowerCase();
  });
    _miniRptSave(_miniRptWork(_nameFilterWork(filterData)), 
                 _nameConvention(name)+"_Dropped_LT_MiniReport",
                 _nameConvention(name),
      AVAILABLE_SHEETS["longterm"]);
  }
  else {
    _miniRptSave(_miniRptWork(_fullReportWork(droppedData)),
                 "Dropped_LT_MiniReport", null, AVAILABLE_SHEETS["longterm"]);
  }
}

function nameFilter_DroppedMini() {
  droppedSheet.getSelection().getActiveRange().getValue().toString();  
  var sheet = SpreadsheetApp.getActiveSheet();
  _init(sheet.getDataRange().getValues());
  var selectedName = sheet.getSelection().getActiveRange().getValue().toString();
  _droppedRptWord(selectedName);
}

function droppedMini() {
  _droppedRptWord(null);
}
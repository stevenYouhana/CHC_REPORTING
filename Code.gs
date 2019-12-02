var doc = DocumentApp.getActiveDocument();
var schedule = {
  MONDAY:
    {
      morning: [], 
      afternoon: [], 
      evening: []
    },
  TUESDAY:
    {
      morning: [], 
      afternoon: [], 
      evening: []
    },
  
  WEDNESDAY:
    {
      morning: [], 
      afternoon: [], 
      evening: []
    },
  
  THURSDAY:
    {
      morning: [], 
      afternoon: [], 
      evening: []
    },
  
  FRIDAY: 
    {
      morning: [], 
      afternoon: [], 
      evening: []
    },
  
  SATURDAY: 
    {
      morning: [], 
      afternoon: [], 
      evening: []
    },
  
  SUNDAY: 
    {
      morning: [],
      afternoon: [], 
      evening: []
    }  
};
function _dataForDay(DAY, timeOfDay, record) {
  if (schedule.hasOwnProperty(DAY)) {
    if (schedule.DAY.hasOwnProperty(timeOfDay())) {
        schdedule.DAY.timeOfDay.push(record);
    }
  }
}

function _removeNonWordFromFirstChar(data) {
  data.map(function(el) {
    if (!/[a-zA-Z]/.test(ar.charAt(0))) {
      return ar.split('').slice(1).join('');  
    }
  });
  
}
function _formatHeadings(heading) {
  if (heading.match('[A-Za-z]+'))
      return heading.match('[A-Za-z]+')[0];
  return '';
}
function _formatMemberInfo(member, clean) {
  clean = member.replace(/,+./g, '\n');
//  Logger.log(clean);
  if (clean.match('[a-zA-Z()0-9:].+')) {    
    return clean.match('[a-zA-Z()0-9:].+')[0];
  }
  return '';
}
function _sortResults() {
  var lines = doc.getBody().getText().split('\n')
    .filter(function(el) {
      if (el && el != '') return el
    });
  var day;
  var timeOfDay;
  var formatted;

  lines.forEach(function(e) {    
    var cleanMember;
    formatted = _formatHeadings(e);    
    if (schedule.hasOwnProperty(formatted.toUpperCase())) {
      day = formatted.toUpperCase();
    }
    if (day) {      
      if (schedule[day].hasOwnProperty(formatted.toLowerCase())) {
        timeOfDay = formatted.toLowerCase();
      }
      else if (schedule.hasOwnProperty(formatted.toUpperCase())) {
        day = formatted.toUpperCase();
      }
      else {   
        schedule[day][timeOfDay].push(_formatMemberInfo(e, cleanMember));
      }
    }    
  });
//  Logger.log(schedule);
}
function _displayShedule() {
  _sortResults();
  var text = '';
  for (var day in schedule) {
    text += day + ':\n';
    for (var time in schedule[day]) {
      text += '⏳ ' + time + ':\n';
      schedule[day][time].forEach(function(member) {
        if (member)
          text += member + '\n';
      });
      text += '\n';
    }
    text += '\n\r';
  }
//  Logger.log(text);
  return text;
}
function EV_Sch() {
  _saveAsText(_displayShedule(), "EV_schedule");
}
function _saveAsText(text, fileName) {  
  DriveApp.createFile(fileName + '_' + new Date(), text,  MimeType.PLAIN_TEXT);
}
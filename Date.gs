function SCJ_newDate() {
  var curDate = Utilities.formatDate(new Date(), "GMT+13", "yyyy/MM/dd");  
  var gmtD_M_Y = curDate.split('/');  
  var scjYear = gmtD_M_Y[0] - 1983;
  return scjYear + gmtD_M_Y[1] + gmtD_M_Y[2];
}

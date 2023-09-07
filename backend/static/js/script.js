(function () {
  "use strict";
  window.addEventListener("load", function () {
    console.log("hi");
    let a = apiService.getAllCalendar();
    console.log(a);
  });
})();

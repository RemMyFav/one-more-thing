const apiService = (function () {
  "use strict";
  async function send(method, url, data) {
    const config = {
      method: method,
    };
    if (!["GET", "DELETE"].includes(method)) {
      config.headers = {
        "Content-Type": "application/json",
      };
      config.body = JSON.stringify(data);
    }
    const res = await fetch(url, config);
    return await res.json();
  }

  let module = {};

  module.getAllCalendar = function () {
    return send("GET", "/api/calendar");
  };
  module.getOneCalendar = function (calendarId) {
    return send("GET", "/api/calendar/" + calendarId);
  };
  module.createCalendar = function (calendar) {
    return send("POST", "/api/calendar", calendar);
  };
  module.deleteCalendar = function (calendarId) {
    return send("DELETE", "/api/calendar/" + calendarId);
  };
  module.updateCalendar = function (calendarId, calendar) {
    return send("PATCH", "/api/calendar/" + calendarId, calendar);
  };
  module.getAllTodo = function (calendarId) {
    return send("GET", "/api/calendar/" + calendarId + "/todo");
  };
  module.getOneTodo = function (calendarId, todoId) {
    return send("GET", "/api/calendar/" + calendarId + "/todo" + todoId);
  };
  module.createTodo = function (calendarId, todo) {
    return send("POST", "/api/calendar/" + calendarId + "/todo", todo);
  };
  module.deleteOneTodo = function (calendarId, todoId) {
    return send("DELETE", "/api/calendar/" + calendarId + "/todo" + todoId);
  };
  module.deleteAllTodo = function (calendarId) {
    return send("DELETE", "/api/calendar/" + calendarId + "/todo");
  };
  module.updateTodo = function (calendarId, todoId, todo) {
    return send(
      "PATCH",
      "/api/calendar/" + calendarId + "/todo" + todoId,
      todo
    );
  };
  return module;
})();

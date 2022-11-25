export function loadJSON(json, callback) {
  let req = new XMLHttpRequest();
  req.open("GET", json, false);
  req.onreadystatechange = function () {
    callback(JSON.parse(req.responseText));
  };
  req.send(null);
}

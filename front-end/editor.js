let editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
document.getElementById("editor").style.fontSize = "18px";
let cppcode = `function<pair<int, int> (vector<vector<int>>)> shooter = \n[&](vector<vector<int>> board) {\n
}`;
editor.setValue(cppcode);
editor.clearSelection();

document.getElementById("push").onclick = () => {
  let code = editor.getValue();
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const username = document.getElementById("name").value;
  let sendPlanes = [];
  for (let a of planes) {
    sendPlanes.push({ x: a.sprite.x, y: a.sprite.y, type: a.type });
  }

  console.log(sendPlanes);

  var raw = JSON.stringify({
    username,
    map: gameMap,
    code,
    planes: sendPlanes,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://192.168.1.67:3000", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

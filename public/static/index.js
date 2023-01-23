const body = document.body;

function loadBack (backSrc) {
  let newImg = new Image();

  newImg.onload = function () {
    body.style.backgroundImage = "url('" + newImg.src + "')";
  }
  newImg.src = backSrc;
}

function waitForElement(querySelector, timeout){
  return new Promise((resolve, reject)=>{
    var timer = false;
    if(document.querySelectorAll(querySelector).length) return resolve();
    const observer = new MutationObserver(()=>{
      if(document.querySelectorAll(querySelector).length){
        observer.disconnect();
        if(timer !== false) clearTimeout(timer);
        return resolve();
      }
    });
    observer.observe(document.body, {
      childList: true, 
      subtree: true
    });
    if(timeout) timer = setTimeout(()=>{
      observer.disconnect();
      reject();
    }, timeout);
  });
}

waitForElement("body", 3000).then(function () {
  loadBack("/static/img/outdoors.jpg");

  setTimeout(function () {
    beginCarol();
  }, 11000);
}).catch(() => {
  console.log("Error: did not load!");
});

function beginCarol () {
  let currentIteration = 1;

  setInterval(function () {
    switch (currentIteration) {
      case 1:
        loadBack("/static/img/out2.jpg");
        currentIteration = 2;
        break;
      case 2:
        loadBack("/static/img/lake.jpg");
        currentIteration = 3;
        break;
      case 3:
        loadBack("/static/img/clubhouse.jpg");
        currentIteration = 4;
        break;
      case 4:
        loadBack("/static/img/outdoors.jpg");
        currentIteration = 1;
        break;
    }
  }, 30000);
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let roomID = urlParams.get("n");

if (roomID === null || roomID === undefined || roomID === "" || roomID.length > 30) {
  roomID = "default";
}

const highlandForm = document.getElementById("highland-form");
const messages = document.getElementById("messages");
const user = document.getElementById("user");
const msg = document.getElementById("msg");

highlandForm.onsubmit = function () {
  event.preventDefault();

  fetch ("/poststuff", {
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({
      room : roomID,
      user : user.value,
      msg : msg.value
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    throw error;
  });
}

setInterval(function () {
  fetch ("/getstuff", {
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({
      room : roomID
    })
  })
  .then(response => response.text())
  .then(data => {
    messages.innerHTML = data;
  })
  .catch(error => {
    throw error;
  });
}, 5000);
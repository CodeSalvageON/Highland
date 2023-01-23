const fs = require('fs');
const express = require('express');

const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const io = require('socket.io')(http);
const sjcl = require('sjcl');
const escapeHtml = require('escape-html');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('', function (req, res) {
  const index = __dirname + '/public/static/index.html';

  res.sendFile(index);
});

app.post('/getstuff', function (req, res) {
  let room = req.body.room;
  room = room.replace(" ", "+")
  
  if (room.length > 30 || room.includes("j87*") || room === null || room.includes("]]")) {
    res.send("<b class='mid header'>Error: Too Lengthy!</b>");
    return false;
  }

  fs.readFile(__dirname + '/box.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    
    let jargon = data.split("]]");
    let margin = [];

    for (i = 0; i < jargon.length; i++) {
      if (jargon[i].includes(room)) {
        let koko = jargon[i].replace(room + "j87*", "");
        console.log(koko);

        if (jargon[i] === null || jargon[i] === undefined) {
          // do nothing
        }

        else {
          let boko = JSON.stringify(koko);
          const noko = JSON.parse(boko);
          margin.push(sjcl.decrypt(room, noko));
        }
      }
    }

    let waverlyHills = margin.reverse();
    let mriMachine = waverlyHills.join("<br/>");
    res.send(mriMachine);
  });
});

app.post('/poststuff', function (req, res) {
  let room = req.body.room;
  room = room.replace(" ", "+");
  const user = escapeHtml(req.body.user);
  const msg = escapeHtml(req.body.msg);

  if (room.length > 30 || room.includes("j87*") || room === null || room.includes("]]")) {
    res.send("error");
    return false;
  }

  else {
    const appendData = room + "j87*" + sjcl.encrypt(room, "<p class='mid header'><b>" + user + "</b></p><p class='mid header'>" + msg + "</p>");
    
    fs.readFile(__dirname + '/box.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      
      let jargon = data.split("]]");
      jargon.push(appendData);
      jargon = jargon.join("]]");

      fs.writeFile(__dirname + "/box.txt", jargon, function (err) {
        if (err) throw err;
        console.log('Saved!');
        res.send("yes");
      });
    });
  }
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
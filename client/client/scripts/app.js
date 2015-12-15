// YOUR CODE HERE:

var app = {};

app.init = function () {
  app.fetch();
}


app.addMessage = function (item){
  var message = item.text ? escapeHtml(item.text) : "";
  var name = item.username ? escapeHtml(item.username) : "";
  if (_.contains(app.friends, name)) {
    name = '<strong>' + name + '</strong>';
  }
  $('#chats').append('<div class="chatMessage"> <p class="userName">' 
  + name  + '</p> <p class="messageContent">' 
  + message + '</p> </div>');
}


app.server = 'http://127.0.0.1:3000/messages';

var messageStore = [];
app.send = function (message) { 
  $.ajax({
    url: 'http://127.0.0.1:3000/messages',
    type: 'POST',
    data: JSON.stringify(message),
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      app.fetch();
    },
    error: function (data) {
      console.log('chatterbox: Failed to send message');
      app.fetch();
      throw data;

    }

  });
};

app.fetch = function () {
    $.ajax({
    url: 'http://127.0.0.1:3000/messages',
    type: 'GET',
    data: JSON.stringify(message),
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      // check value of room name drop down
      var room = $('#roomSelect').val();
      var totalMessages = 0;
      var j = 0;
      // if default, load all messages
      app.clearMessages();
      if(room === 'home'){
        for (var i=0; i<20; i++) {
            app.addMessage(data.results[i]);
          if(!_.contains(app.room,data.results[i].roomname)){
            app.addRoom(data.results[i].roomname);
          }
        }
      } 
      else {
        while (totalMessages <= 20 || data.results[j] !== undefined) {
          debugger;
          if(data.results[j].roomname === room){
            app.addMessage(data.results[j]);
            totalMessages++;
          }
          j++;
        }
      }
    },
    error: function (data) {
      console.log('chatterbox: Failed to send message');
      throw data;
    }
  });
};

app.rooms = [];

app.addRoom = function (val) {
  // body...
  // populate 10 most recent posts
    if(!_.contains(app.rooms, val)){
      $('#roomSelect').append('<option value="'+ val + '">' + val + '</option>');
      app.rooms.push(val);
    }
};

app.clearMessages = function () {
  $('#chats').children().remove();
}

var message = {
  username: 'purple platypus',
  text: '<div>test</div>',
  roomname: '4chan'
};

function escapeHtml(text) {
 var map = {
   '&': '&amp;',
   '<': '&lt;',
   '>': '&gt;',
   '"': '&quot;',
   "'": '&#039;'
 };

 return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

app.friends = [];

app.addFriend = function (username) {
  app.friends.push(username);
  $('#friends').append('<option value="'+ username + '">' + username + '</option>');

};

app.handleSubmit = function () {
    var messageObj = {
      username: $('#username').val(),
      text : $('#message').val(),
      roomname: $('#roomname').val()||$('#roomSelect').val()
    }
    app.send(messageObj);
};

$(document).ready(function(){
  app.init();
  //setInterval(app.fetch,1000);
  $('#chats').on('click', 'p.userName', function () {
    app.addFriend($(this).text());
  });

  $('#main').on('click', '.submit', function (event) {
    event.preventDefault();
    app.handleSubmit();
  });

  $('#main').on('change', '#roomSelect', function(){
      app.clearMessages();
      app.fetch();
  })
});





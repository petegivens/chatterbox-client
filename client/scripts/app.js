var App = function(url) {
  this.apiUrl = url;
  this.username = '';
  this.currentRoom;
  this.messages = [];
  this.data;
};

App.prototype.setUser = function(username) {
  this.username = username;
};

App.prototype.init = function() {
  var context = this;
  setInterval(function() {context.getMessagesForChannel();}, 5000);
};

App.prototype.send = function(message) {
  $.post(this.apiUrl, message);
};

App.prototype.fetch = function() {

  $.ajax({
    url: this.apiUrl,
    type: 'GET',
    success: function (data) {
      console.log('Message received',data);
      this.data = data;
    },
    error: function (data) {
      console.error('fetch failed :( ', data);
    }
  });
};

App.prototype.clearMessages = function () {
  $('#chats').html('');

};

App.prototype.renderMessage = function (messageObj) {
  var username = messageObj.username;
  var message = messageObj.text;
  var timeStamp = messageObj.updatedAt;
  timeStamp = moment(timeStamp).startOf('day').fromNow();
  $('#chats').prepend('<div class = "messageBox">' +
                        '<div class="text">' + message + '</div>' +
                        '<div class = "user"> <a href = "#">' + username + '</a> </div>' +
                        '<div class = "timeStamp">' + timeStamp + '</div>' +
                      '</div>'
                      );
};

App.prototype.getMessagesForChannel = function () {
  var context = this;
  $.ajax({
    url: this.apiUrl,
    type: 'GET',
    success: function (data) {
      $('#chats').html('');
      data.results.forEach(function(message) {
        if(message.roomname === context.currentRoom) {
          App.prototype.renderMessage(message);
        }
      });
    },
    error: function (data) {
      console.error('fetch failed :( ', data);
    }
  });
};

App.prototype.renderRoom = function (room) {
  $('#roomSelect').append('<option>' + room + '</option>');
};

var app = new App('http://parse.atx.hackreactor.com/chatterbox/classes/messages');

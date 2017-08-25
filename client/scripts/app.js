var App = function(url) {
  this.apiUrl = url;
  this.username = '';
  this.currentRoom;
  this.messages = [];
};

App.prototype.setUser = function(username) {
  this.username = username;
};

App.prototype.init = function() {

};

App.prototype.send = function(message) {
  $.post(this.apiUrl, message);
};

App.prototype.fetch = function() {

  //change this to $.ajax

  var result = $.get(this.apiUrl, function(x) {
    console.log('x', x);
    return x;
  });
  return result;
};

App.prototype.clearMessages = function () {
  $('#chats').html('');

};

App.prototype.renderMessage = function (messageObj) {
  var username = messageObj.username;
  var message = messageObj.text;
  var timeStamp = messageObj.updatedAt;
  $('#chats').prepend('<div class="message"><h2>' + messageObj.text + '</h2></div>');
  // $('#chat').prepend("
  // <div class = 'message'>
  //   <div class = 'user' > username
  //   </div> <div class = 'message'> message </div>
  //   <div id = 'time'> timeStamp </div>
  // <div> ");
};

App.prototype.getMessagesForChannel = function () {
  var data = this.fetch();
  console.log('results:', data);
  // data.responseJSON.results.forEach(function(message) {
  //   if(message.room === this.currentRoom) {
  //     this.renderMessage(message);
  //   }
  // })
};

App.prototype.renderRoom = function (room) {
  $('#roomSelect').append('<option>' + room + '</option>');
};

var app = new App('http://parse.atx.hackreactor.com/chatterbox/classes/messages');

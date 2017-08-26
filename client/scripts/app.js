var app = {
  server: "http://parse.atx.hackreactor.com/chatterbox/classes/messages",
  username: 'anonymous',
  currentRoom: 'lobby',
  messages: [],

  setUser: function(username) {
    this.username = username;
  },

  init: function() {
    this.fetch();
    var context = this;
    // setInterval(function() {context.getMessagesForChannel();}, 5000);
  },

  send: function(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() {
    this.messages = [];
    $.ajax({
      url: this.server,
      type: 'GET',
      success: function (data) {
        for (var i = 0; i < data.results.length; i++) {
          app.messages.push(data.results[i]);
          app.renderMessage(data.results[i]);
        }
      },
      error: function (data) {
        console.error('fetch failed :( ', data);
      }
    });
  },

  clearMessages: function () {
    $('#chats').html('');

  },

  renderMessage: function (messageObj) {
    var username = messageObj.username;
    var message = messageObj.text;
    var timeStamp = messageObj.updatedAt;
    //Uses MomentJS library to display relative time, e.g. '20 minutes ago'
    timeStamp = moment(timeStamp).startOf('day').fromNow();
    $('#chats').prepend(`<div class="messageBox"><span class="userName">${username}:</span><p class="messageText">${message}</p><p class="timeStamp">${timeStamp}</p></div>`);
  },

  getMessagesForChannel: function () {
    var context = this;
    $.ajax({
      url: this.server,
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
  },

  renderRoom: function (room) {
    $('#roomSelect').append('<option>' + room + '</option>');
  }
};

var app = {
  server: "http://parse.atx.hackreactor.com/chatterbox/classes/messages",
  username: 'anonymous',
  currentRoom: 'lobby',
  messages: {'lobby': []},
  lastMessageFetched: 0,

  init: function() {
    this.username = window.location.search.substr(10);
    app.fetch();
    $('#roomSelect').on('change', function() {
      $('#chats').html('');
      var room = $('#roomSelect').val();
      app.switchRoom(room);
    });

    $('#send').submit(function(event) {
      var message = {
        username: app.username,
        text: $('#messageText').val(),
        roomname: app.currentRoom
      };
      //Prevents default behavior of refreshing page on submit
      event.preventDefault();
      //Clears the text from the input box
      if (message.text.length !== '' || message.text.length !== undefined) {
        app.handleSubmit(message);
      }
      app.fetch();
      this.reset();
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: { order: '-createdAt' },
      success: function (data) {
        for (var i = app.lastMessageFetched + 1; i < data.results.length; i++) {
          var message = data.results[i];
          if (!app.messages[message.roomname]) {
            app.renderRoom(message.roomname);
          }
          app.messages[message.roomname].push(message);
          app.renderMessage(message);
        }
        app.lastMessageFetched = data.results.length - 1;
      },
      error: function (data) {
        console.error('fetch failed :( ', data);
      }
    });
  },

  handleSubmit: function(message) {
    app.send(message);
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('this.server: ', this.server);
        console.log('chatterbox: Message sent: \n', JSON.stringify(message));
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },


  clearMessages: function () {
    $('#chats').html('');
  },

  renderMessage: function ({username, text, roomname, updatedAt}) {
    // ES6 desctructuring on the parameters ^^

    //Uses MomentJS library to display relative time, e.g. '20 minutes ago'
    updatedAt = moment(updatedAt).fromNow();
    $('#chats').append(`<div class="messageBox room-${roomname} username-${username}"><span class="userName">${username}:</span><p class="messageText">${text}</p><p class="timeStamp">${updatedAt}</p></div>`);
  },

  switchRoom: function (room) {
    if (this.currentRoom !== room) {
      this.currentRoom = room;
      app.clearMessages();
      app.messages[app.currentRoom].forEach(x => {
        console.log('currentRoom: ', app.currentRoom);

        if (x.roomname === app.currentRoom) {
          app.renderMessage(x);
        }
      });
    }
  },

  renderRoom: function (room) {
    console.log('renderRoom reporting room:', room);
    app.messages[room] = [];
    $('#roomSelect').append('<option>' + room + '</option>');
  }
};

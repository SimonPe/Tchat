var chat;

function ChatObject() {
    // Handle message input for the chat
    // When the send button has been clicked... or when the enter key has been pressed -> send content to the chat
    // server
    $("#chatTextInput").keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            sendChatMessage();
        }
    });

    $("#chatSendButton").click(function () {
        sendChatMessage();
    });

    function sendChatMessage() {
        if ($("#chatTextInput").val() != "") {
            // This function is defined on the JavaScript code that runs on the server
            now.distributeMessage($("#chatTextInput").val());
            $("#chatTextInput").val("");
        }
    };

    // This function is called when a chat message arrives. Called by the server !
    now.processIncomingChatMessage = function (username, message) {
        // appends the incoming message to the messageLogs
        $("#chatMessages").append("<p><strong>" + username + "</strong> : " + message + "</p>");
        $("#chatMessages").get(0).scrollTop = $("#chatMessages").get(0).scrollHeight;
    }
};


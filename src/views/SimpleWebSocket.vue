<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center text-h5">채팅</v-card-title>
          <v-card-text>
            <div class="chat-box">
              <div v-for="(msg, index) in messages" :key="index">
                {{ msg }}
              </div>
            </div>
            <v-text-field
              v-model="newMessage"
              label="메시지를 입력하세요"
              @keyup.enter="sendMessage"
            />
            <v-btn color="primary" block @click="sendMessage">전송</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      ws: null,
      messages: [],
      newMessage: "",
    };
  },
  created() {
    // 웹소켓 연결을 초기화합니다.
    this.connectWebSocket();
  },
  beforeUnmount() {
    // 컴포넌트가 언마운트되기 전에 웹소켓 연결을 종료합니다.
    this.disconnectWebSocket();
  },
  methods: {
    connectWebSocket() {
      this.ws = new WebSocket("ws://localhost:8080/connect");

      this.ws.onopen = () => {
        console.log("Successfully connected to the WebSocket server.");
      };

      this.ws.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      this.ws.onmessage = (message) => {
        this.messages.push(message.data);
        this.scrollToBottom(); // 새 메시지가 추가되면 스크롤을 맨 아래로 이동합니다.
      };
    },

    sendMessage() {
      if (this.newMessage.trim() === "") {
        return; // 빈 메시지는 전송하지 않습니다.
      }

      this.ws.send(this.newMessage); // 웹소켓을 통해 메시지를 전송합니다.
      this.newMessage = ""; // 입력 필드를 비웁니다.
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$el.querySelector(".chat-box");
        chatBox.scrollTop = chatBox.scrollHeight; // 채팅 박스의 스크롤을 맨 아래로 이동합니다.
      });
    },
    disconnectWebSocket() {
      if (this.ws) {
        this.ws.close(); // 웹소켓 연결을 종료합니다.
        this.ws = null; // ws 변수를 null로 설정하여 연결 상태를 초기화합니다.
        console.log("WebSocket connection disconnected.");
      }
    },
  },
};
</script>

<style>
.chat-box {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}
</style>

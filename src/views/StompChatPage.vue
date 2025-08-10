<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center text-h5">채팅</v-card-title>
          <v-card-text>
            <div class="chat-box">
              <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="[
                  'chat-message',
                  msg.senderEmail === senderEmail ? 'sent' : 'received',
                ]"
              >
                <span v-if="msg.senderEmail !== senderEmail">
                  <strong>{{ msg.senderEmail }}: {{ msg.message }}</strong>
                </span>
                <span v-else>
                  <strong> 나 : {{ msg.message }}</strong>
                </span>
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
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
// import axios from "axios";

export default {
  data() {
    return {
      messages: [],
      newMessage: "",
      stompClient: null, // Stomp 클라이언트 추가
      token: "", // 토큰을 저장할 변수 추가
      senderEmail: null,
      roomId: null,
    };
  },
  created() {
    this.senderEmail = localStorage.getItem("email");
    this.roomId = this.$route.params.roomId; // 라우트 파라미터에서 roomId를 가져옵니다.
    // 웹소켓 연결을 초기화합니다.
    this.connectWebSocket();
  },
  //사용자가 현재 라우트에서 다른 라우트로 이동하려고 할 때 호출되는 훅함수
  beforeRouteLeave(to, from, next) {
    this.disconnectWebSocket();
    next(); // 라우트 변경을 계속 진행합니다.
  },
  //화면을 완전히 떠날 때(꺼버렸을 때)
  beforeUnmount() {
    this.disconnectWebSocket();
  },
  methods: {
    connectWebSocket() {
      if (this.stompClient && this.stompClient.connected) {
        return;
      }

      //sockJs는 websocket을 내장한 향상된 js 라이브러리
      //특징 : http 엔드포인트 사용
      const sockJs = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/connect`);

      // Stomp 클라이언트 초기화
      this.stompClient = Stomp.over(sockJs);
      this.token = localStorage.getItem("token");

      this.stompClient.connect(
        {
          Authorization: `Bearer ${this.token}`, // 토큰을 헤더에 추가
        },
        () => {
          this.stompClient.subscribe(`/topic/${this.roomId}`, (message) => {
            const messageData = JSON.parse(message.body);
            this.messages.push(messageData);
            this.scrollToBottom(); // 새 메시지가 추가되면 스크롤을 맨 아래로 이동합니다.
          });
        }
      );
    },

    sendMessage() {
      if (this.newMessage.trim() === "") {
        return; // 빈 메시지는 전송하지 않습니다.
      }

      const message = {
        message: this.newMessage,
        senderEmail: this.senderEmail, // 현재 로그인한 사용자의 이메일
      };

      this.stompClient.send(
        `/publish/${this.roomId}`, // 메시지를 보낼 엔드포인트
        JSON.stringify(message) // 메시지 내용
      ); // 웹소켓을 통해 메시지를 전송합니다.

      this.newMessage = ""; // 입력 필드를 비웁니다.
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$el.querySelector(".chat-box");
        chatBox.scrollTop = chatBox.scrollHeight; // 채팅 박스의 스크롤을 맨 아래로 이동합니다.
      });
    },
    disconnectWebSocket() {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.unsubsribe(`/topic/${this.roomId}`); // 구독 해제
        this.stompClient.disconnect(); // 웹소켓 연결 종료
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
.chat-message {
  margin-bottom: 10px;
}
.sent {
  text-align: right;
}
.received {
  text-align: left;
}
</style>

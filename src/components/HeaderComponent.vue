<template>
  <v-app-bar app dark>
    <v-container>
      <v-row align="center">
        <v-col class="d-flex justify-start">
          <v-btn to="{path: '/member/list'}"> 회원목록 </v-btn>
          <v-btn to="{path: '/groupchatting/list'}"> 채팅방 목록 </v-btn>
        </v-col>
        <v-col class="text-center">
          <v-btn to="{path: '/'}">chat 서비스</v-btn>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn v-if="isLogin" to="{path: '/my/chat/page'}">MyChatPage</v-btn>
          <v-btn v-if="!isLogin" to="{path: '/member/create'}">회원가입</v-btn>
          <v-btn v-if="!isLogin" to="{path: '/login'}">로그인</v-btn>
          <v-btn v-if="isLogin" @click="doLogout">로그아웃</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
<script>
export default {
  data() {
    return {
      isLogin: false, // 로그인 상태를 나타내는 변수
    };
  },

  created() {
    const token = localStorage.getItem("token");
    if (token) {
      this.isLogin = true; // 토큰이 존재하면 로그인 상태로 설정
    }
  },

  methods: {
    doLogout() {
      localStorage.clear(); // 로컬 스토리지에서 토큰 제거
      window.location.reload(); // 페이지 새로고침
    },
  },
};
</script>

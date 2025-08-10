<template>
  <v-conatiner>
    <v-row justify="center">
      <v-col cols="12" sm="4" md="6">
        <v-card>
          <v-card-title class="text-h5 text-center">로그인</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="doLogin">
              <v-text-field label="email" v-model="email" type="email" required>
              </v-text-field>
              <v-text-field
                label="password"
                v-model="password"
                type="password"
                required
              >
              </v-text-field>
              <v-btn type="submit" color="primary" block>로그인</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-conatiner>
</template>
<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  data() {
    return {
      email: "", // 회원 이메일
      password: "", // 회원 비밀번호
    };
  },
  methods: {
    async doLogin() {
      const loginData = {
        email: this.email,
        password: this.password,
      };

      const response = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/member/doLogin`,
        loginData
      );

      const token = response.data.accessToken; // 로그인 성공 시 토큰 받기
      const role = jwtDecode(token).role; // 토큰에서 역할 정보 추출
      const email = jwtDecode(token).sub; // 토큰에서 이메일 정보 추출

      localStorage.setItem("token", token); // 로컬 스토리지에 토큰 저장
      localStorage.setItem("role", role); // 역할 정보 저장
      localStorage.setItem("email", email); // 이메일 정보 저장

      window.location.href = "/"; // 로그인 후 홈으로 이동
    },
  },
};
</script>

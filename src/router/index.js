import { createRouter, createWebHashHistory } from "vue-router";
import MemberCreate from "@/views/MemberCreate.vue"; // 회원가입 컴포넌트 경로
import LoginPage from "@/views/LoginPage.vue"; // 회원가입 컴포넌트 경로
import MemberList from "@/views/MemberList.vue"; // 회원가입 컴포넌트 경로
import SimpleWebSocket from "@/views/SimpleWebSocket.vue"; // 회원가입 컴포넌트 경로

const routes = [
  {
    path: "/member/create",
    name: "MemberCreate",
    component: MemberCreate,
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/member/list",
    name: "MemberList",
    component: MemberList,
  },
  {
    path: "/simple/chat",
    name: "SimpleWebSocket",
    component: SimpleWebSocket,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

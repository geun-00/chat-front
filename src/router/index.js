import { createRouter, createWebHashHistory } from "vue-router";
import MemberCreate from "@/views/MemberCreate.vue"; // 회원가입 컴포넌트 경로

const routes = [
  {
    path: "/member/create",
    name: "MemberCreate",
    component: MemberCreate,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

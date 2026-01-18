import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // 최상위 app 폴더 내부의 모든 파일을 인식하도록 설정
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
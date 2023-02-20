import { createApp } from "vue";
import App from "./App.vue";
import linguist from "../linguist.json";
import type { Language } from "./Language.type";
import "./assets/style.css";

const languages = Object.entries(linguist)
  .filter(([k]) => k.slice(0, 2) !== "__")
  .map(([k, v]) => ({
    name: k,
    ...(v as Omit<Language, "name">)
  })) as Language[];

createApp(App, {
  languages
}).mount("#app");

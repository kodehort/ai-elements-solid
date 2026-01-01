// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const appEl = document.getElementById("app");
if (appEl) {
  mount(() => <StartClient />, appEl);
}

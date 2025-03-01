import "./style.css";
import { setupInput } from "./input.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <input id="input" />
    <span id="type"></span>
  </div>
`;

setupInput(document.querySelector<HTMLButtonElement>("#input")!);

import { addSpace, matchType } from "./utils";

function preventSelectingSpace(e: Event) {
  const element = e.target as HTMLInputElement;
  const { selectionStart, selectionEnd } = element;
  if (selectionStart === null || selectionEnd == null) return;
  const selected = element.value.slice(selectionStart, selectionEnd);
  if (selected === " ") element.selectionEnd = element.selectionStart;
}

let originalValue = "";

function recordOriginalValue(e: Event) {
  const element = e.target as HTMLInputElement;
  originalValue = element.value;
}

function normalizePosition(e: Event) {
  const element = e.target as HTMLInputElement;
  const startPosition = element.selectionStart;

  // Handling of backspace before the space, delete the digit before the space.
  const originalSpaceCount = originalValue.split(" ").length - 1;
  const spaceCount = addSpace(element.value).split(" ").length - 1;
  const isValueEqual =
    originalValue.replace(/\D/g, "") === element.value.replace(/\D/g, "");

  if (originalSpaceCount === spaceCount - 1 && isValueEqual) {
    const startPosition = element.selectionStart;
    if (startPosition === null) return;
    const newPosition = startPosition - 1;
    const newValue = `${element.value.slice(
      0,
      newPosition
    )}${element.value.slice(startPosition)}`;
    element.value = addSpace(newValue);
    element.selectionStart = element.selectionEnd = newPosition;
    return;
  }

  if (startPosition === null) return;
  const targetPosition = addSpace(element.value.slice(0, startPosition)).length;
  const offset = element.value.charAt(startPosition - 1) === " " ? 1 : 0;
  element.value = addSpace(element.value);
  element.selectionStart = element.selectionEnd = targetPosition + offset;
}

function checkType(e: Event) {
  document.querySelector("#type")!.innerHTML =
    matchType((e.target as HTMLInputElement).value) || "";
}

export function setupInput(element: HTMLButtonElement) {
  element.addEventListener("select", preventSelectingSpace);
  element.addEventListener("beforeinput", recordOriginalValue);
  element.addEventListener("input", normalizePosition);
  element.addEventListener("input", checkType);
}

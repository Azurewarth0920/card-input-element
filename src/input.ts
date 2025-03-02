import { addSpace, matchType } from "./utils";

function preventSelectingSpace(e: Event) {
  const target = e.target as HTMLInputElement;

  const startPosition = target.selectionStart;
  const endPosition = target.selectionEnd;

  if (startPosition === null || endPosition == null) return;

  const selectedText = target.value.slice(startPosition, endPosition);

  if (selectedText === " ") {
    target.selectionEnd = target.selectionStart;
  }
}

let currentValue = "";

function recordCurrentValue(e: Event) {
  const element = e.target as HTMLInputElement;
  currentValue = element.value;
}

function normalizePosition(e: Event) {
  const element = e.target as HTMLInputElement;
  const startPosition = element.selectionStart;

  // Trying to delete the space.
  // Instead of deleting the space, delete the number before the space.
  const originSpaceCount = currentValue.split(" ").length - 1;
  const spaceCount = addSpace(element.value).split(" ").length - 1;
  const isValueEqual =
    currentValue.replace(/\D/g, "") === element.value.replace(/\D/g, "");

  if (originSpaceCount === spaceCount - 1 && isValueEqual) {
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
  element.addEventListener("beforeinput", recordCurrentValue);
  element.addEventListener("input", normalizePosition);
  element.addEventListener("input", checkType);
}

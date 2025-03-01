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

function normalizePosition(e: Event) {
  const element = e.target as HTMLInputElement;
  const startPosition = element.selectionStart;

  // Trying to delete the space.
  // Instead of deleting the space, delete the number before the space.
  const originSpaceCount = element.value.split(" ").length - 1;
  const spaceCount = addSpace(element.value).split(" ").length - 1;

  if (originSpaceCount - 1 === spaceCount) {
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

  const targetPosition =
    startPosition !== null
      ? addSpace(element.value.slice(0, startPosition).replace(/\D/g, ""))
          .length
      : false;

  element.value = addSpace(element.value);

  if (typeof targetPosition === "number")
    element.selectionStart = element.selectionEnd = targetPosition;
}

function checkType(e: Event) {
  document.querySelector("#type")!.innerHTML =
    matchType((e.target as HTMLInputElement).value) || "";
}

export function setupInput(element: HTMLButtonElement) {
  element.addEventListener("select", preventSelectingSpace);
  element.addEventListener("input", normalizePosition);
  element.addEventListener("input", checkType);
}

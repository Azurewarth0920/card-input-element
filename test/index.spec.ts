import { test, expect, Page } from "@playwright/test";
import { describe } from "node:test";

function setInputValue(page: Page, value: string) {
  const el = page.locator("#input");
  el.fill(value);
  return el;
}

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173");
  setInputValue(page, "");
});

describe("Selecting", () => {
  // Prevent select the space
  test("Prevent selecting the space", async ({ page }) => {
    const input = setInputValue(page, "1111 1");
    await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(4, 5));
    expect(
      await input.evaluate((el: HTMLInputElement) => el.selectionStart)
    ).toBe(4);
  });
});

describe("Typing", () => {
  test("1111| to 1111 1|", async ({ page }) => {
    const input = setInputValue(page, "1111");
    await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(4, 4));
    await page.keyboard.press("1");
    expect(await input.inputValue()).toBe("1111 1");
    expect(
      await input.evaluate((el: HTMLInputElement) => el.selectionStart)
    ).toBe(6);
  });
});

describe("Pasting", () => {
  test("1111 22|22 to 1111 2233 3|22 (pasting 333)", async ({ page }) => {
    const input = setInputValue(page, "1111 2222");
    await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(7, 7));
    await page.keyboard.insertText("333");
    expect(await input.inputValue()).toBe("1111 2233 322");
    expect(
      await input.evaluate((el: HTMLInputElement) => el.selectionStart)
    ).toBe(11);
  });
});

describe("Deleting", () => {
  test("1111 1| to 1111|", async ({ page }) => {
    const input = setInputValue(page, "1111 1");
    await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(6, 6));
    await page.keyboard.press("Backspace");
    expect(await input.inputValue()).toBe("1111");
    expect(
      await input.evaluate((el: HTMLInputElement) => el.selectionStart)
    ).toBe(4);
  });

  test("444|4 3|333 222 to 444|3 3322 2", async ({ page }) => {
    const input = setInputValue(page, "4444 3333 222");
    await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(3, 6));
    await page.keyboard.press("Backspace");
    expect(await input.inputValue()).toBe("4443 3322 2");
    expect(
      await input.evaluate((el: HTMLInputElement) => el.selectionStart)
    ).toBe(3);
  });
});

import { Duplex, Writable } from "stream";
import termkit from "terminal-kit";
import { teardown } from "../teardown.js";

// input duplex stream
export const inputStream = new Duplex({
  write(chunk, encoding, next) {
    this.push(chunk);
    next();
  },
  read() {},
});

const { terminal: term } = termkit;

term.windowTitle("Terminal Chat");
term.clear();

const document = term.createDocument({
  palette: new termkit.Palette(),
});

const textBoxHeight = 20;
const textBoxWidth = 80;

const textBox = new termkit.TextBox({
  contentHasMarkup: true,
  parent: document,
  scrollable: true,
  vScrollBar: true,
  lineWrap: true,
  x: 0,
  y: 2,
  width: textBoxWidth,
  height: textBoxHeight,
});

// append 20 newlines to the textBox
textBox.appendLog("\n".repeat(textBoxHeight - 1));

const inlineInput = new termkit.InlineInput({
  parent: document,
  textAttr: {},
  voidAttr: {},
  placeholder: "Chat, enter commands, or send art",
  x: 0,
  y: textBoxHeight + 2,
  //*
  prompt: {
    textAttr: {},
    content: "^G> ",
    contentHasMarkup: true,
  },
  //*/
  //firstLineRightShift: 8 ,
  //width: 36 ,
  width: textBoxWidth,
  cancelable: true,
  value: "",
  //   history: ["Bob", "Bill", "Jack", "Some entry string"]
  //   autoComplete: [],
  //   autoCompleteMenu: true,
  //   autoCompleteHint: true,
  //   autoCompleteHintMinInput: 5,
});

inlineInput.on("submit", onSubmit);

function onSubmit(value) {
  // send text
  inputStream.write(value);

  //clear the input
  inlineInput.textBuffer.setText("");
  inlineInput.draw();
}

inlineInput.on("cancel", onCancel);

function onCancel() {
  // clear the input
  inlineInput.textBuffer.setText("");
  inlineInput.draw();
}

document.focusNext();
document.focusNext();
document.focusNext();
document.focusNext();

const colorDict = {
  brightBlue: "^B",
  brightCyan: "^C",
};

export const displayBuilder = () =>
  new Writable({
    objectMode: true,
    write({ type, data, color }, encoding, next) {
      if (type === "text") {
        textBox.appendLog(`${colorDict[color]}${data}`);
      } else if (type === "ascii") {
        term.bold[color](data);
      } else if (type === "volcano") {
        term.drawImage(data, { shrink: { width: 100, height: 100 } });
      } else console.error(`Unknown display type: ${type}`);
      next();
    },
  });

term.on("key", function (key) {
  switch (key) {
    case "CTRL_C":
      term.grabInput(false);
      term.hideCursor(false);
      term.styleReset();
      term.clear();
      teardown();
      process.exit();
      break;
  }
});

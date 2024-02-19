import { Duplex, Writable } from "stream";
import termkit from "terminal-kit";
import { teardown } from "../../teardown.js";
import colors from './colors.js';

// input duplex stream
export const inputStream = new Duplex({
  write(chunk, encoding, next) {
    this.push(chunk);
    next();
  },
  read() {},
});

const { terminal: term } = termkit;

term.windowTitle("The Terminal");
term.clear();

const document = term.createDocument({
  palette: new termkit.Palette(),
});

const chatBoxHeight = 22;
const chatBoxWidth = 80;

const chatBox = new termkit.TextBox({
  contentHasMarkup: true,
  parent: document,
  scrollable: true,
  vScrollBar: true,
  wordWrap: true,
  x: 2,
  y: 2,
  width: chatBoxWidth,
  height: chatBoxHeight,
});

// append newlines to the chatBox to fill the height
chatBox.appendLog("\n".repeat(chatBoxHeight - 1));

//chat input
const commandHistory = [""];
const chatInput = new termkit.InlineInput({
  parent: document,
  textAttr: {},
  voidAttr: {},
  placeholder: "Chat, enter commands, or send nudes",
  x: 2,
  y: chatBoxHeight + 3,
  //*
  prompt: {
    textAttr: {},
    content: "^G> ",
    contentHasMarkup: true,
  },
  //*/
  //firstLineRightShift: 8 ,
  //width: 36 ,
  width: chatBoxWidth,
  cancelable: true,
  value: "",
  history: commandHistory,
  //   autoComplete: [],
  //   autoCompleteMenu: true,
  //   autoCompleteHint: true,
  //   autoCompleteHintMinInput: 5,
});

chatInput.on("submit", onSubmit);

function onSubmit(value) {
  // send text
  inputStream.write(value);

  // add to command history
  if (commandHistory[commandHistory.length - 2] !== value) {
    // limit history to 100
    if (commandHistory.length > 100) commandHistory.shift();
    // remove placeholder
    commandHistory.pop();
    commandHistory.push(value, "");
  }

  chatInput.contentArray = commandHistory;
  chatInput.contentIndex = commandHistory.length - 1;

  //clear the input
  chatInput.textBuffer.setText(``);
  chatInput.draw();
}

chatInput.on("cancel", onCancel);

function onCancel() {
  // clear the input
  chatInput.textBuffer.setText("");
  chatInput.draw();
}

// focus the input
document.focusNext();
document.focusNext();
document.focusNext();
document.focusNext();

// chat box border
const chatBoxBorder = new termkit.Border({
  parent: chatBox,
  color: colors.blue,
  bgColor: colors.green,
});

// chat input border
const chatInputBorder = new termkit.Border({
  parent: chatInput,
  color: colors.blue,
  bgColor: colors.green,
});

// ascii art box
const artBox = new termkit.TextBox({
  contentHasMarkup: true,
  parent: document,
  scrollable: true,
  vScrollBar: true,
  lineWrap: true,
  x: chatBoxWidth + 3,
  y: 2,
  width: chatBoxWidth,
  height: chatBoxHeight,
});

// art box border
const artBoxBorder = new termkit.Border({
  parent: artBox,
  color: colors.blue,
  bgColor: colors.green,
});

const colorDict = {
  brightBlue: "^B",
  brightCyan: "^C",
  brightWhite: "^W",
  brightYellow: "^Y",
  green: "^g",
  magenta: "^m",
  red: "^r",
  white: "^w",
};

export const displayBuilder = () =>
  new Writable({
    objectMode: true,
    write({ type, data, color }, encoding, next) {
      if (type === "text") {
        chatBox.appendLog(
          ` ${colorDict[color]}${data
            .trim()
            .split("\n")
            .join(`\n ${colorDict[color]}`)}`
        );
      } else if (type === "ascii") {
        // clear the art box
        artBox.textBuffer.setText("");
        artBox.appendLog(
          `${colorDict[color]}${data.split("\n").join(`\n${colorDict[color]}`)}`
        );
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

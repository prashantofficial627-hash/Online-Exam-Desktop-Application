const EXAMS = [
  {
    id: 1,
    title: "JavaScript Basics",
    duration: 5,
    marksPerQuestion: 1,
    passPercentage: 40,
    questions: [
      {
        text: "Which keyword is used to declare a constant in JavaScript?",
        options: ["var", "let", "const", "static"],
        answer: 2
      },
      {
        text: "Which symbol is used for single-line comments in JavaScript?",
        options: ["//", "<!-- -->", "#", "**"],
        answer: 0
      },
      {
        text: "What does DOM stand for?",
        options: [
          "Data Object Model",
          "Document Object Model",
          "Digital Order Management",
          "Display Output Mode"
        ],
        answer: 1
      },
      {
        text: "Which method adds an item to the end of an array?",
        options: ["pop()", "shift()", "push()", "slice()"],
        answer: 2
      },
      {
        text: "What is the result of 2 + '2' in JavaScript?",
        options: ["4", "22", "NaN", "Error"],
        answer: 1
      }
    ]
  },
  {
    id: 2,
    title: "HTML and CSS Basics",
    duration: 5,
    marksPerQuestion: 2,
    passPercentage: 40,
    questions: [
      {
        text: "Which tag is used to create a hyperlink in HTML?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        answer: 1
      },
      {
        text: "Which CSS property changes the text color?",
        options: ["font-color", "text-color", "color", "foreground"],
        answer: 2
      },
      {
        text: "Which tag is used for the largest heading?",
        options: ["<h6>", "<head>", "<h1>", "<heading>"],
        answer: 2
      },
      {
        text: "Which CSS property is used to add space inside an element's border?",
        options: ["margin", "padding", "spacing", "gap"],
        answer: 1
      }
    ]
  },
  {
    id: 3,
    title: "Electron.js Basics",
    duration: 5,
    marksPerQuestion: 1,
    passPercentage: 40,
    questions: [
      {
        text: "Electron is mainly used to build:",
        options: ["Mobile apps", "Desktop apps", "Databases", "Operating systems"],
        answer: 1
      },
      {
        text: "Which Electron class is used to create a window?",
        options: ["BrowserWindow", "WindowMaker", "AppWindow", "ElectronWindow"],
        answer: 0
      },
      {
        text: "Which file is usually the starting point (main process) of an Electron app?",
        options: ["index.css", "main.js", "style.css", "readme.md"],
        answer: 1
      },
      {
        text: "Which technologies are used to design the Electron app's interface?",
        options: ["HTML, CSS, JavaScript", "Only Java", "Only C++", "Only Python"],
        answer: 0
      }
    ]
  }
];

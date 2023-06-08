export default async function ({ addon, console, msg }) {
  function makeStyle() {
    let style = document.createElement("style");
    style.textContent = `
    .blocklyText {
        fill: #fff;
        font-family: "Helvetica Neue", Helvetica, sans-serif;
        font-size: 12pt;
        font-weight: 500;
    }
    .blocklyNonEditableText>text, .blocklyEditableText>text {
        fill: #575E75;
    }
    .blocklyDropdownText {
        fill: #fff !important;
    }
    `;
    for (let userstyle of document.querySelectorAll(".scratch-addons-style[data-addons*='editor-theme3']")) {
      if (userstyle.disabled) continue;
      style.textContent += userstyle.textContent;
    }
    return style;
  }

  function setCSSVars(element) {
    for (let property of document.documentElement.style) {
      if (property.startsWith("--editorTheme3-"))
        element.style.setProperty(property, document.documentElement.style.getPropertyValue(property));
    }
  }

  let exSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  exSVG.setAttribute("xmlns:html", "http://www.w3.org/1999/xhtml");
  exSVG.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  exSVG.setAttribute("version", "1.1");

  // blocks-media as base64 for svg inline image
  let blocksMedia = new Map();
  blocksMedia.set(
    "repeat.svg",
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9InJlcGVhdCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNCAyNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNDRjhCMTc7fQoJLnN0MXtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8dGl0bGU+cmVwZWF0PC90aXRsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIzLjMsMTFjLTAuMywwLjYtMC45LDEtMS41LDFoLTEuNmMtMC4xLDEuMy0wLjUsMi41LTEuMSwzLjZjLTAuOSwxLjctMi4zLDMuMi00LjEsNC4xCgljLTEuNywwLjktMy42LDEuMi01LjUsMC45Yy0xLjgtMC4zLTMuNS0xLjEtNC45LTIuM2MtMC43LTAuNy0wLjctMS45LDAtMi42YzAuNi0wLjYsMS42LTAuNywyLjMtMC4ySDdjMC45LDAuNiwxLjksMC45LDIuOSwwLjkKCXMxLjktMC4zLDIuNy0wLjljMS4xLTAuOCwxLjgtMi4xLDEuOC0zLjVoLTEuNWMtMC45LDAtMS43LTAuNy0xLjctMS43YzAtMC40LDAuMi0wLjksMC41LTEuMmw0LjQtNC40YzAuNy0wLjYsMS43LTAuNiwyLjQsMEwyMyw5LjIKCUMyMy41LDkuNywyMy42LDEwLjQsMjMuMywxMXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTIxLjgsMTFoLTIuNmMwLDEuNS0wLjMsMi45LTEsNC4yYy0wLjgsMS42LTIuMSwyLjgtMy43LDMuNmMtMS41LDAuOC0zLjMsMS4xLTQuOSwwLjhjLTEuNi0wLjItMy4yLTEtNC40LTIuMQoJYy0wLjQtMC4zLTAuNC0wLjktMC4xLTEuMmMwLjMtMC40LDAuOS0wLjQsMS4yLTAuMWwwLDBjMSwwLjcsMi4yLDEuMSwzLjQsMS4xczIuMy0wLjMsMy4zLTFjMC45LTAuNiwxLjYtMS41LDItMi42CgljMC4zLTAuOSwwLjQtMS44LDAuMi0yLjhoLTIuNGMtMC40LDAtMC43LTAuMy0wLjctMC43YzAtMC4yLDAuMS0wLjMsMC4yLTAuNGw0LjQtNC40YzAuMy0wLjMsMC43LTAuMywwLjksMEwyMiw5LjgKCWMwLjMsMC4zLDAuNCwwLjYsMC4zLDAuOVMyMiwxMSwyMS44LDExeiIvPgo8L3N2Zz4K"
  );
  blocksMedia.set(
    "green-flag.svg",
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9ImdyZWVuZmxhZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNCAyNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0NTk5M0Q7fQoJLnN0MXtmaWxsOiM0Q0JGNTY7fQo8L3N0eWxlPgo8dGl0bGU+Z3JlZW5mbGFnPC90aXRsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIwLjgsMy43Yy0wLjQtMC4yLTAuOS0wLjEtMS4yLDAuMmMtMiwxLjYtNC44LDEuNi02LjgsMGMtMi4zLTEuOS01LjYtMi4zLTguMy0xVjIuNWMwLTAuNi0wLjUtMS0xLTEKCXMtMSwwLjQtMSwxdjE4LjhjMCwwLjUsMC41LDEsMSwxaDAuMWMwLjUsMCwxLTAuNSwxLTF2LTYuNGMxLTAuNywyLjEtMS4yLDMuNC0xLjNjMS4yLDAsMi40LDAuNCwzLjQsMS4yYzIuOSwyLjMsNywyLjMsOS44LDAKCWMwLjMtMC4yLDAuNC0wLjUsMC40LTAuOVY0LjdDMjEuNiw0LjIsMjEuMywzLjgsMjAuOCwzLjd6IE0yMC41LDEzLjlDMjAuNSwxMy45LDIwLjUsMTMuOSwyMC41LDEzLjlDMTgsMTYsMTQuNCwxNiwxMS45LDE0CgljLTEuMS0wLjktMi41LTEuNC00LTEuNGMtMS4yLDAuMS0yLjMsMC41LTMuNCwxLjFWNEM3LDIuNiwxMCwyLjksMTIuMiw0LjZjMi40LDEuOSw1LjcsMS45LDguMSwwYzAuMSwwLDAuMSwwLDAuMiwwCgljMCwwLDAuMSwwLjEsMC4xLDAuMUwyMC41LDEzLjl6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMC42LDQuOGwtMC4xLDkuMWMwLDAsMCwwLjEsMCwwLjFjLTIuNSwyLTYuMSwyLTguNiwwYy0xLjEtMC45LTIuNS0xLjQtNC0xLjRjLTEuMiwwLjEtMi4zLDAuNS0zLjQsMS4xVjQKCUM3LDIuNiwxMCwyLjksMTIuMiw0LjZjMi40LDEuOSw1LjcsMS45LDguMSwwYzAuMSwwLDAuMSwwLDAuMiwwQzIwLjUsNC43LDIwLjYsNC43LDIwLjYsNC44eiIvPgo8L3N2Zz4K"
  );
  blocksMedia.set(
    "blue-flag.svg",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA0IiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDEwNCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik04LjAwMDAxIDhDOC4wMDAwMSA1Ljc5MDg2IDYuMjA5MTQgNCA0LjAwMDAxIDRDMS43OTA4NyA0IDUuMjkxNDNlLTA2IDUuNzkwODYgNS4yMDE2NmUtMDYgOEw4LjAwMDAxIDhaTTAgMTM2Qy04Ljk3NzQ5ZS0wOCAxMzguMjA5IDEuNzkwODYgMTQwIDQgMTQwQzYuMjA5MTQgMTQwIDggMTM4LjIwOSA4IDEzNkwwIDEzNlpNOTcuNTE1IDc4LjkzMTlMOTYuMTEwNSA3NS4xODY2TDk3LjUxNSA3OC45MzE5Wk01NS4wMDc5IDc5LjEyOEw1My42MDM0IDgyLjg3MzNMNTUuMDA3OSA3OS4xMjhaTTUuMjAxNjZlLTA2IDhMMCAxMzZMOCAxMzZMOC4wMDAwMSA4TDUuMjAxNjZlLTA2IDhaTTAgMjFWODVIOFYyMUgwWk0xMDQgNzUuMzQ2VjE4Ljk2OTRIOTZWNzUuMzQ2SDEwNFpNOTcuNjkyMyA4My4xMzc0TDk4LjkxOTUgODIuNjc3Mkw5Ni4xMTA1IDc1LjE4NjZMOTQuODgzMyA3NS42NDY4TDk3LjY5MjMgODMuMTM3NFpNNTguMDU3NSAxMS45OTk1TDU2LjQxMjQgMTEuMzgyNkw1My42MDM0IDE4Ljg3MzNMNTUuMjQ4NSAxOS40OTAyTDU4LjA1NzUgMTEuOTk5NVpNNTMuNjAzNCA4Mi44NzMzTDU0LjMwNzcgODMuMTM3NEw1Ny4xMTY3IDc1LjY0NjhMNTYuNDEyNCA3NS4zODI2TDUzLjYwMzQgODIuODczM1pNOTQuODgzMyA3NS42NDY4QzgyLjcwODQgODAuMjEyNCA2OS4yOTE2IDgwLjIxMjQgNTcuMTE2NyA3NS42NDY4TDU0LjMwNzcgODMuMTM3NEM2OC4yOTM3IDg4LjM4MjEgODMuNzA2MyA4OC4zODIxIDk3LjY5MjMgODMuMTM3NEw5NC44ODMzIDc1LjY0NjhaTTkzLjk0MjUgMTEuOTk5NUM4Mi4zNzQyIDE2LjMzNzcgNjkuNjI1OCAxNi4zMzc3IDU4LjA1NzUgMTEuOTk5NUw1NS4yNDg1IDE5LjQ5MDJDNjguNjI3OSAyNC41MDc1IDgzLjM3MjEgMjQuNTA3NSA5Ni43NTE1IDE5LjQ5MDJMOTMuOTQyNSAxMS45OTk1Wk02LjIxODggMjQuMzI4MkMyMC4yMTc0IDE0Ljk5NTggMzcuODUwMyAxMi45NjU5IDUzLjYwMzQgMTguODczM0w1Ni40MTI0IDExLjM4MjZDMzguMjUwMiA0LjU3MTgxIDE3LjkyMDcgNi45MTIxNiAxLjc4MTIgMTcuNjcxOEw2LjIxODggMjQuMzI4MlpNOTYgNzUuMzQ2Qzk2IDc1LjI3NSA5Ni4wNDQgNzUuMjExNSA5Ni4xMTA1IDc1LjE4NjZMOTguOTE5NSA4Mi42NzcyQzEwMS45NzUgODEuNTMxMiAxMDQgNzguNjA5OCAxMDQgNzUuMzQ2SDk2Wk02LjIxODggODguMzI4MkMyMC4yMTc0IDc4Ljk5NTggMzcuODUwMyA3Ni45NjU5IDUzLjYwMzQgODIuODczM0w1Ni40MTI0IDc1LjM4MjZDMzguMjUwMiA2OC41NzE4IDE3LjkyMDcgNzAuOTEyMiAxLjc4MTIgODEuNjcxOEw2LjIxODggODguMzI4MlpNMTA0IDE4Ljk2OTRDMTA0IDEzLjc3MjEgOTguODA4OSAxMC4xNzQ3IDkzLjk0MjUgMTEuOTk5NUw5Ni43NTE1IDE5LjQ5MDJDOTYuMzg3OSAxOS42MjY1IDk2IDE5LjM1NzcgOTYgMTguOTY5NEgxMDRaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTQuOTY5NEMxMDAgMTIuNTY0OSA5Ny41OTg0IDEwLjkwMDYgOTUuMzQ3IDExLjc0NDlWMTEuNzQ0OUM4Mi44NzMxIDE2LjQyMjYgNjkuMTI2OSAxNi40MjI2IDU2LjY1MyAxMS43NDQ5TDU0LjU3NCAxMC45NjUzQzM3Ljg4ODggNC43MDgzIDE5LjIxMjUgNi44NTgzMyA0LjM4NTUxIDE2Ljc0M1YxNi43NDNDNC4xNDQ2NiAxNi45MDM2IDQgMTcuMTczOSA0IDE3LjQ2MzNWNzkuNDQ0NkM0IDgwLjEwOTUgNC43NDA5NyA4MC41MDYgNS4yOTQxNiA4MC4xMzcyVjgwLjEzNzJDMTkuNTUwNiA3MC42MzI5IDM3LjUwODMgNjguNTY1NiA1My41NTE1IDc0LjU4MThMNTUuNzEyMiA3NS4zOTIxQzY4Ljc5MjcgODAuMjk3MyA4My4yMDczIDgwLjI5NzMgOTYuMjg3OCA3NS4zOTIxTDk3LjUxNSA3NC45MzE5Qzk5LjAwOTggNzQuMzcxMyAxMDAgNzIuOTQyNCAxMDAgNzEuMzQ2VjE0Ljk2OTRaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfNV8yNykiLz4KPHBhdGggZD0iTTguMDAwMDEgNEM4LjAwMDAxIDEuNzkwODYgNi4yMDkxNCA4Ljk3NzQ5ZS0wOCA0LjAwMDAxIDBDMS43OTA4NyAtOC45Nzc0OWUtMDggNS4yOTE0M2UtMDYgMS43OTA4NiA1LjIwMTY2ZS0wNiA0TDguMDAwMDEgNFpNMCAxMzJDLTguOTc3NDllLTA4IDEzNC4yMDkgMS43OTA4NiAxMzYgNCAxMzZDNi4yMDkxNCAxMzYgOCAxMzQuMjA5IDggMTMyTDAgMTMyWk05Ny41MTUgNzQuOTMxOUw5Ni4xMTA1IDcxLjE4NjZMOTcuNTE1IDc0LjkzMTlaTTU1LjAwNzkgNzUuMTI4TDUzLjYwMzQgNzguODczM0w1NS4wMDc5IDc1LjEyOFpNNS4yMDE2NmUtMDYgNEwwIDEzMkw4IDEzMkw4LjAwMDAxIDRMNS4yMDE2NmUtMDYgNFpNMCAxN1Y4MUg4VjE3SDBaTTEwNCA3MS4zNDZWMTQuOTY5NEg5NlY3MS4zNDZIMTA0Wk05Ny42OTIzIDc5LjEzNzRMOTguOTE5NSA3OC42NzcyTDk2LjExMDUgNzEuMTg2Nkw5NC44ODMzIDcxLjY0NjhMOTcuNjkyMyA3OS4xMzc0Wk01OC4wNTc1IDcuOTk5NTRMNTYuNDEyNCA3LjM4MjYzTDUzLjYwMzQgMTQuODczM0w1NS4yNDg1IDE1LjQ5MDJMNTguMDU3NSA3Ljk5OTU0Wk01My42MDM0IDc4Ljg3MzNMNTQuMzA3NyA3OS4xMzc0TDU3LjExNjcgNzEuNjQ2OEw1Ni40MTI0IDcxLjM4MjZMNTMuNjAzNCA3OC44NzMzWk05NC44ODMzIDcxLjY0NjhDODIuNzA4NCA3Ni4yMTI0IDY5LjI5MTYgNzYuMjEyNCA1Ny4xMTY3IDcxLjY0NjhMNTQuMzA3NyA3OS4xMzc0QzY4LjI5MzcgODQuMzgyMSA4My43MDYzIDg0LjM4MjEgOTcuNjkyMyA3OS4xMzc0TDk0Ljg4MzMgNzEuNjQ2OFpNOTMuOTQyNSA3Ljk5OTU0QzgyLjM3NDIgMTIuMzM3NyA2OS42MjU4IDEyLjMzNzcgNTguMDU3NSA3Ljk5OTU0TDU1LjI0ODUgMTUuNDkwMkM2OC42Mjc5IDIwLjUwNzUgODMuMzcyMSAyMC41MDc1IDk2Ljc1MTUgMTUuNDkwMkw5My45NDI1IDcuOTk5NTRaTTYuMjE4OCAyMC4zMjgyQzIwLjIxNzQgMTAuOTk1OCAzNy44NTAzIDguOTY1ODcgNTMuNjAzNCAxNC44NzMzTDU2LjQxMjQgNy4zODI2M0MzOC4yNTAyIDAuNTcxODEyIDE3LjkyMDcgMi45MTIxNiAxLjc4MTIgMTMuNjcxOEw2LjIxODggMjAuMzI4MlpNOTYgNzEuMzQ2Qzk2IDcxLjI3NSA5Ni4wNDQgNzEuMjExNSA5Ni4xMTA1IDcxLjE4NjZMOTguOTE5NSA3OC42NzcyQzEwMS45NzUgNzcuNTMxMiAxMDQgNzQuNjA5OCAxMDQgNzEuMzQ2SDk2Wk02LjIxODggODQuMzI4MkMyMC4yMTc0IDc0Ljk5NTggMzcuODUwMyA3Mi45NjU5IDUzLjYwMzQgNzguODczM0w1Ni40MTI0IDcxLjM4MjZDMzguMjUwMiA2NC41NzE4IDE3LjkyMDcgNjYuOTEyMiAxLjc4MTIgNzcuNjcxOEw2LjIxODggODQuMzI4MlpNMTA0IDE0Ljk2OTRDMTA0IDkuNzcyMDggOTguODA4OSA2LjE3NDY1IDkzLjk0MjUgNy45OTk1NEw5Ni43NTE1IDE1LjQ5MDJDOTYuMzg3OSAxNS42MjY1IDk2IDE1LjM1NzcgOTYgMTQuOTY5NEgxMDRaIiBmaWxsPSIjMDAzMDgwIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNV8yNyIgeDE9IjUyIiB5MT0iMSIgeDI9IjUyIiB5Mj0iODMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzAwODBGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYwQkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4="
  );
  blocksMedia.set(
    "control_stop.svg",
    "data:image/svg+xml;base64,PHN2ZyBpZD0iSWNvbiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDAgNDAiPjx0aXRsZT5jb250cm9sX3N0b3A8L3RpdGxlPjxwb2x5Z29uIHBvaW50cz0iMjUuNjEgNi41IDMzLjU2IDE0LjQ0IDMzLjU2IDI1LjY4IDI1LjYxIDMzLjYyIDE0LjM4IDMzLjYyIDYuNDMgMjUuNjggNi40MyAxNC40NCAxNC4zOCA2LjUgMjUuNjEgNi41IiBmaWxsPSIjZWM1ODU4IiBzdHJva2U9IiNiNjQ2NDYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=="
  );
  blocksMedia.set(
    "rotate-left.svg",
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIGlkPSJyb3RhdGUtY2xvY2t3aXNlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHN0eWxlPi5jbHMtMXtmaWxsOiMzZDc5Y2M7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PHRpdGxlPnJvdGF0ZS1jbG9ja3dpc2U8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIwLjM0LDE4LjIxYTEwLjI0LDEwLjI0LDAsMCwxLTguMSw0LjIyLDIuMjYsMi4yNiwwLDAsMS0uMTYtNC41MmgwYTUuNTgsNS41OCwwLDAsMCw0LjI1LTIuNTMsNS4wNiw1LjA2LDAsMCwwLC41NC00LjYyQTQuMjUsNC4yNSwwLDAsMCwxNS41NSw5YTQuMzEsNC4zMSwwLDAsMC0yLS44QTQuODIsNC44MiwwLDAsMCwxMC40LDlsMS4xMiwxLjQxQTEuNTksMS41OSwwLDAsMSwxMC4zNiwxM0gyLjY3YTEuNTYsMS41NiwwLDAsMS0xLjI2LS42M0ExLjU0LDEuNTQsMCwwLDEsMS4xMywxMUwyLjg1LDMuNTdBMS41OSwxLjU5LDAsMCwxLDQuMzgsMi40LDEuNTcsMS41NywwLDAsMSw1LjYyLDNMNi43LDQuMzVhMTAuNjYsMTAuNjYsMCwwLDEsNy43Mi0xLjY4QTkuODgsOS44OCwwLDAsMSwxOSw0LjgxLDkuNjEsOS42MSwwLDAsMSwyMS44Myw5LDEwLjA4LDEwLjA4LDAsMCwxLDIwLjM0LDE4LjIxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE5LjU2LDE3LjY1YTkuMjksOS4yOSwwLDAsMS03LjM1LDMuODMsMS4zMSwxLjMxLDAsMCwxLS4wOC0yLjYyLDYuNTMsNi41MywwLDAsMCw1LTIuOTIsNi4wNSw2LjA1LDAsMCwwLC42Ny01LjUxLDUuMzIsNS4zMiwwLDAsMC0xLjY0LTIuMTYsNS4yMSw1LjIxLDAsMCwwLTIuNDgtMUE1Ljg2LDUuODYsMCwwLDAsOSw4Ljg0TDEwLjc0LDExYS41OS41OSwwLDAsMS0uNDMsMUgyLjdhLjYuNiwwLDAsMS0uNi0uNzVMMy44MSwzLjgzYS41OS41OSwwLDAsMSwxLS4yMWwxLjY3LDIuMWE5LjcxLDkuNzEsMCwwLDEsNy43NS0yLjA3LDguODQsOC44NCwwLDAsMSw0LjEyLDEuOTIsOC42OCw4LjY4LDAsMCwxLDIuNTQsMy43MkE5LjE0LDkuMTQsMCwwLDEsMTkuNTYsMTcuNjVaIi8+PC9zdmc+"
  );
  blocksMedia.set(
    "rotate-right.svg",
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIGlkPSJyb3RhdGUtY291bnRlci1jbG9ja3dpc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzNkNzljYzt9LmNscy0ye2ZpbGw6I2ZmZjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnJvdGF0ZS1jb3VudGVyLWNsb2Nrd2lzZTwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjIuNjgsMTIuMmExLjYsMS42LDAsMCwxLTEuMjcuNjNIMTMuNzJhMS41OSwxLjU5LDAsMCwxLTEuMTYtMi41OGwxLjEyLTEuNDFhNC44Miw0LjgyLDAsMCwwLTMuMTQtLjc3LDQuMzEsNC4zMSwwLDAsMC0yLC44LDQuMjUsNC4yNSwwLDAsMC0xLjM0LDEuNzMsNS4wNiw1LjA2LDAsMCwwLC41NCw0LjYyQTUuNTgsNS41OCwwLDAsMCwxMiwxNy43NGgwYTIuMjYsMi4yNiwwLDAsMS0uMTYsNC41MkExMC4yNSwxMC4yNSwwLDAsMSwzLjc0LDE4LDEwLjE0LDEwLjE0LDAsMCwxLDIuMjUsOC43OCw5LjcsOS43LDAsMCwxLDUuMDgsNC42NCw5LjkyLDkuOTIsMCwwLDEsOS42NiwyLjVhMTAuNjYsMTAuNjYsMCwwLDEsNy43MiwxLjY4bDEuMDgtMS4zNWExLjU3LDEuNTcsMCwwLDEsMS4yNC0uNiwxLjYsMS42LDAsMCwxLDEuNTQsMS4yMWwxLjcsNy4zN0ExLjU3LDEuNTcsMCwwLDEsMjIuNjgsMTIuMloiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yMS4zOCwxMS44M0gxMy43N2EuNTkuNTksMCwwLDEtLjQzLTFsMS43NS0yLjE5YTUuOSw1LjksMCwwLDAtNC43LTEuNTgsNS4wNyw1LjA3LDAsMCwwLTQuMTEsMy4xN0E2LDYsMCwwLDAsNywxNS43N2E2LjUxLDYuNTEsMCwwLDAsNSwyLjkyLDEuMzEsMS4zMSwwLDAsMS0uMDgsMi42Miw5LjMsOS4zLDAsMCwxLTcuMzUtMy44MkE5LjE2LDkuMTYsMCwwLDEsMy4xNyw5LjEyLDguNTEsOC41MSwwLDAsMSw1LjcxLDUuNCw4Ljc2LDguNzYsMCwwLDEsOS44MiwzLjQ4YTkuNzEsOS43MSwwLDAsMSw3Ljc1LDIuMDdsMS42Ny0yLjFhLjU5LjU5LDAsMCwxLDEsLjIxTDIyLDExLjA4QS41OS41OSwwLDAsMSwyMS4zOCwxMS44M1oiLz48L3N2Zz4="
  );
  blocksMedia.set(
    "dropdown-arrow.svg",
    "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMi43MSIgaGVpZ2h0PSI4Ljc5IiB2aWV3Qm94PSIwIDAgMTIuNzEgOC43OSI+PHRpdGxlPmRyb3Bkb3duLWFycm93PC90aXRsZT48ZyBvcGFjaXR5PSIwLjEiPjxwYXRoIGQ9Ik0xMi43MSwyLjQ0QTIuNDEsMi40MSwwLDAsMSwxMiw0LjE2TDguMDgsOC4wOGEyLjQ1LDIuNDUsMCwwLDEtMy40NSwwTDAuNzIsNC4xNkEyLjQyLDIuNDIsMCwwLDEsMCwyLjQ0LDIuNDgsMi40OCwwLDAsMSwuNzEuNzFDMSwwLjQ3LDEuNDMsMCw2LjM2LDBTMTEuNzUsMC40NiwxMiwuNzFBMi40NCwyLjQ0LDAsMCwxLDEyLjcxLDIuNDRaIiBmaWxsPSIjMjMxZjIwIi8+PC9nPjxwYXRoIGQ9Ik02LjM2LDcuNzlhMS40MywxLjQzLDAsMCwxLTEtLjQyTDEuNDIsMy40NWExLjQ0LDEuNDQsMCwwLDEsMC0yYzAuNTYtLjU2LDkuMzEtMC41Niw5Ljg3LDBhMS40NCwxLjQ0LDAsMCwxLDAsMkw3LjM3LDcuMzdBMS40MywxLjQzLDAsMCwxLDYuMzYsNy43OVoiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
  );

  addon.tab.createBlockContextMenu(
    (items) => {
      if (addon.self.disabled) return items;
      let svgchild = document.querySelector("svg.blocklySvg g.blocklyBlockCanvas");

      const pasteItemIndex = items.findIndex((obj) => obj._isDevtoolsFirstItem);
      const insertBeforeIndex =
        pasteItemIndex !== -1
          ? // If "paste" button exists, add own items before it
            pasteItemIndex
          : // If there's no such button, insert at end
            items.length;

      items.splice(
        insertBeforeIndex,
        0,
        {
          enabled: !!svgchild?.childNodes?.length,
          text: msg("export_all_to_SVG"),
          callback: () => {
            exportBlock(false);
          },
          separator: true,
        },
        {
          enabled: !!svgchild?.childNodes?.length,
          text: msg("export_all_to_PNG"),
          callback: () => {
            exportBlock(true);
          },
          separator: false,
        }
      );

      return items;
    },
    { workspace: true }
  );
  addon.tab.createBlockContextMenu(
    (items, block) => {
      if (addon.self.disabled) return items;
      const makeSpaceItemIndex = items.findIndex((obj) => obj._isDevtoolsFirstItem);
      const insertBeforeIndex =
        makeSpaceItemIndex !== -1
          ? // If "make space" button exists, add own items before it
            makeSpaceItemIndex
          : // If there's no such button, insert at end
            items.length;

      items.splice(
        insertBeforeIndex,
        0,
        {
          enabled: true,
          text: msg("export_selected_to_SVG"),
          callback: () => {
            exportBlock(false, block);
          },
          separator: true,
        },
        {
          enabled: true,
          text: msg("export_selected_to_PNG"),
          callback: () => {
            exportBlock(true, block);
          },
          separator: false,
        }
      );

      return items;
    },
    { blocks: true }
  );

  function exportBlock(isExportPNG, block) {
    let svg;
    if (block) {
      svg = selectedBlocks(isExportPNG, block);
    } else {
      svg = allBlocks(isExportPNG);
    }
    // resolve nbsp whitespace
    svg.querySelectorAll("text").forEach((text) => {
      text.innerHTML = text.innerHTML.replace(/&nbsp;/g, " ");
    });
    // resolve image path
    let scratchURL = window.location.origin;

    svg.querySelectorAll("image").forEach((item) => {
      let builtinSvgData = blocksMedia.get(
        item.getAttribute("xlink:href").substring(item.getAttribute("xlink:href").lastIndexOf("/") + 1)
      );
      if (builtinSvgData) {
        // replace svg file path (official) to inline svg
        item.setAttribute("xlink:href", builtinSvgData);
      } else if (item.getAttribute("xlink:href").indexOf("/static/") === 0) {
        // replace link path for third party website
        item.setAttribute("xlink:href", scratchURL + item.getAttribute("xlink:href").slice(0));
      } else if (item.getAttribute("xlink:href").indexOf("./static/") === 0) {
        item.setAttribute("xlink:href", scratchURL + item.getAttribute("xlink:href").slice(1));
      } else if (item.getAttribute("xlink:href").indexOf("static/") === 0) {
        item.setAttribute("xlink:href", scratchURL + "/" + item.getAttribute("xlink:href"));
      }
    });
    if (!isExportPNG) {
      exportData(new XMLSerializer().serializeToString(svg));
    } else {
      exportPNG(svg);
    }
  }

  function selectedBlocks(isExportPNG, block) {
    let svg = exSVG.cloneNode();

    let svgchild = block.svgGroup_;
    svgchild = svgchild.cloneNode(true);
    let dataShapes = svgchild.getAttribute("data-shapes");
    svgchild.setAttribute(
      "transform",
      `translate(0,${dataShapes === "hat" ? "18" : "0"}) ${isExportPNG ? "scale(2)" : ""}`
    );
    setCSSVars(svg);
    svg.append(makeStyle());
    svg.append(svgchild);
    return svg;
  }

  function allBlocks(isExportPNG) {
    let svg = exSVG.cloneNode();

    let svgchild = document.querySelector("svg.blocklySvg g.blocklyBlockCanvas");
    svgchild = svgchild.cloneNode(true);

    let xArr = [];
    let yArr = [];

    svgchild.childNodes.forEach((g) => {
      let x = g.getAttribute("transform").match(/translate\((.*?),(.*?)\)/)[1] || 0;
      let y = g.getAttribute("transform").match(/translate\((.*?),(.*?)\)/)[2] || 0;
      xArr.push(x * (isExportPNG ? 2 : 1));
      yArr.push(y * (isExportPNG ? 2 : 1));
      g.style.display = ""; // because of TW scratch-blocks changes
    });

    svgchild.setAttribute(
      "transform",
      `translate(${-Math.min(...xArr)},${-Math.min(...yArr) + 18 * (isExportPNG ? 2 : 1)}) ${
        isExportPNG ? "scale(2)" : ""
      }`
    );
    setCSSVars(svg);
    svg.append(makeStyle());
    svg.append(svgchild);
    return svg;
  }

  function exportData(text) {
    const saveLink = document.createElement("a");
    document.body.appendChild(saveLink);

    const data = new Blob([text], { type: "text" });
    const url = window.URL.createObjectURL(data);
    saveLink.href = url;

    // File name: project-DATE-TIME
    const date = new Date();
    const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
    saveLink.download = `block_${timestamp}.svg`;
    saveLink.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(saveLink);
  }

  function exportPNG(svg) {
    const serializer = new XMLSerializer();

    const iframe = document.createElement("iframe");
    // iframe.style.display = "none"
    document.body.append(iframe);
    iframe.contentDocument.write(serializer.serializeToString(svg));
    let { width, height } = iframe.contentDocument.body.querySelector("svg g").getBoundingClientRect();
    height = height + 20 * 2; //  hat block height restore
    svg.setAttribute("width", width + "px");
    svg.setAttribute("height", height + "px");

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    let img = document.createElement("img");

    img.setAttribute(
      "src",
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(serializer.serializeToString(svg))))
    );
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      // Now is done
      let dataURL = canvas.toDataURL("image/png");
      let link = document.createElement("a");
      const date = new Date();
      const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;

      link.download = `block_${timestamp}.png`;
      link.href = dataURL;
      link.click();
      iframe.remove();
    };
  }
}

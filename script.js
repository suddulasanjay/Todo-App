let localStroage = window.localStorage;
// localStroage.clear();
document.addEventListener("DOMContentLoaded", (e) => {
  if (localStroage.getItem("content") !== undefined) {
    let prevContent = JSON.parse(localStroage.getItem("content"));
    for (let contentDivData of prevContent) {
      // console.log(contentDivData);
      let tags = new Set();
      // console.log(typeof contentDivData[2]);
      for (let i = 0; i < contentDivData[2].length; i++)
        tags.add(contentDivData[2][i]);
      let contentDiv = generateContentDiv(
        contentDivData[0],
        contentDivData[1],
        tags
      );
      content.append(contentDiv);
      let checkbox = contentDiv.querySelector("#contentDone");
      if (contentDivData[3]) checkbox.click();
    }

    // if (flag) hideDone.click();
  }
  if (localStroage.getItem("hideDoneStatus") === "true") {
    let hideDone = document.getElementById("hideDone");
    hideDone.click();
  }
});
window.addEventListener("beforeunload", (e) => {
  if (content.hasChildNodes()) {
    let childs = [];
    for (let contentDiv of content.children) {
      let contentTitleHeading = contentDiv.querySelector("h2");
      let contentTaskParas =
        contentDiv.getElementsByClassName("contentTaskPara");
      let contentTaskPara = contentTaskParas[0];
      let tagsArr = [];
      let done = contentDiv.classList.contains("done");

      for (let ele of arr) {
        if (contentDiv.classList.contains(ele)) tagsArr.push(ele);
      }
      // console.log(tagsArr);
      childs.push([
        contentTitleHeading.textContent,
        contentTaskPara.textContent,
        tagsArr,
        done,
      ]);
    }
    localStroage.setItem("content", JSON.stringify(childs));
  }
  let hideDone = document.getElementById("hideDone");
  localStroage.setItem("hideDoneStatus", JSON.stringify(hideDone.checked));
});

let root = document.getElementById("root");
let title = document.createElement("div"),
  main = document.createElement("div");
root.append(title, main);
title.classList.add("title");
main.classList.add("main");
let options = document.createElement("div"),
  content = document.createElement("div");
main.append(options, content);
options.classList.add("options");
content.classList.add("content");
let arr = ["work", "study", "entertainment", "family"];
let activeTags = new Set();
//tag Logos :
function tagLogo(type) {
  let tagIcon = document.createElement("div");
  tagIcon.className = "tagIcon";
  if (type === "work") {
    tagIcon.style.backgroundColor = "#D2CEFF";
  }
  if (type === "study") {
    tagIcon.style.backgroundColor = "#D1E5F7";
  }
  if (type === "entertainment") {
    tagIcon.style.backgroundColor = "#FFCECE";
  }
  if (type === "family") {
    tagIcon.style.backgroundColor = "#DAF2D6";
  }
  return tagIcon;
}
//Input Task div :
function generateInputTaskDiv(
  type,
  oldContentDiv,
  title,
  description,
  tags = new Set()
) {
  let InputTaskDiv = document.createElement("div");
  InputTaskDiv.className = "InputTaskDiv";
  let inputHeaderDiv = document.createElement("div");
  inputHeaderDiv.className = "inputHeaderDiv";
  let inputAddButton = document.createElement("button");
  inputAddButton.textContent = type;
  inputAddButton.className = "inputAddButton";
  inputAddButton.addEventListener("click", (e) => {
    let contentDiv = generateContentDiv(title, description, tags);
    if (type === "Add") content.append(contentDiv);
    else oldContentDiv.replaceWith(contentDiv);
    InputTaskDiv.hidden = true;
    root.style.backgroundColor = "";
  });
  let inputCancelButton = document.createElement("button");
  inputCancelButton.textContent = "Cancel";
  inputCancelButton.className = "inputCancelButton";
  inputCancelButton.addEventListener("click", (e) => {
    root.style.backgroundColor = "";
    InputTaskDiv.remove();
  });
  inputHeaderDiv.append(inputCancelButton, inputAddButton);
  let inputMainDiv = document.createElement("div");
  inputMainDiv.className = "inputMainDiv";
  let inputTitleLabel = document.createElement("label");
  inputTitleLabel.for = "inputTitle";
  inputTitleLabel.innerHTML = "<h2>Title</h2>";
  let inputTitleText = document.createElement("input");
  inputTitleText.type = "text";
  if (title) inputTitleText.value = title;
  inputTitleText.id = "inputTitleText";
  inputTitleText.placeholder = "the task title ...";
  inputTitleText.addEventListener("change", (e) => {
    title = e.target.value;
  });
  let inputDescriptionLabel = document.createElement("label");
  inputDescriptionLabel.for = "inputDescription";
  inputDescriptionLabel.innerHTML = "<h2>Description</h2>";
  let inputDescriptionText = document.createElement("textarea");
  inputDescriptionText.id = "inputDescriptionText";
  if (description) inputDescriptionText.value = description;
  inputDescriptionText.placeholder =
    "the detailed description about the task ...";
  inputDescriptionText.addEventListener("change", (e) => {
    description = e.target.value;
  });
  inputMainDiv.append(
    inputTitleLabel,
    inputTitleText,
    inputDescriptionLabel,
    inputDescriptionText
  );
  let inputTagsDiv = document.createElement("div");
  inputTagsDiv.className = "inputTagsDiv";
  let inputTagsHeading = document.createElement("h2");
  inputTagsHeading.className = "inputTagsHeading";
  inputTagsHeading.textContent = "Tags";
  inputTagsDiv.append(inputTagsHeading);
  let inputTagsWrapper = document.createElement("div");
  inputTagsWrapper.className = "inputTagsWrapper";
  for (let i = 0; i < arr.length; i++) {
    let span = document.createElement("span");
    let tagIcon = tagLogo(arr[i]);
    let textNode = document.createTextNode(arr[i]);
    span.append(tagIcon, textNode);
    span.className = "inputOptionsSpan";
    let alreadyClicked = false;
    span.addEventListener("click", (e) => {
      if (alreadyClicked === true) {
        // console.log("click");
        tags.delete(span.textContent);
        span.style.backgroundColor = "";
        alreadyClicked = false;
      } else {
        tags.add(span.textContent);
        // console.log("click");
        span.style.backgroundColor = "rgb(245 245 245)";
        alreadyClicked = true;
      }
    });
    inputTagsWrapper.append(span);
    if (tags.has(arr[i])) span.click();
  }
  inputTagsDiv.append(inputTagsWrapper);
  InputTaskDiv.append(inputHeaderDiv, inputMainDiv, inputTagsDiv);
  InputTaskDiv.hidden = true;
  root.append(InputTaskDiv);
  return InputTaskDiv;
}
function displayActiveDivs(activeTags) {
  for (let contentDiv of content.children) {
    let displayDiv = false;
    activeTags.forEach((tag) => {
      if (contentDiv.classList.contains(tag)) {
        displayDiv = true;
      }
    });
    if (activeTags.size === 0) displayDiv = true;
    if (displayDiv === true) {
      contentDiv.hidden = false;
    } else {
      contentDiv.hidden = true;
    }
  }
}
//title :
let topheading = document.createElement("h1"),
  topbutton = document.createElement("div");
topheading.textContent = "todo";
topheading.className = "topheading";
topbutton.innerHTML = '<span class="material-symbols-outlined">add</span>';
topbutton.className = "topbutton";
title.append(topheading, topbutton);
//Top Button Functionality :
topbutton.addEventListener("click", (e) => {
  let inputtaskDivs = root.querySelectorAll(".InputTaskDiv");
  if (
    inputtaskDivs.length === 0 ||
    inputtaskDivs[inputtaskDivs.length - 1].hidden === true
  ) {
    let InputTaskDiv = generateInputTaskDiv("Add");
    root.style.backgroundColor = "#B2AFA1";
    InputTaskDiv.hidden = false;
  }
});

//options :

let ul = document.createElement("ul");
ul.className = "optionsUl";
for (let i = 0; i < arr.length; i++) {
  let li = document.createElement("li");
  li.tabIndex = "0";
  let tagIcon = tagLogo(arr[i]);
  let textNode = document.createTextNode(arr[i]);
  let optionsCheckBox = document.createElement("input");
  optionsCheckBox.type = "checkbox";
  optionsCheckBox.id = "optionsCheckBox";
  li.append(tagIcon, optionsCheckBox, textNode);
  li.className = "optionsLi";
  li.addEventListener("click", (e) => {
    optionsCheckBox.click();
  });
  optionsCheckBox.addEventListener("change", (e) => {
    if (activeTags.has(arr[i])) {
      activeTags.delete(arr[i]);
      li.style.backgroundColor = "";
    } else {
      activeTags.add(arr[i]);
      li.style.backgroundColor = "rgb(245 245 245)";
    }
    displayActiveDivs(activeTags);
  });
  ul.append(li);
}
let hideDoneDiv = document.createElement("div");
hideDoneDiv.id = "hideDoneDiv";
let hideDoneCheckbox = document.createElement("input");
hideDoneCheckbox.type = "checkbox";
hideDoneCheckbox.id = "hideDone";
hideDoneCheckbox.addEventListener("change", (e) => {
  let doneContentDivs = content.querySelectorAll(".done");
  for (let doneContentDiv of doneContentDivs) {
    doneContentDiv.classList.toggle("hideDone");
  }
});
let hideDoneLabel = document.createElement("label");
hideDoneLabel.for = "hideDone";
hideDoneLabel.textContent = "Hide Done Tasks";
hideDoneDiv.append(hideDoneCheckbox, hideDoneLabel);
options.append(ul, hideDoneDiv);
//Content :
function generateContentDiv(
  title = "The first task",
  description,
  tags = new Set()
) {
  let contentDiv = document.createElement("div");
  let contentTitleDiv = document.createElement("div");
  contentTitleDiv.className = "contentTitleDiv";
  let contentTitleHeading = document.createElement("h2");
  contentTitleHeading.textContent = title;
  let contentTitleButton = document.createElement("div");
  contentTitleButton.className = "contentTitleButton";
  contentTitleButton.height = "fit-content";
  contentTitleButton.innerHTML =
    '<span class="material-symbols-outlined">more_horiz</span>';

  contentTitleDiv.append(contentTitleHeading, contentTitleButton);
  let editContentDiv = document.createElement("div");
  editContentDiv.className = "editContentDiv";
  let editContentDivEditBtn = document.createElement("p");
  editContentDivEditBtn.className = "editContentDivEditBtn";
  editContentDivEditBtn.textContent = "Edit ...";
  editContentDivEditBtn.addEventListener("click", (e) => {
    let InputTaskDiv = generateInputTaskDiv(
      "Edit",
      contentDiv,
      contentTitleHeading.textContent,
      contentTaskPara.textContent,
      tags
    );
    editContentDiv.hidden = true;
    root.style.backgroundColor = "#B2AFA1";
    InputTaskDiv.hidden = false;
  });
  let editContentDivHr = document.createElement("hr");
  let editContentDivDeleteBtn = document.createElement("p");
  editContentDivDeleteBtn.className = "editContentDivDeleteBtn";
  editContentDivDeleteBtn.textContent = "Delete";
  editContentDivDeleteBtn.addEventListener("click", (e) => {
    contentDiv.remove();
  });
  editContentDiv.append(
    editContentDivEditBtn,
    editContentDivHr,
    editContentDivDeleteBtn
  );
  editContentDiv.hidden = true;
  contentTitleButton.addEventListener("click", (e) => {
    if (editContentDiv.hidden) editContentDiv.hidden = false;
    else editContentDiv.hidden = true;
  });
  let contentTaskPara = document.createElement("p");
  contentTaskPara.className = "contentTaskPara";
  contentTaskPara.textContent = description
    ? description
    : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi eos reprehenderit sint quibusdam nobis beatae, sapiente rerum, animi, soluta rem nulla officia nesciunt? Vero rerum impedit nisi veritatis, dolorem nulla.";
  let contentFooter = document.createElement("div");
  contentFooter.className = "contentFooter";
  let tagsDiv = document.createElement("div");
  tagsDiv.className = "tagsDiv";
  // console.log(tags instanceof Set);
  tags.forEach((tag) => {
    contentDiv.classList.add(tag);
    let span = document.createElement("span");
    span.append(tagLogo(tag));
    span.className = "inputOptionsSpan";
    span.addEventListener("click", (e) => {
      tags.add(span.textContent);
      // console.log("click");
      span.style.backgroundColor = "rgb(245 245 245)";
    });
    tagsDiv.append(span);
  });
  contentDiv.classList.add("contentDiv");
  let contentDone = document.createElement("div");
  let contentDoneCheckbox = document.createElement("input");
  contentDoneCheckbox.type = "checkbox";
  contentDoneCheckbox.id = "contentDone";
  contentDoneCheckbox.addEventListener("change", (e) => {
    if (contentDiv.classList.contains("done")) {
      contentDiv.classList.remove("done");
      contentTitleHeading.style.textDecoration = "";
      contentTaskPara.style.textDecoration = "";
    } else {
      contentDiv.classList.add("done");
      contentTitleHeading.style.textDecoration = "line-through";
      contentTaskPara.style.textDecoration = "line-through";
      let hideDone = document.getElementById("hideDone");
      if (hideDone.checked) contentDiv.classList.add("hideDone");
    }
  });
  let contentDoneLabel = document.createElement("label");
  contentDoneLabel.for = "contentDone";
  contentDoneLabel.textContent = "Done";
  contentDone.append(contentDoneCheckbox, contentDoneLabel);
  contentFooter.append(tagsDiv, contentDone);
  contentDiv.append(
    contentTitleDiv,
    editContentDiv,
    contentTaskPara,
    contentFooter
  );
  // console.log(contentDiv.outerHTML);
  return contentDiv;
}

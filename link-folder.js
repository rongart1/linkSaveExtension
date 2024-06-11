document.addEventListener("DOMContentLoaded", function() {
    localStorage.setItem("last-visit", window.location.href);
    // Initial load of saved links
    reLoadLinkList();
});

// Variable Declarations
const params = new URLSearchParams(window.location.search);
const folderName = params.get("folder");
const myStringLinks = localStorage.getItem(`${folderName}-Links`);
let myLinksArr = myStringLinks ? JSON.parse(myStringLinks) : [];

const savePageBtn = document.getElementById("save-page-btn");
const deleteAllBtn = document.getElementById("delete-all");
const backBtn = document.getElementById("back-button");
const savedPagesList = document.getElementById("saved-pages");
document.getElementById("folder-name").innerHTML = `${folderName} links`;

// Event Listeners
savePageBtn.addEventListener("click", addPage);
deleteAllBtn.addEventListener("click", deleteAll);
backBtn.addEventListener("click", goBack);

function addPage() {
    browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
        const currentPageUrl = tabs[0].url;
        const currentPageTitle = tabs[0].title;

        if (!myLinksArr.some(link => link.url === currentPageUrl)) {
            myLinksArr.push({ url: currentPageUrl, title: currentPageTitle });
            localStorage.setItem(`${folderName}-Links`, JSON.stringify(myLinksArr));
            reLoadLinkList();
        } else {
            alert("Page already saved");
        }
    });
}

function reLoadLinkList() {
    savedPagesList.innerHTML = linkListToHtml(myLinksArr);
    addRemoveEventListeners();
    addEditEventListeners();
}

function linkListToHtml(linksList) {
    return linksList.map((link, index) => `
        <li>
            <a href="${link.url}" target="_blank">${link.title}</a>
            <button class="remove-btn action-btn" data-index="${index}">
                <img class="action-icon" src="icons/delete.png">
            </button>
            <button class="edit-btn action-btn" data-index="${index}">
                <img class="action-icon" src="icons/edit.png">
            </button>
        </li>
    `).join('');
}

function deleteAll() {
    localStorage.removeItem(`${folderName}-Links`);
    myLinksArr = [];
    reLoadLinkList();
}

function removeItem(event) {
    const index = event.target.closest(".remove-btn").dataset.index;
    myLinksArr.splice(index, 1);
    localStorage.setItem(`${folderName}-Links`, JSON.stringify(myLinksArr));
    reLoadLinkList();
}

function changeName(event) {
    const index = event.target.closest(".edit-btn").dataset.index;
    const currentName = myLinksArr[index].title;
    const newName = window.prompt("Change link name", currentName);
    if (newName && newName.trim() !== "") {
        myLinksArr[index].title = newName.trim();
        localStorage.setItem(`${folderName}-Links`, JSON.stringify(myLinksArr));
        reLoadLinkList();
    }
}

function addRemoveEventListeners() {
    const removeBtns = document.querySelectorAll(".remove-btn");
    removeBtns.forEach(btn => {
        btn.addEventListener("click", removeItem);
    });
}

function addEditEventListeners() {
    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(btn => {
        btn.addEventListener("click", changeName);
    });
}

function goBack() {
    window.location.href = "index.html";
    localStorage.removeItem("last-visit");
}

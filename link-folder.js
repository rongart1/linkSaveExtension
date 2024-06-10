document.addEventListener("DOMContentLoaded", function() {
    localStorage.setItem("last-visit",window.location.href);
});
const params = new URLSearchParams(window.location.search);
const folderName = params.get("folder");

const myStringLinks = localStorage.getItem(`${folderName}-Links`);
let myLinksArr = myStringLinks ? JSON.parse(myStringLinks) : [];

let savePageBtn = document.getElementById("save-page-btn");
let deleteAllBtn = document.getElementById("delete-all");
let backBtn = document.getElementById("back-button");


savePageBtn.addEventListener("click", addPage);
deleteAllBtn.addEventListener("click", deleteAll);
backBtn.addEventListener("click",goBack);
const savedPagesList = document.getElementById("saved-pages");
document.getElementById("folder-name").innerHTML=`${folderName} links`

function addPage() {
    browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
        const currentPageUrl = tabs[0].url;
        if (!myLinksArr.includes(currentPageUrl)) {
            myLinksArr.push(currentPageUrl);
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
}

function linkListToHtml(list) {
    return list.map((item, index) => {
        return `<li><button class="remove-btn" data-index="${index}"><img class="delete-icon" src="icons/delete.png"></button><a href="${item}" target="_blank">${item}</a></li>`;
    }).join('');
}

function deleteAll() {
    localStorage.removeItem(`${folderName}-Links`);
    myLinksArr = [];
    reLoadLinkList();
}

function removeItem(event) {
    const index = event.target.dataset.index;
    myLinksArr.splice(index, 1);
    localStorage.setItem(`${folderName}-Links`, JSON.stringify(myLinksArr));
    reLoadLinkList();
}

function addRemoveEventListeners() {
    const removeBtns = document.querySelectorAll(".remove-btn");
    removeBtns.forEach(btn => {
        btn.addEventListener("click", removeItem);
    });
}


function goBack(){
    window.location.href = "index.html";
    localStorage.removeItem("last-visit");
}
// Initial load of saved links
reLoadLinkList();

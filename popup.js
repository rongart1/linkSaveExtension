const myStringLinks = localStorage.getItem("myLinks");
let myLinksArr = myStringLinks ? JSON.parse(myStringLinks) : [];
let savePageBtn = document.getElementById("save-page-btn");
let deletAllBtn = document.getElementById("delete-all");

deletAllBtn.addEventListener("click", deleteAll);
savePageBtn.addEventListener("click", addPage);

function addPage() {
    browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
        const currentPageUrl = tabs[0].url;
        if (!myLinksArr.includes(currentPageUrl)) {
            myLinksArr.push(currentPageUrl);
            localStorage.setItem("myLinks", JSON.stringify(myLinksArr));
            reLoadLinkList();
        }
        else{
            alert("already in saved");
        }
    });
}


let savedPagesList = document.getElementById("saved-pages");

function reLoadLinkList() {
    savedPagesList.innerHTML = linkListToHtml(myLinksArr);
    addRemoveEventListeners();
}

function linkListToHtml(list) {
    return list.map((item, index) => {
        return `<li><button class="remove-btn"><img class="delete-icon" src = "icons/delete.png"></button><a href="${item}" target="_blank">${item}</a></li>`;
    }).join('');
}

function deleteAll() {
    localStorage.removeItem("myLinks");
    myLinksArr = [];
    reLoadLinkList();
}

function removeItem(event) {
    const index = event.target.dataset.index;
    myLinksArr.splice(index, 1);
    localStorage.setItem("myLinks", JSON.stringify(myLinksArr));
    reLoadLinkList();
}

function addRemoveEventListeners() {
    const removeBtns = document.querySelectorAll(".remove-btn");
    removeBtns.forEach(btn => {
        btn.addEventListener("click", removeItem);
    });
}

// Initial load of saved links
reLoadLinkList();

document.addEventListener("DOMContentLoaded", function() {
    const lastVisit = localStorage.getItem("last-visit");
    if (lastVisit && lastVisit !== window.location.href) {
        window.location.href = lastVisit;
    }

    // Initial load to display existing folders
    reload();
});

// Variable Declarations
const createFolderBtn = document.getElementById("create-link-folder-btn");
const nameInput = document.getElementById("folder-name-input");
const folderList = document.getElementById("link-folders");
let myFolders = localStorage.getItem("link-folders") ? JSON.parse(localStorage.getItem("link-folders")) : [];

// Event Listeners
createFolderBtn.addEventListener("click", createFolder);

function createFolder() {
    const folderName = nameInput.value.trim();
    if (!folderName) {
        alert("No folder name");
        return;
    }
    if (!myFolders.includes(folderName)) {
        myFolders.push(folderName);
        reload();
    } else {
        alert("Folder already exists");
    }
}

function reload() {
    localStorage.setItem("link-folders", JSON.stringify(myFolders));
    folderList.innerHTML = renderFoldersToHtml(myFolders);
    addFolderBtnActions();
    addEditEventListeners();
    addRemoveEventListeners();
}

function renderFoldersToHtml(folders) {
    return folders.map((folderName, index) => `
        <li>
            <button id="${folderName}" class="folder-btn">${folderName}</button>
            <button class="remove-btn action-btn" data-index="${index}">
                <img class="action-icon" src="icons/delete.png">
            </button>
            <button class="edit-btn action-btn" data-index="${index}">
                <img class="action-icon" src="icons/edit.png">
            </button>
        </li>`).join('');
}

function addFolderBtnActions() {
    const folderBtns = document.querySelectorAll(".folder-btn");
    folderBtns.forEach(btn => {
        btn.addEventListener("click", () => goToFolder(btn.id));
    });
}

function goToFolder(btnId) {
    window.location.href = `link-folder.html?folder=${btnId}`;
}

function addEditEventListeners() {
    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(btn => {
        btn.addEventListener("click", changeName);
    });
}

function addRemoveEventListeners() {
    const removeBtns = document.querySelectorAll(".remove-btn");
    removeBtns.forEach(btn => {
        btn.addEventListener("click", removeItem);
    });
}

function changeName(event) {
    const index = event.target.closest(".edit-btn").dataset.index;
    const currentName = myFolders[index];
    const newName = window.prompt("Change folder name", currentName);
    if (newName && newName.trim() !== "") {
        myFolders[index] = newName.trim();
        reload();
    }
}

function removeItem(event) {
    const index = event.target.closest(".remove-btn").dataset.index;
    const folder = myFolders.splice(index, 1);
    localStorage.removeItem(`${folder}-Links`);
    reload();
}

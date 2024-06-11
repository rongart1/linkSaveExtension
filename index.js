document.addEventListener("DOMContentLoaded", function() {
    const lastVisit = localStorage.getItem("last-visit");
    if(lastVisit && lastVisit != window.location.href){
        window.location.href = lastVisit;
    }
});

document.getElementById("create-link-folder-btn").addEventListener("click", createFolder);

const nameInput = document.getElementById("folder-name-input");
let myFolders = localStorage.getItem("link-folders") ? JSON.parse(localStorage.getItem("link-folders")) : [];
let folderList = document.getElementById("link-folders");

function createFolder() {
    const folderName = nameInput.value;
    if (!myFolders.includes(folderName) && folderName) {
        myFolders.push(folderName);
        reload();
    }else if(!folderName){
        alert("No folder name");
    } else{
        alert("Folder already exists");
    }
}

function reload() {
    localStorage.setItem("link-folders", JSON.stringify(myFolders));
    folderList.innerHTML = renderFoldersToHtml(myFolders);
    addFolderBtnActions();
    addEditEventListeners();
    addRemoveEventListeners(); // Add this line to re-add event listeners for remove buttons
}

function renderFoldersToHtml(folders) {
    return folders.map((folderName, index) => `
        <li>
        <button id="${folderName}" class="folder-btn">${folderName}</button>

            <button  class="remove-btn action-btn" data-index="${index}">
                <img class="action-icon" src="icons/delete.png">
            </button>

            <button class="edit-btn action-btn" data-index="${index}">
                        <img class="action-icon" src="icons/edit.png">
            </button>
        
            
        </li>`).join('');
}

function removeItem(event) {
    const index = event.target.dataset.index;
    const folder =myFolders.splice(index, 1);
    localStorage.removeItem(`${folder}-Links`)
    reload();
}

function changeName(event){
    const index = event.target.dataset.index;
    const input = window.prompt("Change folder name", myFolders[index]);
    const prev = myFolders[index] 
    myFolders[index] = input? input : prev;
    reload();
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

function addFolderBtnActions(){
    const folderBtns = document.querySelectorAll(".folder-btn");
    folderBtns.forEach(btn => {
        btn.addEventListener("click", () => goToFolder(btn.id));  // Use an arrow function to correctly bind the event handler
    });
}

function goToFolder(btnId){
    window.location.href = `link-folder.html?folder=${btnId}`;
}

// Initial load to display existing folders
reload();


let searchIcon = document.getElementById("search-button");
let searchBar = document.getElementById("search-bar");
let clearSearch = document.getElementById("clear-search");
let addCoursesButton = document.getElementById("add-courses");
let modal = document.getElementById("modal");
let closeModalButton = document.getElementById("close-modal");
let submitModal = document.getElementById("submit-button");
let modalTextArea = document.getElementById("modal-text");

let currentModalText;



searchIcon.addEventListener("click", () => {
    if(searchBar.className.includes('active') && searchBar.value) {
        console.log(searchBar.value);
    }
    else {
        searchBar.classList.toggle("active");
        clearSearch.classList.toggle("active");
    }
});

clearSearch.addEventListener("click", () => {
    if(!(searchBar.value)) {
        searchBar.classList.toggle("active");
        clearSearch.classList.toggle("active");
    }
    else {
        searchBar.value = "";
    }
});

addCoursesButton.addEventListener("click", () => {
    modal.classList.toggle("show");
});

closeModalButton.addEventListener("click", () => {
    modal.classList.toggle("show");
});

submitModal.addEventListener("click", () => {
    if(modalTextArea.value) {
        modal.classList.toggle("show");
        currentModalText = modalTextArea.value;
        modalTextArea.value = "";
        console.log(currentModalText);
    }
});

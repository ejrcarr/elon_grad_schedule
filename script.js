
let searchIcon = document.getElementById("search-button");
let searchBar = document.getElementById("search-bar")
let mainCont = document.querySelector(".main-container");

searchIcon.addEventListener("click", () => {
    if(searchBar.className.includes('active') && searchBar.value) {
        console.log(searchBar.value);
    }
    else {
        searchBar.classList.toggle("active");
    }
    
});
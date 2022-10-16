
let searchIcon = document.getElementById("search-button");
let searchBar = document.getElementById("search-bar");
let clearSearch = document.getElementById("clear-search");
let addCoursesButton = document.getElementById("add-courses");
let modal = document.getElementById("modal");
let closeModalButton = document.getElementById("close-modal");
let submitModal = document.getElementById("submit-button");
let modalTextArea = document.getElementById("modal-text");

let currentModalText;

const scheduleContainer = document.getElementById("schedule-container");
    


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
    
    if(currentModalText) {
        arrayModalText = currentModalText.split("\n");
        generateYears(arrayModalText);
        // if(currentModalText.includes(",")) {

        // }
        // else {
            
        //     let courses = [];
        //     arrayModalText = currentModalText.split("\n");
        //     for (let entry of arrayModalText) {
        //         if(["Wint", "Summ", "Spri", "Fall"].entry.substring(0, 5) && entry != arrayModalText[0]) {
        //             let currentCoursesContainer = document.createElement("div");
        //             currentCoursesContainer.appendChild(courses);
        //             courses = [];
        //             if (entry.substring(0, 5) === "Fall") {
        //                 endYear = startYearentry.substring(5);
        //             }
        //         }
        //         else {
        //             courses.push(entry);
        //         }
        // }
        
        // }
        // console.log(currentModalText.split("\n"));
    }
});



// TODO make so years inbetween are included, even if isnt documented
function generateYears(arrayOfInput) {
    let defaultYears = document.querySelectorAll(".year");
    defaultYears.forEach(year => year.remove());

    const IS_COMMA_SEPARATED_INPUT = arrayOfInput[0].includes(",");

    if(IS_COMMA_SEPARATED_INPUT) {
        let currentYear = arrayOfInput[0].substring(arrayOfInput[0].length-4, arrayOfInput[0].length);
        const years = new Set();
        for(let element of arrayOfInput) {
            currentYear = Math.max(parseInt(element.substring(element.length-4, element.length)), currentYear);
            if(element.substring(element.length-9, element.length-5) === "Fall" && !years.has(currentYear)) {

                //TODO MAKE THIS A SEPARATE FUNCTION
                let yearRow = document.createElement("div");
                yearRow.classList.add("year");

                let yearContainer = document.createElement("div");

                years.add(currentYear);
                yearContainer.textContent = `${currentYear}-${parseInt(currentYear)+1}`;

                yearRow.appendChild(yearContainer);
                scheduleContainer.appendChild(yearRow);
            }
        }
    }
    else {
        for (let element of arrayOfInput) {
            if(element.substring(0,4) === "Fall") {

                //TODO MAKE THIS A SEPARATE FUNCTION
                let yearRow = document.createElement("div");
                yearRow.classList.add("year");

                let yearContainer = document.createElement("div");
                let currentYear = element.substring(5);
                yearContainer.textContent = `${currentYear}-${parseInt(currentYear)+1}`;

                yearRow.appendChild(yearContainer);
                scheduleContainer.appendChild(yearRow);
            }
        }
    }
}

function addSemesterCourses(container, arrayOfCourses) {
    for (let course of arrayOfCourses) {
        let div = document.createElement("div");
        div.textContent = course;
        container.appendChild(div);
    }
}

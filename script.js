
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
    }
    
    if(currentModalText) {
        currentModalText = currentModalText.trim();
        arrayModalText = currentModalText.split("\n");
        generateYears(arrayModalText);
        generateCourses(arrayModalText);
    }
});


function generateCourses(arrayOfModalText) {

    let semesters = new Set();
    semesters.add("Fall");
    semesters.add("Wint");
    semesters.add("Spri");
    semesters.add("Summ");

    let semesterToCourse = new Map();
    let currentSemester = arrayOfModalText[0];

    for (let line of arrayOfModalText) {
        let currentLine = line.substring(0,4);
        let NEW_SEMESTER = semesters.has(currentLine);

        if (NEW_SEMESTER) {
            currentSemester = line;
            if(!(line in semesterToCourse)) {
                semesterToCourse.set(currentSemester, new Set());
            }
        }
        else if(line) {
           semesterToCourse.set(currentSemester, semesterToCourse.get(currentSemester).add(line));
        }
    }

    for (let [key, value] of semesterToCourse) {

        let semesterAndCourse = key.split(" ");
        if (["Spri", "Summ", "Wint"].includes(key.substring(0,4))) {
            semesterAndCourse[1]--;
        }

        let yearRow = document.getElementById(semesterAndCourse[1]);

        let courseContainer = document.createElement("div");
        courseContainer.classList.add("course-container");
        courseContainer.classList.add(semesterAndCourse[0].toLowerCase());

        for (let course of value) {
            let courseDiv = document.createElement("div");
            courseDiv.classList.add("course");
            courseDiv.classList.add("wide-screen");
            courseDiv.classList.add(semesterAndCourse[0]);
            courseDiv.textContent = course;

            let mobile = document.createElement("div");
            mobile.classList.add("course");
            mobile.classList.add(semesterAndCourse[0]);
            mobile.classList.add("mobile");

            mobile.textContent = course.substring(0, 8);

            courseContainer.appendChild(courseDiv);
            courseContainer.appendChild(mobile);
        }

        if(yearRow) {
            yearRow.appendChild(courseContainer);
        }
    }

}


// TODO make so years inbetween are included, even if isnt documented
function generateYears(arrayOfInput) {
    let defaultYears = document.querySelectorAll(".year");
    defaultYears.forEach(year => year.remove());

    let semesters = new Set();
    semesters.add("Fall");
    semesters.add("Wint");
    semesters.add("Spri");
    semesters.add("Summ");

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
                yearRow.classList.add(currentYear);
                yearRow.setAttribute('id', currentYear);

                years.add(currentYear);
                yearContainer.textContent = `${currentYear}-${parseInt(currentYear)+1}`;

                yearRow.appendChild(yearContainer);
                scheduleContainer.appendChild(yearRow);


            }
        }
    }
    else {
        
        let maxYear = parseInt(arrayOfInput[0].substring(arrayOfInput[0].length-4, arrayOfInput[0].length));
        let minYear = parseInt(arrayOfInput[0].substring(arrayOfInput[0].length-4, arrayOfInput[0].length));
        for (let element of arrayOfInput) {
            if(semesters.has(element.substring(0,4))) {
                let semesterAndCourse = element.split(" ");
                
                if(["Spri", "Summ", "Wint"].includes(semesterAndCourse[0].substring(0,4))) {
                    semesterAndCourse[1]--;
                }
                else if (semesterAndCourse[0].substring(0,4) === "Fall") {
                    semesterAndCourse[1]++;
                }
                maxYear = Math.max(maxYear, parseInt(semesterAndCourse[1]));
                minYear = Math.min(minYear, parseInt(semesterAndCourse[1]));

                
                // console.log('debug')
                //TODO MAKE THIS A SEPARATE FUNCTION
                // let yearRow = document.createElement("div");
                // yearRow.classList.add("year");

                // let yearContainer = document.createElement("div");
                // let currentYear = element.substring(5);
                // yearRow.classList.add(currentYear);
                // yearRow.setAttribute('id', currentYear);

                // yearContainer.textContent = `${currentYear}-${parseInt(currentYear)+1}`;

                // yearRow.appendChild(yearContainer);
                // scheduleContainer.appendChild(yearRow);
            }
        }
    

        for (let i = minYear; i < maxYear; i++) {
            console.log(i)
            let yearRow = document.createElement("div");
            yearRow.classList.add("year");

            let yearContainer = document.createElement("div");
            yearContainer.classList.add("year-column");
            // let currentYear = element.substring(element.length-4, element.length);
            yearRow.classList.add(i);
            yearRow.setAttribute('id', i);

            yearContainer.textContent = `${i}-${i+1}`;

            yearRow.appendChild(yearContainer);
            scheduleContainer.appendChild(yearRow);
        }
    }
}


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
    let courses = document.getElementsByClassName("course");
    if(searchBar.className.includes('active') && searchBar.value) {
        for (let course of courses) {
            course.classList.remove("searched")
            if(course.textContent.includes(searchBar.value)) {
                course.classList.toggle("searched");
            }
        }
        console.log(searchBar.value);
        
    }
    else {
        searchBar.classList.toggle("active");
        clearSearch.classList.toggle("active");
        for (let course of courses) {
            course.classList.remove("searched")
        }
    }
});

clearSearch.addEventListener("click", () => {
    let courses = document.getElementsByClassName("course");
    if(!(searchBar.value)) {
        searchBar.classList.toggle("active");
        clearSearch.classList.toggle("active");
    }
    else {
        searchBar.value = "";
        for (let course of courses) {
            course.classList.remove("searched")
        }
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

    const IS_COMMA_SEPARATED_INPUT = arrayOfModalText[0].includes(",");
    let semesterToCourse = new Map();

    if (!(IS_COMMA_SEPARATED_INPUT)) {
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
    } else {
        for (let line of arrayOfModalText) {
            let courseNameYear = line.split(",");
            semesterToCourse.set(courseNameYear[2], new Set());
        }
        for(let line of arrayOfModalText) {
            let courseNameYear = line.split(",");
            if(courseNameYear[0] || courseNameYear[1]) {
                semesterToCourse.set(courseNameYear[2], semesterToCourse.get(courseNameYear[2]).add(courseNameYear[0] + " " + courseNameYear[1]));
            }
        }
    }

    console.log(semesterToCourse);


    //TODO make for other dataset ex.semesterAndCourse
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
            console.log(course +  " " + semesterAndCourse)
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

    let maxYear = -1;
    let minYear = -1;

    if(IS_COMMA_SEPARATED_INPUT) {
        let currentYear = arrayOfInput[0].substring(arrayOfInput[0].length-4, arrayOfInput[0].length);
        maxYear = parseInt(currentYear);
        minYear = parseInt(currentYear);
        
        const years = new Set();
        for(let element of arrayOfInput) {
            let courseNameYear = element.split(",");
            let semesterYear = courseNameYear[2].split(" ");
            currentYear = parseInt(semesterYear[1]);
            let currSemester = semesterYear[0];
            
            console.log(currSemester)

            if(["Spri", "Summ", "Wint"].includes(currSemester.substring(0,4))) {
                currentYear--;
            }
            else if (currSemester === "Fall") {
                currentYear++;
            }
            
            maxYear = Math.max(maxYear, currentYear);
            minYear = Math.min(minYear, currentYear);
        }
    }
    else {
        
        maxYear = parseInt(arrayOfInput[0].substring(arrayOfInput[0].length-4, arrayOfInput[0].length));
        minYear = parseInt(arrayOfInput[0].substring(arrayOfInput[0].length-4, arrayOfInput[0].length));
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
            }
        }
    

        // for (let i = minYear; i < maxYear; i++) {
        //     console.log(i)
        //     let yearRow = document.createElement("div");
        //     yearRow.classList.add("year");

        //     let yearContainer = document.createElement("div");
        //     yearContainer.classList.add("year-column");
        //     // let currentYear = element.substring(element.length-4, element.length);
        //     yearRow.classList.add(i);
        //     yearRow.setAttribute('id', i);

        //     yearContainer.textContent = `${i}-${i+1}`;

        //     yearRow.appendChild(yearContainer);
        //     scheduleContainer.appendChild(yearRow);
        // }
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

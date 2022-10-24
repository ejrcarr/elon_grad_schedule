
const searchIcon = document.getElementById("search-button");
const searchBar = document.getElementById("search-bar");
const clearSearchButton = document.getElementById("clear-search");
const addCoursesButton = document.getElementById("add-courses");
const modal = document.getElementById("modal");
const closeModalButton = document.getElementById("close-modal");
const submitModalButton = document.getElementById("submit-button");
const modalTextArea = document.getElementById("modal-text");
const templateButton = document.getElementById("template-button");
const dropdownContent = document.getElementById("dropdown-content");
const semesterContainer = document.getElementById("semester-container");
const templateButtonWrapper = document.getElementById("template-button-wrapper");
const rowLayoutButtonBottom = document.getElementById("row-layout-bottom");
const gridLayoutButtonBottom = document.getElementById("grid-layout-bottom");
const rowLayoutButtonTop = document.getElementById("row-layout-top");
const gridLayoutButtonTop = document.getElementById("grid-layout-top");
const scheduleContainer = document.getElementById("schedule-container");
const gridLayoutContainer = document.getElementById("grid-layout-container");
const rowLayoutContainer = document.getElementById("row-layout-container");
const semesters = new Set(["Fall", "Wint", "Spri", "Summ"]);
const fullNameSemesters = ["Fall", "Winter", "Spring", "Summer"];

let counter = 0;
let currentHeldCourse;

let isCurrentGridLayout = true;

let currentModalText;
let arrayModalText;
let currentHoverTarget;
let sortedArray;
let updatedMap;

let maxYear = -1;
let minYear = -1;

searchIcon.addEventListener("click", searchCourses);
clearSearchButton.addEventListener("click", clearButtonLogic);
addCoursesButton.addEventListener("click", toggleModalVisibility);
closeModalButton.addEventListener("click", toggleModalVisibility);
submitModalButton.addEventListener("click", uploadModalText);
dropdownContent.addEventListener("click", switchLayoutAndButtons);

function searchCourses() {
    const ACTIVE_SEARCH_BAR_HAS_VALUE = searchBar.className.includes('visible') && searchBar.value
    if(ACTIVE_SEARCH_BAR_HAS_VALUE) {
        showSearchedCourses();
    }
    else {
        toggleSearchBar();
        searchBar.focus();
        resetSearchedCourses();
    }
}

function clearButtonLogic() {
    let SEARCH_BAR_IS_EMPTY = !(searchBar.value);

    if(SEARCH_BAR_IS_EMPTY) {
        toggleSearchBar();
    }
    else {
        clearSearchBar();
    }
}

function toggleSearchBar() {
    searchBar.classList.toggle("visible");
    clearSearchButton.classList.toggle("visible");
}

function clearSearchBar() {
    searchBar.value = "";
    resetSearchedCourses();
}

function resetSearchedCourses() {
    let courses = document.getElementsByClassName("course");
    for (let course of courses) {
        course.classList.remove("searched")
    }
}

function showSearchedCourses() {
    console.log("SEARCHING")
    let courses = document.getElementsByClassName("course");
    for (let course of courses) {
        course.classList.remove("searched")
        if(course.textContent.includes(searchBar.value)) {
            course.classList.toggle("searched");
        }
    }
}

function toggleModalVisibility() {
    modal.classList.toggle("show");
}

function uploadModalText() {
    const MODAL_TEXT_IS_NOT_EMPTY = modalTextArea.value;
    if(MODAL_TEXT_IS_NOT_EMPTY) {
        modal.classList.toggle("show");
        currentModalText = modalTextArea.value.trim();
        modalTextArea.value = "";
        arrayModalText = currentModalText.split("\n");
        generateYears();
        generateCourses();
        dragAndDropFunctionality();
    }
}

templateButton.addEventListener("click", () => {
    let dropdownContent = document.getElementById("template-button-wrapper");
    dropdownContent.classList.toggle("active-dropdown");
});

function switchLayoutAndButtons() {
    
    switchGridRowButtons();
    templateButtonWrapper.classList.toggle("active-dropdown");
    isCurrentGridLayout = !isCurrentGridLayout;

    gridLayoutContainer.classList.toggle("inactive-flex");
    rowLayoutContainer.classList.toggle("inactive-flex");
    gridLayoutContainer.classList.toggle("inactive-layout");
    rowLayoutContainer.classList.toggle("inactive-layout");
}

function switchGridRowButtons() {
    rowLayoutButtonBottom.classList.toggle("inactive");
    gridLayoutButtonBottom.classList.toggle("inactive");
    rowLayoutButtonBottom.classList.toggle("active");
    gridLayoutButtonBottom.classList.toggle("active");
    rowLayoutButtonTop.classList.toggle("inactive");
    gridLayoutButtonTop.classList.toggle("inactive");
    rowLayoutButtonTop.classList.toggle("active");
    gridLayoutButtonTop.classList.toggle("active");
}


document.addEventListener("click", e => {
    let dropdownContent = document.getElementById("template-button-wrapper");
    const isDrop = e.target.matches(".drop")
    const isSearch = e.target.matches(".search");
    if(!isSearch && searchBar.className.includes("visible") && !searchBar.value) {
        toggleSearchBar();
        resetSearchedCourses();
    }
    if(!isDrop) {
        dropdownContent.classList.remove("active-dropdown");
    }
});

function createDefaultSemesterToCourseMap() {
    let semesterToCourse = new Map();
    let currentSemester = arrayModalText[0];

        for (let line of arrayModalText) {
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

    return semesterToCourse;
}

function createCSVSemesterToCourseMap() {
    let semesterToCourse = new Map();

    for (let line of arrayModalText) {
        let courseNameYear = line.split(",");
        semesterToCourse.set(courseNameYear[2], new Set());
    }
    for(let line of arrayModalText) {
        let courseNameYear = line.split(",");
        if(courseNameYear[0] || courseNameYear[1]) {
            semesterToCourse.set(courseNameYear[2], semesterToCourse.get(courseNameYear[2]).add(courseNameYear[0] + " " + courseNameYear[1]));
        }
    }

    return semesterToCourse;
}

function generateSemesterToCourseMap() {
    const IS_COMMA_SEPARATED_INPUT = arrayModalText[0].includes(",");
    
    let semesterToCourse = new Map();

    if (!(IS_COMMA_SEPARATED_INPUT)) {
        semesterToCourse = createDefaultSemesterToCourseMap();
    } else {
        semesterToCourse = createCSVSemesterToCourseMap();
    }

    return semesterToCourse
}

function createWideScreenCourseDiv(semester="dummy", courseInfo="") {
    let courseDiv = document.createElement("div");
    courseDiv.classList.add("course");
    courseDiv.draggable = true;
    courseDiv.classList.add("wide-screen");
    courseDiv.classList.add(semester);
    courseDiv.textContent = courseInfo;

    return courseDiv;
}

function createMobileCourseDiv(semester="dummy", courseInfo="") {
    let mobile = document.createElement("div");
    mobile.classList.add("course");
    mobile.draggable = true;
    mobile.classList.add("mobile");
    mobile.classList.add(semester);
    mobile.textContent = courseInfo.substring(0, 8);

    return mobile;
}

function createCourseContainer(extraClass = "", extraExtraClass="") {
    let courseContainerDiv = document.createElement("div");
    courseContainerDiv.classList.add("course-container");
    courseContainerDiv.classList.add(extraClass);
    courseContainerDiv.classList.add(extraExtraClass);

    return courseContainerDiv;
}

function generateGridLayoutFromMap(semesterToCourseMap) {

    for (let [semester, courses] of semesterToCourseMap) {

        let semesterAndYear = semester.split(" "); // ex. "Fall 2022" = ["Fall", "2022"]
        let semesterName = semesterAndYear[0];
        let year = semesterAndYear[1];

        if (["Spri", "Summ", "Wint"].includes(semester.substring(0,4))) {
            year--;
        }

        let yearRow = document.getElementById(year);

        let courseContainer = document.createElement("div");
        courseContainer.classList.add("course-container");
        courseContainer.classList.add(semesterName.toLowerCase());

        for (let course of courses) {
            let courseDiv = createWideScreenCourseDiv(semesterName, course);
            let mobileDiv = createMobileCourseDiv(semesterName, course);

            courseContainer.appendChild(courseDiv);
            courseContainer.appendChild(mobileDiv);
        }

        if(yearRow) {
            yearRow.querySelector("." + semesterName.toLowerCase()).remove();
            yearRow.appendChild(courseContainer);
        }
    }
}

function generateRowLayoutFromMap(semesterToCourseMap) {
    let listOfYears = [];
    for (const [key, value] of semesterToCourseMap) {
        let stringYear = key.substring(key.length-4, key.length);
        let integerYear = parseInt(stringYear);
        if(key.split(" ")[0] != "Fall") {
            integerYear--;
        }
        if(!listOfYears.includes(integerYear)) {
            listOfYears.push(integerYear);
        }
    }
    for(let i = Math.min(...listOfYears); i <= Math.max(...listOfYears); i++) {
        for (let currentSemesterRotation of fullNameSemesters) {
            let tempYears = i;
            if(currentSemesterRotation != "Fall") {
                tempYears++;
            }
            let newEntry = currentSemesterRotation + " " + tempYears;
            if(!semesterToCourseMap.has(newEntry)) {
                semesterToCourseMap.set(newEntry, new Set());
            }
        }
    }


    let defaultSemesterRows = document.querySelectorAll(".placeholder");
    defaultSemesterRows.forEach(semesterRow => semesterRow.remove());

    sortedArray = Array.from(semesterToCourseMap.keys()).sort((a, b) => {
        let splitA = a.split(" ");
        let splitB = b.split(" ");
        if (splitA[1] === splitB[1]) {
            if (splitA[0] === "Fall") {
                return 1;
            }
            if(splitB[0] === "Fall") {
                return -1;
            }
            if(splitA[0] === "Winter") {
                return -1;
            }
            if(splitB[0] === "Winter") {
                return 1;
            }
            if(splitA[0] === "Spring") {
                return -1;
            }
            if(splitB[0] === "Spring") {
                return 1;
            }
        }
        else {
            return parseInt(splitA[1]) - parseInt(splitB[1]);
        }});
       

    let currentSeenSemesters = [...sortedArray];
    for(let i = 0; i < sortedArray.length; i++) {
        let semester = sortedArray[i];
        let splittedSemester = semester.split(" ");
        let stringSemesterYear = splittedSemester[1];

        let courses = semesterToCourseMap.get(semester);
        
        let semesterRow = document.createElement("div");
        semesterRow.classList.add("semester-row");
        semesterRow.classList.add(semester.toLowerCase().replace(" ", "-"));

        let semesterName = document.createElement("div");
        semesterName.classList.add("semester-name");
        semesterName.classList.add("semester");
        semesterName.textContent = semester;

        let courseWrapperDiv = document.createElement("div");
        courseWrapperDiv.classList.add("course-wrapper");

        let coursesDiv = document.createElement("div");
        coursesDiv.classList.add("courses");

        for(let course of courses) {
            let courseDiv = createWideScreenCourseDiv("courses",course);
            coursesDiv.appendChild(courseDiv);
        }
        courseWrapperDiv.appendChild(coursesDiv);
        semesterRow.append(semesterName);
        semesterRow.append(courseWrapperDiv);
        rowLayoutContainer.appendChild(semesterRow);
    }
    
}

function generateCourses() {
    let semesterToCourse = generateSemesterToCourseMap();

    generateGridLayoutFromMap(semesterToCourse);  
    generateRowLayoutFromMap(semesterToCourse);
    
}

function generateYears() {
    let defaultYears = document.querySelectorAll(".year");
    defaultYears.forEach(year => year.remove());

    const minAndMaxArray = findMinAndMaxYears();
    minYear = minAndMaxArray[0];
    maxYear = minAndMaxArray[1];

    generateYearRows(minYear, maxYear);
    
}

function generateYearRows(minYear, maxYear) {
    for (let i = minYear; i <= maxYear; i++) {
        let yearRow = document.createElement("div");
        yearRow.classList.add("year");

        let yearContainer = document.createElement("div");
        yearContainer.classList.add("year-column");

        yearRow.classList.add(i);
        yearRow.setAttribute('id', i);

        yearContainer.textContent = `${i}-${i+1}`;

        yearRow.appendChild(createCourseContainer("fall", "dummy"));
        yearRow.appendChild(createCourseContainer("winter", "dummy"));
        yearRow.appendChild(createCourseContainer("spring", "dummy"));
        yearRow.appendChild(createCourseContainer("summer", "dummy"));

        yearRow.appendChild(yearContainer);
        gridLayoutContainer.appendChild(yearRow);
    }
}

function findMinAndMaxYears() {
    const IS_COMMA_SEPARATED_INPUT = arrayModalText[0].includes(",");

    if(IS_COMMA_SEPARATED_INPUT) {
        const minAndMaxArray = findMinAndMaxYearsCSV();
        minYear = minAndMaxArray[0];
        maxYear = minAndMaxArray[1];
    }
    else {
        const minAndMaxArray = findMinAndMaxYearsDefault();
        minYear = minAndMaxArray[0];
        maxYear = minAndMaxArray[1];
    }

    return [minYear, maxYear];
}

function findMinAndMaxYearsCSV() {

    let currentYear = arrayModalText[0].substring(arrayModalText[0].length-4, arrayModalText[0].length);
    maxYear = parseInt(currentYear);
    minYear = parseInt(currentYear);
    
    for(let element of arrayModalText) {
        let courseNameYear = element.split(",");
        let semesterYear = courseNameYear[2].split(" ");

        currentYear = parseInt(semesterYear[1]);
        let currSemester = semesterYear[0];

        if(["Spri", "Summ", "Wint"].includes(currSemester.substring(0,4))) {
            currentYear--;
        }
        
        maxYear = Math.max(maxYear, currentYear);
        minYear = Math.min(minYear, currentYear);
    
    }
    return [minYear, maxYear]
}

function findMinAndMaxYearsDefault() {

    maxYear = parseInt(arrayModalText[0].substring(arrayModalText[0].length-4, arrayModalText[0].length));
    minYear = parseInt(arrayModalText[0].substring(arrayModalText[0].length-4, arrayModalText[0].length));
    for (let element of arrayModalText) {
        if(semesters.has(element.substring(0,4))) {
            let semesterAndCourse = element.split(" ");
            
            if(["Spri", "Summ", "Wint"].includes(semesterAndCourse[0].substring(0,4))) {
                semesterAndCourse[1]--;
            }
            maxYear = Math.max(maxYear, parseInt(semesterAndCourse[1]));
            minYear = Math.min(minYear, parseInt(semesterAndCourse[1]));
        }
    }

    return [minYear, maxYear]
}

function dragAndDropFunctionality() {
    let allCourses = document.querySelectorAll(".course");
    // let allCourseContainers = document.querySelectorAll(".course-container, .course-wrapper");
    let allCourseContainers = document.querySelectorAll(".course-container");
    let allCourseWrappers = document.querySelectorAll(".course-wrapper");

    let thisNodeGoesToo;

    allCourses.forEach(course => {
        course.addEventListener("dragstart", () => {
            let tempCourseContainer = course.parentNode;
            for(let i = 0; i < tempCourseContainer.childNodes.length; i++) {
                if(tempCourseContainer.childNodes[i] != course) {
                    if(tempCourseContainer.childNodes[i].textContent.substring(0,8) === course.textContent.substring(0, 8)) {
                        thisNodeGoesToo = tempCourseContainer.childNodes[i];
                    }
                }
            }

            currentHeldCourse = course;
            course.classList.add("hold");
            setTimeout(() => course.classList.add("invisible"), 0);
        });
        course.addEventListener("dragend", () => {
            course.classList.remove("hold");
            course.classList.remove("invisible");
        });
    });

    allCourseContainers.forEach(courseContainer => {
        courseContainer.addEventListener("dragenter", e => {
            e.preventDefault();
            allCourseContainers.forEach(container => {
                container.classList.remove("hover");
            });
            counter++;
            courseContainer.classList.add("hover");

        });
        courseContainer.addEventListener("dragleave", () => {
            counter--;
            if(counter === 0) {
                courseContainer.classList.remove("hover");
            }
        });

        courseContainer.addEventListener("dragover", e => {
            e.preventDefault();
        })

        courseContainer.addEventListener("drop", e => {
            e.preventDefault();
            
            allCourseContainers.forEach(container => {
                container.classList.remove("hover");
            });
            if(thisNodeGoesToo) {
                courseContainer.append(thisNodeGoesToo);
            }
            courseContainer.append(currentHeldCourse);
            updateMapFromGrid();
            updateRowsFromMap();
        });
    });

    allCourseWrappers.forEach(courseWrapper => {
        courseWrapper.addEventListener("dragenter", e => {
            e.preventDefault();
            allCourseWrappers.forEach(container => {
                container.classList.remove("hover");
            });
            counter++;
            if(!courseWrapper.className.includes("course-column")) {
                courseWrapper.classList.add("hover");
            }

        });
        courseWrapper.addEventListener("dragleave", () => {
            counter--;
            if(counter === 0) {
                courseWrapper.classList.remove("hover");
            }
        });

        courseWrapper.addEventListener("dragover", e => {
            e.preventDefault();
        })

        courseWrapper.addEventListener("drop", e => {
            e.preventDefault();
            
            allCourseWrappers.forEach(container => {
                container.classList.remove("hover");
            });
            if(thisNodeGoesToo) {
                courseWrapper.childNodes[0].append(thisNodeGoesToo);
            }
            courseWrapper.childNodes[0].append(currentHeldCourse);
            updateMapFromRow();
            updateGridFromMap();
        });
    });

}

function updateMapFromGrid() {
    updatedMap = new Map();
    let yearRowDivs = document.querySelectorAll(".year");
    for(let i = 0; i < yearRowDivs.length; i++) {
        let currRow = yearRowDivs[i];
        let year = currRow.className.split(" ")[1];
        updatedMap.set(year, new Map());
        for(let j = 0; j < currRow.childNodes.length; j++) {
            if(currRow.childNodes[j].className.includes("year-column")) {
                continue;
            }
            let currCourseContainer = currRow.childNodes[j];
            let tempSemester = currCourseContainer.className.split(" ")[1];
            updatedMap.get(year).set(tempSemester, new Set());
            for(let k = 0; k < currCourseContainer.childNodes.length; k++) {
                let currCourseName = currCourseContainer.childNodes[k].textContent;
                if(currCourseName.length > 8) {
                    updatedMap.get(year).get(tempSemester).add(currCourseName);
                }
                
            }
        }
    }
    console.log(updatedMap)
    return updatedMap;
}

function updateMapFromRow() {
    updatedMap = new Map();
    let semesterRowDivs = document.querySelectorAll(".semester-row");
    for(let i = 1; i < semesterRowDivs.length; i++) {
        let currSemesterRow = semesterRowDivs[i];
        let semAndYear = currSemesterRow.className.split(" ")[1];
        let currSem = semAndYear.split("-")[0];
        let year = currSemesterRow.className.substring(currSemesterRow.className.length-4, currSemesterRow.className.length);
        if(currSem != "fall") {
            year--;
            year = year.toString();
        }
        if(!updatedMap.has(year)) {
            updatedMap.set(year, new Map());
        }
        if(!updatedMap.get(year).has(currSem)) {
            updatedMap.get(year).set(currSem, new Set());
        }

        let courses = currSemesterRow.childNodes[1].childNodes[0];
        console.log(courses);

        for(let j = 0; j < courses.childNodes.length; j++) {
            let currCourseName = courses.childNodes[j].textContent;
            updatedMap.get(year).get(currSem).add(currCourseName);
        }
    }
    console.log(updatedMap);
}

function updateRowsFromMap() {
    for(let [year, semesterToCourseMap] of updatedMap) {
        for (let [semester, setOfCourses] of semesterToCourseMap) {
            let tempYear =  year;
            if(semester != "fall") {
                tempYear++;
            }
            let currentRow = document.querySelector("." + semester + "-" + tempYear);
        
            let currentCourseWrapper = currentRow.childNodes[1];
            let currentCourses = currentCourseWrapper.childNodes[0];
         
            currentCourses.remove();
            let newCurrentCourses = document.createElement("div");
            newCurrentCourses.classList.add("courses");

            console.log(setOfCourses);
            for (let course of setOfCourses) {
                let tempCourseDiv = createWideScreenCourseDiv("courses",course);
                newCurrentCourses.appendChild(tempCourseDiv);
            }
            currentCourseWrapper.appendChild(newCurrentCourses);
        }
    }
    dragAndDropFunctionality();
}

function updateGridFromMap() {
    for(let [year, semesterToCourseMap] of updatedMap) {
        for (let [semester, setOfCourses] of semesterToCourseMap) {
            let tempYear = year;
            let currentRowDiv = document.getElementById(tempYear.toString());
            let currentCourseContainer = currentRowDiv.querySelector("." + semester);
            currentCourseContainer.remove();

            let newCurrentCourseContainer = document.createElement("div");
            newCurrentCourseContainer.classList.add("course-container");
            newCurrentCourseContainer.classList.add(semester);

            for (let course of setOfCourses) {
                let tempCourseDiv = createWideScreenCourseDiv("courses",course);
                let tempMobileCourseDiv = createMobileCourseDiv("courses", course.substring(0, 8));

                newCurrentCourseContainer.appendChild(tempCourseDiv);
                newCurrentCourseContainer.appendChild(tempMobileCourseDiv);
            }
            currentRowDiv.appendChild(newCurrentCourseContainer);
        }
    }
    dragAndDropFunctionality();
}
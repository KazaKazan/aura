// Global Vars
let settings = {
    "searchEngine": "google",
    "searchbarPlaceholder": 'Enter command or search term, "au:help" for help.',
    "clockMode": "24",
    "clockDisplay": "true",
    "dateDisplay": "true",
    "dayForm": "full",
    "background": "#000",
    "foreground": "#fff",
    "accent": "#d6d6d6",
    "image": "Assets/default.jpg",
    "title": "Aura"
};

let links = [
    ["Source","https://github.com/KazaKazan/aura"],
    ["Documentation","https://github.com/KazaKazan/aura/blob/main/commands.md"],
    ["Other Projects","https://github.com/KazaKazan/"],
]

// Searchbar Logic
const searchLogic = (() => {
    // DOM Vars
    const searchBar = document.getElementById("searchbar");
    const searchBarDecoration = document.getElementById("searchbarDecoration");
    const errorMsg = document.getElementById("errorMessage");


    // DOM Methods
    searchBar.onkeydown = (event) => onKey(event);

    // Utility Vars
    let cmdMode = false;

    const _cmdParser = function(input, startIndex, endIndex = 1){
        let parsed = "";
        for(let i = startIndex; i < input.length - endIndex; i++){
            parsed += input[i];
            if(i < input.length - 1 - endIndex){
                parsed += " ";
            };
        };
        return parsed;
    };

    const _cmdCheck = function(input){
        if(/^au:/.test(input) || cmdMode === true){
            let errorMessage = "";
            let commandList;
            if(cmdMode === true){
                commandList = input.split(" ");
            }
            else{
                commandList = input.slice(3).split(" ");
            };
            if(commandList.length > 0){
                switch(commandList[0]){
                    // Calendar Commands
                    case "clock-mode":
                    case "cm":
                        if(settings["clockMode"] === "24"){
                            settings["clockMode"] = "12";
                        }
                        else{
                            settings["clockMode"] = "24";
                        }
                        break;
                    
                    case "date-form":
                    case "df":
                        if(settings["dayForm"] === "full"){
                            settings["dayForm"] = "short";
                        }
                        else{
                            settings["dayForm"] = "full";
                        };
                        break;
                    
                    case "calendar-display":
                    case "cd":
                        if(commandList.length === 3){
                            const components = [];
                            switch(commandList[1]){
                                case "c":
                                    components.push("clockDisplay");
                                    break;
                                case "d":
                                    components.push("dateDisplay");
                                    break;
                                case "a":
                                    components.push("clockDisplay");
                                    components.push("dateDisplay");
                                    break;
                                default:
                                    errorMessage = "Invalid component argument.";
                                    break;
                            };
                            if(components === []){
                                break;
                            }
                            else{
                                if(commandList[2] === "true" || commandList[2] === "false"){
                                    components.forEach(component => {
                                        settings[component] = commandList[2];
                                    });
                                }
                                else{
                                    errorMessage = "Invalid visibility argument."
                                };
                            };
                        }
                        else{
                            errorMessage = 'Usage: "au:[cd || calendar-display] <component> <visibility>"'
                        };
                        break;

                    // Searchbar commands
                    case "search-engine":
                    case "se":
                        if(commandList.length === 2){
                            switch(commandList[1]){
                                case "duckduckgo":
                                case "google":
                                case "wikipedia":
                                    settings["searchEngine"] = commandList[1];
                                    break;
                                default:
                                    errorMessage = "Missing or unrecognized search engine."
                                    break;
                            }
                        }
                        else{
                            errorMessage = 'Usage: "au:[se || search-engine] <search engine>"'
                        }
                        break;
                    
                    case "search-placeholder":
                    case "sp":
                        if(commandList.length >= 2){
                            const placeholder = _cmdParser(commandList, 1, 0);
                            settings["searchbarPlaceholder"] = placeholder;
                            DOMLogic.refresh();
                            break;
                        }
                        else{
                            errorMessage = 'Usage: "au:[sp || search-placeholder] <placeholder text>"'
                        }
                        break;
                    
                    // Link List Commands
                    case "link-add":
                    case "la":
                        if(commandList.length >= 3){
                            const linkName = _cmdParser(commandList, 1);
                            errorMessage = DOMLogic.addLink(linkName, commandList[commandList.length-1]);
                        }
                        else{
                            errorMessage = 'Usage: "au:[la || link-add] <link name> <link URL>"'
                        }
                        break;

                    case "link-remove":
                    case "lr":
                        if(commandList.length === 2){
                            const linkIndex = parseInt(commandList[1]);
                            if(isNaN(linkIndex)){
                                errorMessage = "The link index must be a number."
                            }
                            else{
                                errorMessage = DOMLogic.removeLink(linkIndex);
                            };
                        }
                        else{
                            errorMessage = 'Usage: "au:[lr || link-remove] <link index>"'
                        }
                        break;

                    case "link-set":
                    case "ls":
                        if(commandList.length >= 4){
                            const linkIndex = parseInt(commandList[1]);
                            if(isNaN(linkIndex)){
                                errorMessage = "The link index must be a number."
                            }
                            else{
                                const linkName = _cmdParser(commandList, 2);
                                errorMessage = DOMLogic.setLink(linkIndex, linkName, commandList[commandList.length-1]);
                            };
                        }
                        else{
                            errorMessage = 'Usage: "au:[ls || link-set] <link index> <link name> <link URL>"'
                        }
                        break;
                    
                    case "link-swap":
                    case "lw":
                        if(commandList.length === 3){
                            const firstIndex = parseInt(commandList[1]) - 1;
                            const secondIndex = parseInt(commandList[2]) - 1;
                            if(isNaN(firstIndex) || isNaN(secondIndex)){
                                errorMessage = "Both arguments need to be numbers."
                            }
                            else{
                                errorMessage = DOMLogic.swapLinks(firstIndex, secondIndex);
                            }
                        }
                        else{
                            errorMessage = 'Usage: "au:[lw || link-swap] <link index> <link index>"'
                        };
                        break;
                    
                    case "links-export":
                    case "exl":
                        settingsLogic.exportManager("links");
                        break;
                    
                    case "links-import":
                    case "iml":
                        settingsLogic.importManager("links");
                        break;

                    // Settings Commands
                    case "settings-save":
                    case "ss":
                        settingsLogic.save();
                        break;

                    case "settings-load":
                    case "sl":
                        settingsLogic.load();
                        break;

                    case "settings-reset":
                    case "sr":
                        settingsLogic.reset();
                        break;
                    
                    case "settings-export":
                    case "exs":
                        settingsLogic.exportManager("settings");
                        break;
                    
                    case "settings-import":
                    case "ims":
                        settingsLogic.importManager("settings");
                        break;
                    
                    // Theming Commands                    
                    case "color-background":
                    case "cb":
                        if(commandList.length === 2){
                            settings["background"] = commandList[1];
                            DOMLogic.refresh();   
                        }
                        else{
                            errorMessage = 'Usage: "au:[cb || color-background] <CSS color>"'
                        }
                        break;

                    case "color-foreground":
                    case "cf":
                        if(commandList.length === 2){
                            settings["foreground"] = commandList[1];
                            DOMLogic.refresh();
                        }
                        else{
                            errorMessage = 'Usage: "au:[cf || color-foreground] <CSS color>"'
                        }
                        break;

                    case "color-accent":
                    case "ca":
                        if(commandList.length === 2){
                            settings["accent"] = commandList[1];
                            DOMLogic.refresh();
                        }
                        else{
                            errorMessage = 'Usage: "au:[ca || color-accent] <CSS color>"'
                        }
                        break;
                    
                    case "image-set":
                    case "is":
                        if(commandList.length === 2){
                            settings["image"] = commandList[1];
                            DOMLogic.refresh();
                        }
                        else{
                            errorMessage = 'Usage: "au:[is || image-set] <image URL>"'
                        }
                        break;
                    
                    case "image-clear":
                    case "ic":
                        settings["image"] = "Assets/default.jpg";
                        DOMLogic.refresh();
                        break;
                    
                    // Utility Commands
                    case "message-clear":
                    case "mc":
                        errorMessage = "";
                        break;

                    case "terminal-mode":
                    case "tm":
                        cmdMode = !cmdMode;
                        if(cmdMode === true){
                            searchBarDecoration.innerText = "$";
                            searchBarDecoration.style.fontSize = "16px";
                            searchBar.setAttribute("placeholder","Enter command...");
                        }
                        else{
                            searchBarDecoration.innerText = ">";
                            searchBarDecoration.style.fontSize = "12px";
                            searchBar.setAttribute("placeholder",settings["searchbarPlaceholder"]);
                        };
                        break;
                    
                    case "help":
                    case "h":
                        errorMessage = 'Please refer to the <a href="https://github.com/KazaKazan/aura/blob/main/commands.md">documentation</a> for help.'
                        break;

                    default:
                        errorMessage = 'Command not recognized "' + commandList[0] + '".'
                        break;
                }
            }
            else{
                errorMessage = 'Usage: "au:<command> <parameters>"'
            };
            errorMsg.innerHTML = errorMessage;
            searchBar.focus();
        }
        else{
            _search(input);
        };
    };
     
    const _search = function (term) {
        let url;
        term = term.split(" ");
        switch(settings["searchEngine"]){
            case "google":
                url = "https://www.google.com/search?q=";
                break;
            case "duckduckgo":
                url = "https://duckduckgo.com/?q=";
                break;
            case "wikipedia":
                url = "https://wikipedia.org/w/index.php?search="
                break;
        }
        for (let i = 0; i < term.length; i++){
            url += term[i];
            url += "+";
        };
        window.location.href = url;
    };

    const onKey = function (key) {
        if (key.keyCode === 13){
            input = searchBar.value;
            searchBar.value = "";
            searchBar.blur();
            _cmdCheck(input);
        };
    };

    return{
        onKey
    };
})();

// Clock Logic
const clock = (() => {
    // DOM Vars
    const clockContainer = document.getElementById("clockContainer");

    // Naming Vars
    const days = ["Sunday", "Monday","Tuesdat", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    // Private Functions
    const _checkTime = function (time,checkHour=false){
        if (checkHour === true) {
            if (time > 12 && settings["clockMode"] === "12") {
                time -= 12;
            };
        };

        if (time < 10) {
            time = "0" + time;
        };
        return time;
    };

    // Public Functions
    const displayTime = function () {
        let clockText = "";
        const today = new Date();
        if(settings["dateDisplay"] === "true"){
            let day = days[today.getDay()];
            if(settings["dayForm"] === "short"){
                day = day.slice(0,3);
            };
            clockText += day + ", " + months[today.getMonth()] + " " + today.getDate()
        };
        if(settings["dateDisplay"] === "true" && settings["clockDisplay"] === "true"){
            clockText += " | " ;
        };
        let h = today.getHours();
        let m = today.getMinutes();
        if(settings["clockDisplay"] === "true"){
            clockText += _checkTime(h, true) + ":" + _checkTime(m);;
            if(settings["clockMode"] === "12"){
                if(h > 12){
                    clockText +=  " PM";
                }
                else{
                    clockText +=  " AM";
                };
            }
        };
        clockContainer.innerText = clockText
        setTimeout(displayTime, 1000);
    };

    return{
        displayTime
    };
})();

// DOM Manipulator
const DOMLogic = (() => {
    //DOM Vars
    const linkContainer = document.getElementById("linkContainer");
    const imageElement = document.getElementById("image");
    const searchBar = document.getElementById("searchbar");
    const settingsWindow = document.getElementById("popupWindow");

    const _isBetween = function (value,min,max,inclusive=true){
        let result = false;
        if(min <= value && value <= max){
            result = true;
        }
        if(!inclusive){
            if(value === min || value === max){
                result = false;
            };
        };
        return result;
    };

    const refresh = function () {
        // Re-create links
        linkContainer.innerHTML = "";
        links.forEach(link => {
            newLink = document.createElement("a");
            newLink.setAttribute("tabindex","-1");
            newLink.setAttribute("href",link[1]);
            newLink.innerText = link[0];
            linkContainer.appendChild(newLink);
        });
        // Set page colors
        document.documentElement.style.setProperty("--background", settings["background"]);
        document.documentElement.style.setProperty("--foreground", settings["foreground"]);
        document.documentElement.style.setProperty("--accent-one", settings["accent"]);
        // Set image
        imageElement.setAttribute("src",settings["image"]);
        // Set searchbar placeholder
        searchBar.setAttribute("placeholder",settings["searchbarPlaceholder"])
    };

    const addLink = function (linkName, linkURL) {
        links.push([linkName,linkURL]);
        refresh();
        return "";
    };

    const removeLink = function (index) {
        if(links.length > 0){
            if(_isBetween(index,0,links.length)){
                links.splice(index - 1,1);
                refresh();
                return "";
            }
            else{
                return "Link " + index + " doesn't exist.";
            }
        };
        return "There's nothing to remove."
    };

    const setLink = function (index, linkName, linkURL) {
        if(_isBetween(index,0,links.length)){
            links[index-1] = [linkName, linkURL];
            refresh();
            return "";
        }
        return "Link " + index + " doesn't exist."
    };

    const swapLinks = function (fIndex, sIndex){
        if(isNaN(fIndex) || isNaN(sIndex)){
            return "Both arguments need to be numbers.";
        }
        else{
            if(_isBetween(fIndex,0,links.length) && _isBetween(sIndex,0,links.length)){
                [links[fIndex], links[sIndex]] = [links[sIndex], links[fIndex]];
                refresh();
                return "";
            }
            else{
                return "Argument(s) out of list range.";
            };
        };
    };

    const toggleSettings = function () {
        settingsWindow.classList.toggle("hidden");
    };

    return{
        refresh,
        addLink,
        removeLink,
        setLink,
        swapLinks,
        toggleSettings
    };
})();

// Saving and loading functions for the settings and the links
const settingsLogic = (() => {
    // DOM vars
    const settingsTitle = document.getElementById("popupTitle");
    const settingsField = document.getElementById("exportImport");
    const settingsButton = document.getElementById("settingsButton");

    const save = function () {
        window.localStorage.setItem("settings",JSON.stringify(settings));
        window.localStorage.setItem("links",JSON.stringify(links));
    };
    
    const load = function () {
        settingStorage = JSON.parse(window.localStorage.getItem("settings"));
        if(settingStorage !== null){
            settings = settingStorage;
        };
        linkStorage = JSON.parse(window.localStorage.getItem("links"));
        if(linkStorage !== null){
            links = linkStorage;
        };
        DOMLogic.refresh();
    };

    const reset = function () {
        window.localStorage.clear();
        location.reload();
    };

    const exportManager= function (mode) {
        settingsButton.onclick = () => DOMLogic.toggleSettings();
        settingsTitle.innerText = "Please save the below text.";
        if(mode==="links"){
            settingsField.value = JSON.stringify(links);
        }
        else{
            settingsField.value = JSON.stringify(settings);
        };
        DOMLogic.toggleSettings();
    };

    const importManager = function (mode) {
        settingsButton.onclick = () => _importer(mode);
        settingsField.value = "";
        if(mode==="links"){
            settingsTitle.innerText = "Please input your links below.";
        }
        else{
            settingsTitle.innerText = "Please input your settings below.";  
        };
        DOMLogic.toggleSettings();
    };

    const _importer = function (mode) {
        console.log("hey!");
        if(settingsField.value !== ""){
            if(mode === "links"){
                links = JSON.parse(settingsField.value);
            }
            else{
                settings = JSON.parse(settingsField.value);
            }
            DOMLogic.toggleSettings();
            DOMLogic.refresh();
        }
        else{
            DOMLogic.toggleSettings();
        }
    };

    return{
        save,
        load,
        reset,
        exportManager,
        importManager
    };
})();

// Start
settingsLogic.load();
DOMLogic.refresh();
clock.displayTime();
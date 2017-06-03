function loadJson(url, onSuccess, onError) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            onSuccess(JSON.parse(request.responseText));
        } else {
            if (onError) {
                onError(request.responseText);
            }
        }
    };

    request.onerror = onError;

    request.send();
}

function find(schedule, now) {
    for (var i = 0; i < schedule.length; i++) {
        if (now > Date.parse(schedule[i].start) && now < Date.parse(schedule[i].stop)) {
            return schedule[i];
        }
    }
    return null;
}

function update(schedule) {
    //const now = new Date();
    const now = Date.parse('2017-06-03T09:17:00Z');
    console.log("now: " + now);

    const entry = find(schedule, now);
    if (entry) {
        document.querySelector("#space .title").innerHTML = entry.space.title;
        document.querySelector("#space .speaker").innerHTML = entry.space.speaker;

        document.querySelector("#tab .title").innerHTML = entry.tab.title;
        document.querySelector("#tab .speaker").innerHTML = entry.tab.speaker;
    }
    
    
    // TODO: Leaner timeout
    setTimeout(update, 500, schedule);
}

loadJson('/api/schedule', update, console.error);
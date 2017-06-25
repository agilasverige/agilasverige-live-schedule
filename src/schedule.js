// loads json from given url
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
    if (now < Date.parse(schedule[i].stop)) {
      return i;
    }
  }
  return -1;
}

function startTimeOf(schedule) {
  return Date.parse(schedule[0].start);
}

function endTimeOf(schedule) {
  return Date.parse(schedule[schedule.length - 1].stop);
}

function getTimeWithinSchedule(schedule) {
  var now = new Date().getTime();
  var startTime = startTimeOf(schedule);
  var endTime = endTimeOf(schedule);
  if (now >= startTime && now <= endTime) {
    return new Date(now);
  }
  return new Date(startTime);
}

// data provider, for easy control of "current" time.
function getDisplayTime(schedule) {
  if (getDisplayTime.fixed_time) {
    return new Date(getDisplayTime.fixed_time);
  }
  return getTimeWithinSchedule(schedule);
}

function updateFixedTimeSlider(schedule) {
  var first = schedule[0];
  document.querySelector("#now-slider").min = Date.parse(first.start);

  var last = schedule[schedule.length - 1];
  document.querySelector("#now-slider").max = Date.parse(last.stop);
}

var descriptions;
function storeDescriptions(d) {
  descriptions = d; // TODO: Use object rather than global var here
}

// Updates the title & speakers
function update(schedule) {
  updateFixedTimeSlider(schedule);

  var now = getDisplayTime(schedule);

  document.querySelector("#now-display").innerHTML = now;

  const index = find(schedule, now);
  if (index >= 0) {
    const entry = schedule[index];
    document.querySelector("#space .title").innerHTML = entry.space.title;
    document.querySelector("#space .speaker").innerHTML = entry.space.speaker;

    document.querySelector("#tab .title").innerHTML = entry.tab.title;
    document.querySelector("#tab .speaker").innerHTML = entry.tab.speaker;
  }

  // TODO: Leaner timeout
  setTimeout(update, 500, schedule);
}

function findDescription(title) {
  for (var i = 0; i < descriptions.length; i++) {
    const entry = descriptions[i];
    if (entry['title'] == title) {
      return entry['description'];
    }
  }
  return null;
}

function flipCard(el) {
  var front = el.querySelector('.front');
  if (front) {
    front.classList.toggle('hidden');
  }
  var back = el.querySelector('.back');
  if (back) {
    back.classList.toggle('hidden');
  }
  
  // TODO: Hack here, query UI for title - this should be stored in a model instead
  var title = el.querySelector('.title').innerHTML;
  el.querySelector('.description').innerHTML = findDescription(title);
}

module.exports = function() {
  window.addEventListener('load', function() {
    const slider = document.getElementById('now-slider');
    slider.onchange = function() {
      getDisplayTime.fixed_time = parseInt(slider.value);
    };
    var space = document.getElementById('space');
    space.onclick = function() { flipCard(space); };
    var tab = document.getElementById('tab');
    tab.onclick = function() { flipCard(tab); };

  }, false);


  loadJson('/data/program.json', update, console.error);
  loadJson('/data/descriptions.json', storeDescriptions, console.error);
};

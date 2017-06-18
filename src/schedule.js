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


module.exports = function() {
  window.addEventListener('load', function() {
    const slider = document.getElementById('now-slider');
    slider.onchange = function() {
      getDisplayTime.fixed_time = parseInt(slider.value);
    };
  }, false);

  loadJson('/data/program.json', update, console.error);
};

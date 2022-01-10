function Event (title, date, startTime, endTime, type, description) {
    this.title = title;
    this.date = date;
    this.startTime= startTime;
    this.endTime= endTime;
    this.type = type;
    this.description = description;
};


function Calendar(month, year) {

    if (sessionStorage.length == 0) {
        addTestData();
    }

    var now = new Date();

    // labels for week days and months
    var days_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        months_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // test if input date is correct, instead use current month
    this.month = (isNaN(month) || month == null) ? now.getMonth() + 1 : month;
    this.year = (isNaN(year) || year == null) ? now.getFullYear() : year;

    var logical_month = this.month - 1;

    // get first day of month and first week day
    var first_day = new Date(this.year, logical_month, 1),
        first_day_weekday = first_day.getDay() == 0 ? 7 : first_day.getDay();

    // find number of days in month
    var month_length = new Date(this.year, this.month, 0).getDate(),
        previous_month_length = new Date(this.year, logical_month, 0).getDate();

    // calendar header
    var html = '<h2>' + months_labels[logical_month] + ' ' + this.year + '</h2>';

    // calendar content
    html += '<table class="calendar-table">';

    // week days labels row
    html += '<thead>';
    html += '<tr class="week-days">';
    for (var i = 0; i <= 6; i++) {
        html += '<th class="day">';
        html += days_labels[i];
        html += '</th>';
    }
    html += '</tr>';
    html += '</thead>';

    // define default day variables
    var day  = 1, // current month days
        prev = 1, // previous month days
        next = 1; // next month days

    html += '<tbody>';
    html += '<tr class="week">';
    // weeks loop (rows)
    for (var i = 0; i < 9; i++) {
        // weekdays loop (cells)
        for (var j = 1; j <= 7; j++) {
            if (day <= month_length && (i > 0 || j >= first_day_weekday)) {
                // current month
                html += '<td class="day">';
                html += '<div onclick="createEventView()">';
                html += day;
                html += '</div>';
                const now = this.year + "-" + ('0' + this.month).slice(-2) + "-" + day
                var dataArrayString = sessionStorage.getItem(now);
                var retrievedEventsArray = JSON.parse(dataArrayString);
                if(retrievedEventsArray != null){
                    let i = 0;
                    retrievedEventsArray.forEach(element => {
                        html += '<div class="'+ element.type +'" id="day-event" onclick="detailsView(\''+ now +'\', \''+ i +'\')"  >' + element.title + '</div>'
                        i++
                });}
                html += '</td>';
                day++;
            } else {
                if (day <= month_length) {
                    // previous month
                    html += '<td class="day other-month">';
                    html += previous_month_length - first_day_weekday + prev + 1;
                    html += '</td>';
                    prev++;
                } else {
                    // next month
                    html += '<td class="day other-month">';
                    html += next;
                    html += '</td>';
                    next++;
                }
            }
        }

        // stop making rows if it's the end of month
        if (day > month_length) {
            html += '</tr>';
            break;
        } else {
            html += '</tr><tr class="week">';
        }
    }
    html += '</tbody>';
    html += '</table>';

    return html;
}



function detailsView(time, index) {

    var dataArrayString = sessionStorage.getItem(time);
    var retrievedEventsArray = JSON.parse(dataArrayString);
    let event= new Event();
    if(retrievedEventsArray != null) {
        event = retrievedEventsArray[index];
    } else {
        return
    }
    var html = '<dl>'
    html += '<dd>Event Title</dd>'
    html += '<dt>' + event.title + '</dt>'

    html += '<dd>Event Date</dd>'
    html += '<dt>' + event.date + '</dt>'

    html += '<dd>Event Start time</dd>'
    html += '<dt>' + event.startTime + '</dt>'

    html += '<dd>Event End time</dd>'
    html += '<dt>' + event.endTime + '</dt>'

    html += '<dd>Event type</dd>'
    html += '<dt>' + event.type + '</dt>'

    html += '<dd>Event description</dd>'
    html += '<dt>' + event.description + '</dt>'


    html+= '</dl>'


    html += '<button  id="btn-delete-event" onclick="deleteEvent(\''+ time +'\', \''+ index +'\')">' + 'Delete event' + '</button>';
    html += '<button onclick="createEventView()"  id="btn-add-event">' + 'New Event' + '</button>';

    document.getElementById('create-delete').innerHTML = html;

}
function deleteEvent(time, index) {
    var dataArrayString = sessionStorage.getItem(time);
    var retrievedEventsArray = JSON.parse(dataArrayString);
    let event= new Event();
    if (index > -1) {
        retrievedEventsArray.splice(index, 1);
        sessionStorage.setItem(time, JSON.stringify(retrievedEventsArray));
        document.getElementById('create-delete').innerHTML = defaultView();
        document.getElementById('calendar').innerHTML = Calendar();


    }

}

function defaultView() {
    var html = '<button onclick="createEventView()"  id="btn-add-event">' + 'New Event' + '</button>';

    return html;
}

function createEventView(){
    var html = '<form onsubmit="event.preventDefault(); addNewEvent()">'
    html += '<label htmlFor="title">Title</label>'
    html += '<input type="text" id="form-title" name="title"  maxlength="50" required><br>'

    html += '<label htmlFor="date">Date</label>'
    html += '<input type="date" id="form-date" name="date" required><br>'

    html += '<label htmlFor="start-time">Start time</label>'
    html += '<input type="time" id="form-start-time" name="start-time" required><br>'

    html += '<label htmlFor="end-time">End time</label>'
    html += '<input type="time" id="form-end-time" name="end-time" required><br>'

    html += '<label htmlFor="type">Type</label>'
    html += '<select id="form-type" name="type" required>'
    html += '<option value="meeting">Meeting</option>'
    html += '<option value="call">Call</option>'
    html += '<option value="outOfOffice">Out of Office</option>'
    html += '</select><br>'

    html += '<label htmlFor="desc">Description</label>'
    html += '<input type="textarea" id="form-desc" name="desc"  maxlength="100"><br>'

    html += '<input type="submit" >'




    html += '</form>'

    document.getElementById('create-delete').innerHTML = html;
}

function EndTimeValidation(start, end){
    if(start < end){
        return true

    } else {
        return false
    }
}


function addNewEvent(){
    var title = document.getElementById('form-title').value;
    var date = document.getElementById('form-date').value;
    var startTime = document.getElementById('form-start-time').value;
    var endTime = document.getElementById('form-end-time').value;
    var type = document.getElementById('form-type').value;
    var desc = document.getElementById('form-desc').value;

    if(!EndTimeValidation(startTime, endTime)){
        alert('End time must me later than start time!')
        return
    }

    var event = new Event(title, date, startTime, endTime, type, desc);
    var dataArrayString = sessionStorage.getItem(event.date);
    var retrievedEventsArray = JSON.parse(dataArrayString);
    if(retrievedEventsArray != null) {
        retrievedEventsArray.push(event);
    }else {
        retrievedEventsArray = [event];
    }
    sessionStorage.setItem(event.date, JSON.stringify(retrievedEventsArray));

    document.getElementById('create-delete').innerHTML = defaultView();
    document.getElementById('calendar').innerHTML = Calendar();





}

function addTestData(){
    var testEvent1 = new Event("demo title 1", "2022-01-10", "03:00:00", "04:00:00", "call", "");
    let eventArray = [testEvent1];
    var testEvent2 = new Event("demo title 2", "2022-01-10", "03:00:00", "04:00:00", "call", "");
    eventArray.push(testEvent2)
    sessionStorage.setItem(testEvent1.date, JSON.stringify(eventArray));
    var testEvent1 = new Event("demo title 3", "2022-01-13", "03:00:00", "04:00:00", "call", "");
    let eventArray2 = [testEvent1];
    var testEvent2 = new Event("demo title 4", "2022-01-13", "03:00:00", "04:00:00", "call", "");
    eventArray2.push(testEvent2)
    sessionStorage.setItem(testEvent1.date, JSON.stringify(eventArray2));


}

// document.getElementById('calendar').innerHTML = Calendar(12, 2015);
document.getElementById('calendar').innerHTML = Calendar();



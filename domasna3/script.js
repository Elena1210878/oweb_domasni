
// Konstruktor za vozac
function Driver(name, team, speed, skill) {
    this.name = name;
    this.team = team;
    this.speed = speed;
    this.skill = skill;

    if (Math.random() < 0.5) {
        this.tire = "Soft";
    } else {
        this.tire = "Hard";
    }

    this.totalTime = 0;

    this.pitLap = Math.floor(Math.random() * 5) + 3;

    this.hasPitted = false;
    this.status = "Vo trka";
}


// Niza so vozaci
var drivers = [];

var currentLap = 0;
var raceFinished = false;
var safetyCar = false;


// Kreiranje na 10 vozaci
function createDrivers() {
    drivers = [];

    drivers.push(new Driver("Max Verstappen", "Red Bull", 320, 9));
    drivers.push(new Driver("Lewis Hamilton", "Ferrari", 315, 9));
    drivers.push(new Driver("Charles Leclerc", "Ferrari", 318, 8));
    drivers.push(new Driver("Lando Norris", "McLaren", 317, 9));
    drivers.push(new Driver("Oscar Piastri", "McLaren", 314, 8));
    drivers.push(new Driver("George Russell", "Mercedes", 316, 8));
    drivers.push(new Driver("Fernando Alonso", "Aston Martin", 310, 9));
    drivers.push(new Driver("Carlos Sainz", "Williams", 312, 8));
    drivers.push(new Driver("Pierre Gasly", "Alpine", 308, 7));
    drivers.push(new Driver("Yuki Tsunoda", "Racing Bulls", 309, 7));
}


// Pocetok na trkata
function startRace() {

    createDrivers();

    currentLap = 0;
    raceFinished = false;
    safetyCar = false;

    document.getElementById("lapNumber").innerHTML = "0 / 10";

    document.getElementById("raceStatus").innerHTML = "Podgotveni";

    document.getElementById("safetyCarStatus").innerHTML = "Ne";

    document.getElementById("winnerBox").style.display = "none";

    document.getElementById("raceLog").innerHTML =
        "Trkata e podgotvena.";

    document.getElementById("nextButton").disabled = false;

    document.getElementById("autoButton").disabled = false;

    showDrivers();
}


// Prikazuvanje na vozacite vo tabelata
function showDrivers() {

    var table = document.getElementById("driversTable");

    var sortedDrivers = drivers.slice();

    sortedDrivers.sort(function(a, b) {
        return a.totalTime - b.totalTime;
    });

    var html = "";

    for (var i = 0; i < sortedDrivers.length; i++) {

        var d = sortedDrivers[i];

        var timeText = "-";

        if (currentLap > 0) {
            timeText = d.totalTime.toFixed(2) + " s";
        }

        html += "<tr>";

        html += "<td>" + (i + 1) + "</td>";

        html += "<td>" + d.name + "</td>";

        html += "<td>" + d.team + "</td>";

        html += "<td>" + d.speed + "</td>";

        html += "<td>" + d.skill + "/10</td>";

        html += "<td>" + d.tire + "</td>";

        html += "<td>" + timeText + "</td>";

        html += "<td>" + d.status + "</td>";

        html += "</tr>";
    }

    table.innerHTML = html;
}


// Presmetka na vreme za eden krug
function calculateLapTime(driver) {

    var lapTime = 100 - (driver.speed - 300) * 0.15;

    lapTime = lapTime - driver.skill * 0.25;

    if (driver.tire == "Soft") {
        lapTime = lapTime - 1.2;
    } else {
        lapTime = lapTime + 0.4;
    }

    return lapTime;
}


// Dodavanje poraki za nastanite
function addLog(message) {

    var log = document.getElementById("raceLog");

    log.innerHTML =
        '<div class="log-entry">' + message + '</div>' +
        log.innerHTML;
}


// Izvrsuvanje na eden krug
function nextLap() {

    if (raceFinished) {
        return;
    }

    currentLap++;

    safetyCar = false;

    if (Math.random() < 0.20) {
        safetyCar = true;
    }

    var lapMessages = [];

    for (var i = 0; i < drivers.length; i++) {

        var d = drivers[i];

        var lapTime = calculateLapTime(d);

        d.status = "Vo trka";


        // PIT STOP
        if (!d.hasPitted && currentLap == d.pitLap) {

            lapTime = lapTime + 22;

            d.hasPitted = true;

            if (d.tire == "Soft") {
                d.tire = "Hard";
            } else {
                d.tire = "Soft";
            }

            d.status = "PIT-STOP - promena na gumi";

            lapMessages.push(
                d.name + " vleze vo pit-stop i gi smeni gumite."
            );
        }


        // IZVRTUVANJE
        if (Math.random() < (11 - d.skill) * 0.008) {

            var spinTime = Math.floor(Math.random() * 6) + 5;

            lapTime = lapTime + spinTime;

            if (d.status == "Vo trka") {
                d.status = "Izvrtuvanje - +" + spinTime + " s";
            } else {
                d.status = d.status + " / Izvrtuvanje";
            }

            lapMessages.push(
                d.name + " se izvrtе na patkata."
            );
        }


        // BEZBEDNOSNO VOZILO
        if (safetyCar) {

            lapTime = lapTime + 5;

            if (d.status == "Vo trka") {
                d.status = "Bezbednosno vozilo";
            } else {
                d.status = d.status + " / Bezbednosno vozilo";
            }
        }


        d.totalTime = d.totalTime + lapTime;
    }


    document.getElementById("lapNumber").innerHTML =
        currentLap + " / 10";

    document.getElementById("raceStatus").innerHTML = "Vo tek";

    document.getElementById("safetyCarStatus").innerHTML =
        safetyCar ? "Da" : "Ne";


    if (safetyCar) {
        lapMessages.push(
            "Izleze bezbednosno vozilo! Site vozaci dobivaat 5 sekundi."
        );
    }


    if (lapMessages.length == 0) {

        addLog(
            "Krug " + currentLap +
            ": Site vozaci go zavrsija krugot bez posebni nastani."
        );

    } else {

        for (var j = 0; j < lapMessages.length; j++) {

            addLog(
                "Krug " + currentLap + ": " + lapMessages[j]
            );
        }
    }


    showDrivers();


    if (currentLap == 10) {
        finishRace();
    }
}


// Kraj na trkata
function finishRace() {

    raceFinished = true;

    var sortedDrivers = drivers.slice();

    sortedDrivers.sort(function(a, b) {
        return a.totalTime - b.totalTime;
    });

    var winner = sortedDrivers[0];

    document.getElementById("raceStatus").innerHTML = "Zavrshena";

    document.getElementById("winnerBox").style.display = "block";

    document.getElementById("winnerText").innerHTML =
        winner.name + " (" + winner.team + ") - " +
        winner.totalTime.toFixed(2) + " sekundi";


    document.getElementById("nextButton").disabled = true;

    document.getElementById("autoButton").disabled = true;

    addLog("TRKATA E ZAVRSHENA! Pobednik e " + winner.name + ".");

    showDrivers();
}


// Avtomatsko izvrsuvanje na site preostanati krugovi
function runRace() {

    while (currentLap < 10) {
        nextLap();
    }
}

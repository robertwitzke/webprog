function addCounterListItem() {
    fetch("/countdata")
    .then((response) => response.json())
    .then((liste) => {
        for (let i = 0; i < liste.length; i++) {
        const list = document.getElementById("most_list");
        var entry = document.createElement('li');
        entry.innerHTML = "Die " + liste[i][0] + "-Seite wurde " + liste[i][1] + " Mal besucht.";
        list.appendChild(entry);
        }
    });
};

function addListItem() {
    fetch("/data")
    .then((response) => response.json())
    .then((liste) => {
        liste.forEach((favorite) => {
            const liste = document.getElementById("favorites_list");
            var entry = document.createElement('li');
            entry.innerHTML = favorite;
            liste.appendChild(entry);
        });
    });
};

function addComment() {
    fetch("/commentsdata")
    .then((response) => response.json())
    .then((liste) => {
        for (let i = 0; i < liste.length; i++) {
        const list = document.getElementById("comment_list");
        var entry = document.createElement('p');
        entry.innerHTML = liste[i].author + " schreibt : " + liste[i].comment;
        list.appendChild(entry);
        }
    });
};
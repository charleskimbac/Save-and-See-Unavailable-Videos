import { saveData, youtubeKey, getData } from "./secret.js";

document.getElementById("show-data").style.display = "none";
document.getElementById("invalid-id").style.display = "none"; 

//Checks if valid playlistId
var playlistName;
async function checkPlaylistId(){
    var playlistId = document.getElementById("playlistId").value;
    const playlistInfoURL = "https://youtube.googleapis.com/youtube/v3/playlists?key=" + youtubeKey + "&part=snippet%2Cstatus&id=";
    const playlistItemsURL = "https://youtube.googleapis.com/youtube/v3/playlistItems?key=" + youtubeKey + "&part=snippet&maxResults=50&playlistId=";
    var container = document.getElementById("invalid-id");

    const result = await fetch(playlistInfoURL + playlistId);
    result.json().then(data => {
        console.log("info: ", data);
        if (data.items.length == 0){
            document.getElementById("show-data").style.display = "none"; //Hide
            container.style.display = "block"; //Show error msg
        }
        else {
            document.getElementById("show-data").style.display = "block"; //Show
            container.style.display = "none"; //Dont show error msg
            playlistName = data.items[0].snippet.localized.title;
            document.getElementById("playlist-name").textContent = playlistName;
            callPlaylistItems(playlistItemsURL + playlistId);
        }
    });
}

//show videos in playlist, save data into json
var saveThis = {};
async function callPlaylistItems(URL){
    const result = await fetch(URL);
    result.json().then(data => {
        console.log("items: ", data);
        for (var i = 0; i < data.items.length; i++){
            //naming the data
            var addedRaw = data.items[i].snippet.publishedAt;
            var added = addedRaw.split("T")[0]; // Split the string at "T" and take the first part
            var title = data.items[i].snippet.title;
            var channel = data.items[i].snippet.videoOwnerChannelTitle;
            var channelId = data.items[i].snippet.videoOwnerChannelId;
            var videoId = data.items[i].snippet.resourceId.videoId;

            var videoLink = "https://youtube.com/watch?v=" + videoId;
            var channelLink = "https://www.youtube.com/channel/" + channelId;

            var childData = {
                id: videoId,
                title: title,
                channel: channel,
                added: added,
                channelLink: channelLink,
                videoLink: videoLink
            };
            saveThis["" + i] = childData;

            var container = document.getElementById("current-videos");
            var paragraph = document.createElement("p");
            paragraph.innerHTML = "Added on " + added + ":<br>" + "\"<a href=" + videoLink + ">" + title + "</a>\"" + " by " + "<a href=" + channelLink + ">" + channel + "</a>";
            container.appendChild(paragraph);
        }
    });
}

//empties currently shown videos (if any) so they dont keep adding
function resetShownVideos(){
    console.log("reset");
    document.getElementById("current-videos").innerHTML = "";
}

window.addEventListener("load", () => {
    document.getElementById("enter").addEventListener("click", () => {
        console.log("pressed enter");
        resetShownVideos();
        checkPlaylistId();
    });
    document.getElementById("save").addEventListener("click", () => {
        console.log("pressed save");
        saveData(playlistName, saveThis);
    });
    document.getElementById("load").addEventListener("click", () => {
        console.log("pressed load");
        loadData();
    });
});

async function loadData(){
    var data = await getData();
    console.log("loading: ", data);

    var container = document.getElementById("stored-data");


    var length = Object.keys(data).length;
    for (var playlist = 0; playlist < length; playlist++) {
        var name = Object.keys(data)[playlist];



        //naming the data
        var title = data.name.title;
        var channel = data[playlist].channel;
        var id = data[playlist].id;
        var added = data[playlist].added;
        var channelLink = data[playlist].channelLink;
        var videoLink = data[playlist].videoLink;

        var paragraph = document.createElement("p");
        paragraph.innerHTML = "Added on " + added + ":<br>" + "<a href=" + videoLink + ">\"" + title + "\"</a>" + " by " + "<a href=" + channelLink + ">" + channel + "</a>";
        container.appendChild(paragraph);
    }
}
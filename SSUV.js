import { saveData, youtubeKey, getData } from "./secret.js";

document.getElementById("current-videos").style.display = "none";
document.getElementById("invalid-id").style.display = "none"; 


function playlistEntered(){
    console.log("pressed enter");
    var playlistId = document.getElementById("playlistId").value;
    checkPlaylistId(playlistId);
}

var playlistName;

//Checks if valid playlistId
async function checkPlaylistId(playlistId){
    const playlistInfoURL = "https://youtube.googleapis.com/youtube/v3/playlists?key=" + youtubeKey + "&part=snippet%2Cstatus&id=";
    const playlistItemsURL = "https://youtube.googleapis.com/youtube/v3/playlistItems?key=" + youtubeKey + "&part=snippet&maxResults=50&playlistId=";
    var container = document.getElementById("invalid-id");
    const result = await fetch(playlistInfoURL + playlistId);
    result.json().then(data => {
        console.log("info: ", data);
        if (data.items.length == 0){
            document.getElementById("current-videos").style.display = "none"; //Hide
            container.style.display = "block"; //Show error msg
        }
        else {
            document.getElementById("current-videos").style.display = "block"; //Show
            container.style.display = "none"; //Dont show error msg
            playlistName = data.items[0].snippet.localized.title;
            callPlaylistItems(playlistItemsURL + playlistId);
        }
    });
}

//API Call, show data on website, save data into array to save
var videoIds = {};
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
            videoIds["video" + i] = childData;

            var container = document.getElementById("current-videos");
            var paragraph = document.createElement("p");
            paragraph.innerHTML = "Added on " + added + ":<br>" + "<a href=" + videoLink + ">\"" + title + "\"</a>" + " by " + "<a href=" + channelLink + ">" + channel + "</a>";
            container.appendChild(paragraph);
        }
    });
}

window.addEventListener("load", () => {
    document.getElementById("enter").onclick = playlistEntered;
    document.getElementById("save").addEventListener("click", () => {
        saveData(videoIds);
    });
    document.getElementById("load").addEventListener("click", () => {
        loadData(videoIds);
    });
});




/*
export function getData(){
    var container = document.getElementById("stored-data");

    const databaseRef = ref(database, "/");

    // Read data from the database
    onValue(databaseRef, (snapshot) => {
        const data = snapshot.val();
        console.log("get: ", data);

        for (const playlist in data) {
            if (data.hasOwnProperty(playlist)) {
                //naming the data
                var title = data[playlist].title;
                var channel = data[playlist].channel;
                var id = data[playlist].id;
                var added = data[playlist].added;
                var channelLink = data[playlist].channelLink;
                var videoLink = data[playlist].videoLink;

                var paragraph = document.createElement("p");
                //paragraph.innerHTML = "Added on " + added + ":<br>" + "<a href=" + videoLink + ">\"" + title + "\"</a>" + " by " + "<a href=" + channelLink + ">" + channel + "</a>";
                container.appendChild(paragraph);

                console.log(playlist);
            }
        }
    });
}
*/

getData().then(data => {
    console.log(data);
});
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyB39_0hs_QW88Gf--hkqE-vPYvMNqenrWY",
    authDomain: "project-3-1ca3b.firebaseapp.com",
    databaseURL: "https://project-3-1ca3b.firebaseio.com",
    projectId: "project-3-1ca3b",
    storageBucket: "project-3-1ca3b.appspot.com",
    messagingSenderId: "877207954481",
    appId: "1:877207954481:web:b7b70a4bd8adb85b682110",
    measurementId: "G-V0TNP0QX8H"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// Refernece contactInfo collections
let contactInfo = firebase.database().ref("infos");

// Listen for a submit
document.querySelector(".command-form").addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    //   Get input Values
    let direction = document.querySelector(".direction").value;
    let distance = document.querySelector(".distance").value;
    let createdBy = document.querySelector(".created-by").value;
    console.log(direction, distance, createdBy);

    saveCommand(direction, distance, createdBy);

    document.querySelector(".command-form").reset();
}

// Save infos to Firebase
function saveCommand(direction, distance, createdBy) {
    let newContactInfo = contactInfo.push();

    newContactInfo.set({
        direction: direction,
        distance: distance,
        createdBy: createdBy
    });
}

//Retrieve infos
let ref = firebase.database().ref("infos");
ref.on("value", getData);

function getData(data) {
    let info = data.val();
    let keys = Object.keys(info);

    for (let i = 0; i < keys.length; i++) {
        let infoData = keys[i];
        let direction = info[infoData].direction;
        let distance = info[infoData].distance;
        let createdBy = info[infoData].createdBy;
        console.log(direction, distance, createdBy);
    }
}
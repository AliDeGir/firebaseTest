// auth module - module 3
import { fetchMessagesDb, addMessageDb, fetchWithSnapshot } from "./firestore.js"
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"


const auth = getAuth();
// User online status
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User logged in: ', user);
        // addFilesToHtml();
        fetchWithSnapshot();
        document.getElementById('chat-container').style.display = "flex";
        document.getElementById('login-form').style.display = "none";
        document.getElementById('logout-btn').style.display = "flex";
    } else {
        console.log('User logged out: ', user);
        document.querySelector('#display-data').innerHTML = '';
    }
})

// testing style flex/none function
function hideToggle() {
    let element = document.getElementById('chat-container');
    element.classList.toggle("hidden")
}


// add comments to database
const commentBtn = document.querySelector('#comment-btn')
commentBtn.addEventListener('click', function() {
    addMessageDb();
})



// login - checkout submit function for from
const loginForm = document.querySelector('#login-form');

const loginBtn = document.querySelector('#login-btn');

loginBtn.addEventListener('click', function() {
    console.log('Login button clicked')
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    signInWithEmailAndPassword(auth, email, password);

    document.querySelector('#email').value = "";
    document.querySelector('#password').value = "";

})

// logout
const logoutBtn = document.querySelector('#logout-btn');
logoutBtn.addEventListener('click', function() {
    signOut(auth);
    document.getElementById('login-form').style.display = "flex";
    document.getElementById('chat-container').style.display = "none";
    document.getElementById('logout-btn').style.display = "none";
    console.log('Log out button clicked')
})
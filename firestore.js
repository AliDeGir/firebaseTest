// firestor DB module - module 2
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, query, getDoc, getDocs, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// getting data from firestore DB for website static html
async function fetchMessagesDb() {
    try {
        const querySnapshot = await getDocs(collection(db, "messagesApp/messages/messagesDB"));
        const data = [];
        querySnapshot.forEach((doc) => {
            // Push each document data to the data array
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error("Error getting documents:", error);
    }
}

// snapshot listener for chat
async function fetchWithSnapshot() {
    const toDisplay = document.querySelector('#display-data');
    const unsub = onSnapshot(collection(db, "messagesApp/messages/messagesDB"), (snapshot) => {
        let messagesArray = [];
        snapshot.docs.forEach(doc => {
            const messages = doc.data();
            messagesArray.push({
                id: doc.id,
                timeStamp: messages.timeStamp,
                alias: messages.alias,
                content: messages.content
            });
            console.log("Current data: ", doc.data());
        });

        // Sort messages by timestamp
        messagesArray.sort((a, b) => a.timeStamp - b.timeStamp);

        let html = '';
        messagesArray.forEach(message => {
            const date = new Date(message.timeStamp);
            const localDate = date.toLocaleDateString();
            const localTime = date.toLocaleTimeString([], { timeStyle: 'short' });

            const li = `
            <li>
                <div style="color: gray; font-size: 10px">${localDate}-${localTime}</div>
                <div><span style="color: orange"><i>${message.alias}: </i></span>${message.content}</div>
            </li><br>
            `;
            html += li;
        });

        toDisplay.innerHTML = html;
    });

    // Cleanup function to unsubscribe from the Firestore listener
    return () => {
        unsub();
    };
}


// add new comment to DB
async function addMessageDb() {
    const commentInput = document.querySelector('#comment-input').value;
    const aliasInput = document.querySelector('#alias-input').value;
    const user = auth.currentUser;
    const uid = user.uid;
    const doqref = await addDoc(collection(db, "messagesApp/messages/messagesDB"), {
        content: commentInput,
        timeStamp: Date.now(),
        userId: uid,
        alias: aliasInput
    });
    document.querySelector('#comment-input').value = "";
}

export { fetchMessagesDb, addMessageDb, fetchWithSnapshot }
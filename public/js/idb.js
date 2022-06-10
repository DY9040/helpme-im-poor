// create variable to hold db connection
let db;
// establish connection to IndexedDB and set as version 1 
const request = indexedDB.open('budget', 1);

// this event will emit if the database version changes
request.onupgradeneeded = function(event) {
    //save a reference to the database
    const db = event.target.result;
    // create an object store called 'new transaction
    db.createObjectStore('new transaction', {autoIncrement: true});
};

// upon a successful connection, this event will emit
request.onsuccess = function(event) {
    db = event.target.result;
    // check if app is online, if so, call uploadtransaction()
    if (navigator.onLine) {
        uploadTransaction();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    
    const transaction = db.transaction(['new transaction'], 'readwrite');

    transactionObjectStore = transaction.objectStore('new transaction');

    transactionObjectStore.add(record);
}

function uploadTransaction() {
    // get all records from object store
    const transaction = db.transaction(['new transaction'], 'readwrite');
    transactionObjectStore = transaction.objectStore('new transaction');
    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new transaction'], 'readwrite');
                const transactionObjectStore = transaction.objectStore('new transaction');
                transactionObjectStore.clear();
                alert('All saved transactions have been uploaded');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
};

window.addEventListener('online', uploadTransaction);
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyDRv2sUSBbgsnoJsT1LnUcsE6eFaXXzlDk",
    authDomain: "glimpses-8bf56.firebaseapp.com",
    projectId: "glimpses-8bf56",
    storageBucket: "glimpses-8bf56.appspot.com",
    messagingSenderId: "90716597482",
    appId: "1:90716597482:web:94de9cb882f480504e7b93",
    measurementId: "G-Q00N0G3WRX"
};

/*if (!firebase.apps.length) {
    const app = firebase.initializeApp(firebaseConfig);
}else {
    firebase.app();
}*/

const app = initializeApp(firebaseConfig);
const db = getFirestore();
export const auth = getAuth(app);
export default app;

export function addDocument(collection, data) {
    return new Promise((Resolve, Reject) => {
        addDoc(collection(db, collection), data)
        Resolve(data.id)
    })
}

export function updateField(ref, field) {
    return new Promise((Resolve, Reject) => {
        db.doc(ref).get().then((snap) => {
            db.doc(ref).update({
                'messages': [...snap.data().messages, field],
            })
            Resolve()
        })
    })
}

export function searchDocuments(collection, field, comparison, value) {
    return new Promise((Resolve, Reject) => {
        db.collection(collection).where(field, comparison, value).get().then(snapshot => {
            if (!snapshot.empty) {
                const dbData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                Resolve(dbData)
            } else {
                Reject(false)
            }
        })
    });
}

/*
export function removeDocument(collection, document) {
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        db.collection(collection).doc(document).get().then((docSnap) => {
            if (docSnap.exists) {
                db.collection(collection).doc(document).delete().then(() => {
                    setDeleted(true)
                })
            } else {
                setDeleted(false)
            }
        });
    }, [collection, document])

    return deleted;
}

export function documentExists(collection, document) {
    const [exists, setExists] = useState(false);

    useEffect(() => {
        db.collection(collection).doc(document).get().then((docSnap) => {
            if (docSnap.exists) {
                setExists(true)
            } else {
                setExists(false)
            }
        });
    }, [collection, document])

    return exists;
}

export function useCollection2(collection, orderBy) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        db.collection(collection).orderBy(orderBy).onSnapshot((snapshot) => {
            const dbData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setData(dbData)
            setLoading(false)
        })
    }, [collection, orderBy])

    return { loading, data }
}*/

export function useCollection(collection, orderBy, order) {
    return new Promise((Resolve) => {
        db.collection(collection).orderBy(orderBy, order).limit(50).onSnapshot((snapshot) => {
            const dbData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            Resolve(dbData)
        })
    })
}

export function grabCollection(collection, orderBy) {
    return new Promise((Resolve) => {
        db.collection(collection).get().then((docs) => {
            Resolve(docs.size);
        })
    })
}

export function getFromRef(ref) {
    return new Promise((Resolve, Reject) => {
        db.doc(ref).get().then((snap) => {
            //console.log(snap.data())
            Resolve(snap.data());
        })
    })
}

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, storage } from "./firebase"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useState } from "react";

const upload = async(file) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // file store in ref
    const storageRef = ref(storage, `userImages/${user.uid}`);

    // upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress} % done`)
            },
            (error) => {
                reject("Something wrong" + error.code);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                })
            }
        )
    })
}

export default upload
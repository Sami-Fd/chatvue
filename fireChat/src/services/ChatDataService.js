import { auth, firestore } from "../firebase";

const db = firestore.collection("/messages");

class ChatDataService {
    getUser() {
        return auth;
    }
    getAll(discussionId) {
        return db.doc(discussionId).collection("/message");
    }
    create(msg) {
        return db
            .doc()
            .collection("/message")
            .add(msg);
    }

    update(id, value) {
        return db.doc(id).update(value);
    }

    delete(id) {
        return db.doc(id).delete();
    }
}

export default new ChatDataService();
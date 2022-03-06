import { firestore } from "../firebase";

const db = firestore.collection("/users");

class UsersService {
    getAll() {
        return db;
    }
    create(user) {
        return db.add(user);
    }

    update(id, value) {
        return db.doc(id).update(value);
    }

    delete(id) {
        return db.doc(id).delete();
    }
}

export default new UsersService();
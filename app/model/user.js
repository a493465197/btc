module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        username: {
            type: String
        },
        password: {
            type: String
        },
        name: {
            type: String
        },
        birth: {
            type: String
        },
        socketId: {
            type: String
        },
        hash: {
            type: Number
        },
        time: {
            type: Number,
            default: () => Date.now()
        },
        coin: Number,
        isAdmin: {
            type: Boolean,
            default: false
        },
        auth: {
            type: Array
        },
        address: {
            type: String,
            default: () => Math.random().toString().slice(2, 12) + Math.random().toString().slice(2, 12)
        },

    });
    return mongoose.model('User', UserSchema, 'user');
}
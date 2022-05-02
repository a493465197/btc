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
        time: {
            type: Number,
            default: () => Date.now()
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        auth: {
            type: Array
        }

    });
    return mongoose.model('User', UserSchema, 'user');
}
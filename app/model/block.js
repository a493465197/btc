module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const BlockSchema = new Schema({
        // title: {
        //     type: String
        // },
        // title: {
        //     type: String,
        // },
        id: {
            type: String,
            default: () => Math.random().toString().slice(2,12)
        },

        time: {
            type: Number,
            default: () => Date.now()
        },
        username: {
            type: String
        },
        blockSize: Number,
        currHeight: {
            type: Number,
        },
        // status: String

    });
    return mongoose.model('Block', BlockSchema, 'block');
}
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const TransSchema = new Schema({
        address: {
            type: String
        },
        toAddress: {
            type: String
        },
        username: {
            type: String,
        },
        coin: Number,
        id: {
            type: String,
            default: () => Math.random().toString().slice(2, 12)
        },

    });
    return mongoose.model('Trans', TransSchema, 'trans');
}
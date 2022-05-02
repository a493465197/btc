module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const ConfigSchema = new Schema({
        intervalTime: {
            type: Number
        },
        // title: {
        //     type: String
        // },
        currHeight: {
            type: Number,
        },
        id: {
            type: String,
            default: () => Math.random().toString().slice(2,12)
        },

        time: {
            type: Number,
            default: () => Date.now()
        },
        brockSize: {
            type: Number
        },
        nextBrockTime: {
            type: Number
        },


    });
    return mongoose.model('Config', ConfigSchema, 'config');
}
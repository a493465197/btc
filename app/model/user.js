let array = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];
const getAddr = () => {
    let str = ''
    for (let i = 0; i < 36; i++) {
        str +=
            array[Math.round(Math.random() * (array.length - 1))];
    }
    return str
}

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
            default: getAddr
        },

    });
    return mongoose.model('User', UserSchema, 'user');
}
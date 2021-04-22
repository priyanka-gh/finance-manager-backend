const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    expenses: {
        type: Array,
        default: []
    },
    income: {
        type: Array,
        default: []
    },
    totalBalance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

userSchema.methods = {
    authenticate: function(password) {
        return password === this.password;
    }
}

module.exports = mongoose.model("User", userSchema);
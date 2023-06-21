import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
    region: {
        type: String,
        required: true
    },
    municipality: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    data: {
        type: Array,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        default: 'pending',
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;
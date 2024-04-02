import mongoose from 'mongoose'

const RequestSchema = new mongoose.Schema(
    {
        request: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
)
export default mongoose.model('Request', RequestSchema)

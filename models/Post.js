import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
    {

            username: { type: String },
            title: { type: String, required: true },
            text: { type: String, required: true },
            area: { type: Number, required: true },
            markerLat: { type: Number, default: 0 },
            markerLng: { type: Number, default: 0 },
            img_url: { type: String, default: '' },
            views: { type: Number, default: 0 },
            coordinates: { type: String, default: '' },
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
            requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
    },
    { timestamps: true },
);


export default mongoose.model('Post', PostSchema)

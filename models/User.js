import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            default: '0',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    { timestamps: true },
)

export default mongoose.model('User', UserSchema)

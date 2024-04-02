import Request from '../models/Request.js'
import Post from '../models/Post.js'

// Create Request
export const createRequest = async (req, res) => {
    try {
        const { request } = req.body;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }


        const newRequest = new Request({request});
        await newRequest.save();

        try {
            await Post.findByIdAndUpdate(postId, {
                $push: { requests: newRequest._id },
            })
        } catch (error) {
            console.log(error)
        }

        res.json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//
// export const getAllRequestsForPost = async (req, res) => {
//     try {
//         const postId = req.params.id;
//
//         // Находим пост
//         const post = await Post.findById(postId);
//
//         if (!post) {
//             return res.status(404).json({ message: 'Пост не найден' });
//         }
//
//         // Находим все запросы для этого поста
//         const requests = await Request.find({ _id: { $in: post.requests } });
//
//         res.json(requests);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
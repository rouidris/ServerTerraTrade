import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'

function convertToDBArray(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
    }

    // Обработка исходной строки данных
    const cleanedData = data.replace(/[[\]\s'"]+/g, ''); // Удаляем кавычки, пробелы и лишние символы

    // Разделение строки на отдельные пары координат
    const coordinatesArray = cleanedData.split('],[');

    // Преобразование строковых координат в числа
    const result = coordinatesArray.map(coords => {
        const [num1, num2] = coords.split(',').map(Number);
        return [num1, num2];
    });

    return [result];
}

// Create Post
export const createPost = async (req, res) => {
    try {
        const { title, text, area, markerLat, markerLng,  coordinates } = req.body
        const user = await User.findById(req.userId)

        // Преобразовать координаты с использованием вашей функции
        const coordinatesObject = convertToDBArray(coordinates);

        const newPostWithoutImage = new Post({
            username: user.username,
            title,
            text,
            area,
            markerLat,
            markerLng,
            coordinates,
            imgUrl: '',
            author: req.userId,
        })
        await newPostWithoutImage.save()
        await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithoutImage },
        })
        res.json(newPostWithoutImage)
    } catch (error) {
        res.json(res.status(500).json({ error: error.message }))
    }
}

// Get All Posts
export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().sort('-createdAt')
        const popularPosts = await Post.find().limit(5).sort('-views')

        if (!posts) {
            return res.json({ message: 'Постов нет' })
        }

        res.json({ posts, popularPosts })
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Get Post By Id
export const getById = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 },
        })
        res.json(post)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Get All Posts
export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const list = await Promise.all(
            user.posts.map((post) => {
                return Post.findById(post._id)
            }),
        )

        res.json(list)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Remove post
export const removePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
        if (!post) return res.status(404).json({ message: 'Такого поста не существует' });

        // Удаляем идентификатор поста из массива постов пользователя
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { posts: req.params.id },
        });

        res.json({ message: 'Пост был удален.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Update post
export const updatePost = async (req, res) => {
    try {
        const { title, text, area, markerLat, markerLng, coordinates,  id } = req.body
        const post = await Post.findById(id)


        post.title = title
        post.text = text
        post.area = area
        post.markerLat = markerLat
        post.markerLng = markerLng
        post.coordinates = coordinates

        await post.save()

        res.json(post)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Get Post Comments
export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const list = await Promise.all(
            post.comments.map((comment) => {
                return Comment.findById(comment)
            }),
        )
        res.json(list)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

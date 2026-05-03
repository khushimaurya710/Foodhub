import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [videos, setVideos] = useState([])
    const [statusMessage, setStatusMessage] = useState("Loading videos...")

    useEffect(() => {
        axios.get("https://foodhub-backend-yvpj.onrender.com/api/food", { withCredentials: true })
            .then(response => {
                console.log(response.data);
                const items = response.data.foodItems ?? []
                setVideos(items)
                if (items.length === 0) {
                    setStatusMessage("No videos available yet. Check back soon!")
                } else {
                    setStatusMessage("")
                }
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    setStatusMessage("Please log in as a user to see food videos.")
                } else {
                    setStatusMessage("Could not load videos. Please try again.")
                }
            })
    }, [])

    async function likeVideo(item) {
        try {
            const response = await axios.post(
                "https://foodhub-backend-yvpj.onrender.com/api/food/like",
                { foodId: item._id },
                { withCredentials: true }
            )

            if (response.data.like) {
                setVideos((prev) =>
                    prev.map((v) =>
                        v._id === item._id ? { ...v, likeCount: (v.likeCount ?? 0) + 1 } : v
                    )
                )
            } else {
                setVideos((prev) =>
                    prev.map((v) =>
                        v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount ?? 1) - 1) } : v
                    )
                )
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                setStatusMessage("Please log in as a user to like videos.")
            }
        }
    }

    async function saveVideo(item) {
        try {
            const response = await axios.post(
                "https://foodhub-backend-yvpj.onrender.com/api/food/save",
                { foodId: item._id },
                { withCredentials: true }
            )

            if (response.data.save) {
                setVideos((prev) =>
                    prev.map((v) =>
                        v._id === item._id ? { ...v, savesCount: (v.savesCount ?? 0) + 1 } : v
                    )
                )
            } else {
                setVideos((prev) =>
                    prev.map((v) =>
                        v._id === item._id
                            ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) }
                            : v
                    )
                )
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                setStatusMessage("Please log in as a user to save videos.")
            }
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage={statusMessage || "No videos available."}
        />
    )
}

export default Home
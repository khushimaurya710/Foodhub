import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const { id } = useParams()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])
    const [ deletingId, setDeletingId ] = useState(null)

    useEffect(() => {
        axios.get(`https://foodhub-backend-yvpj.onrender.com/api/food-partner/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
    }, [ id ])

    const handleDelete = async (videoId) => {
        if (!window.confirm("Delete this reel permanently?")) return;
        try {
            setDeletingId(videoId);
            await axios.delete(`hhttps://foodhub-backend-yvpj.onrender.com/api/food/${videoId}`, { withCredentials: true });
            setVideos(prev => prev.filter(v => v._id !== videoId));
        } finally {
            setDeletingId(null);
        }
    }


    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">

                    <img className="profile-avatar" src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D" alt="" />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed}</span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {videos.map((v) => (
                    <div key={v._id} className="profile-grid-item">
                        <div className="profile-grid-video-wrapper">
                            <video
                                className="profile-grid-video"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                src={v.video}
                                muted
                                playsInline
                                loop
                            />
                            <button
                                type="button"
                                className="profile-delete-btn"
                                disabled={deletingId === v._id}
                                onClick={() => handleDelete(v._id)}
                            >
                                {deletingId === v._id ? 'Deleting…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    )
}

export default Profile
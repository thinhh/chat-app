import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

const ProfilePage = () => {
    const { authUser, isUpdateProfile, updateProfile } = useAuthStore()
    return (
        <div>ProfilePage</div>
    )
}

export default ProfilePage
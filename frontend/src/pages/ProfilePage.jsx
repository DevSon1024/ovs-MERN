import { useState, useEffect } from 'react';
import { getUserProfile } from '../utils/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getUserProfile();
                setUser(data);
            } catch (err) {
                setError('Could not fetch profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
            <Alert message={error} type="error" />
            {user && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="mb-2"><strong>Name:</strong> {user.name}</p>
                    <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            )}
        </div>
    );
};
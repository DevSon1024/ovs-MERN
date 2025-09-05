import { useState, useEffect } from 'react';
import { getUsers } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

export default function VoterManagementPage() {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVoters = async () => {
            try {
                const { data } = await getUsers();
                setVoters(data.filter(user => user.role === 'voter'));
            } catch (err) {
                setError('Could not fetch voters. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchVoters();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Voter Management</h1>
            <Alert message={error} type="error" />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Name</th>
                            <th className="text-left">Email</th>
                            <th className="text-left">State</th>
                            <th className="text-left">City</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voters.map(voter => (
                            <tr key={voter._id}>
                                <td>{voter.name}</td>
                                <td>{voter.email}</td>
                                <td>{voter.state}</td>
                                <td>{voter.city}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
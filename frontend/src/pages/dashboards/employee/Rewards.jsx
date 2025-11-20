import { useEffect, useState } from "react";
import { getMyRewards } from "../../../api";

export default function Rewards() {
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await getMyRewards();
      setRewards(res.data.data || []);
      setTotalPoints(res.data.total_points || 0);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load rewards");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rewards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎁 Rewards</h1>
          <p className="text-sm text-gray-600">
            Track your earned rewards and points
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total Points</p>
          <div className="mt-1 inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-xl font-semibold">
            {totalPoints}
          </div>
        </div>
      </header>

      {rewards.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <p>No rewards received yet. Keep up the great work!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white shadow rounded-lg p-5 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-lg capitalize">
                  {reward.reward_type}
                </h3>
                <span className="text-indigo-600 font-bold text-sm bg-indigo-50 px-2 py-1 rounded">
                  +{reward.points} pts
                </span>
              </div>

              <p className="text-sm text-gray-700 font-medium mb-2">{reward.title}</p>
              <p className="text-sm text-gray-600 mb-4">{reward.description || "No description"}</p>

              <div className="text-xs text-gray-400">
                Awarded: {new Date(reward.date_awarded).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

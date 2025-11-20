import { useEffect, useState } from "react";
import { getMyRewards } from "../../../api";
import { Award, TrendingUp, Sparkles } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading rewards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 p-5 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Rewards
              </h1>
              <p className="text-gray-600 mt-1">
                Track your earned rewards and recognition points
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl min-w-[160px]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-white" />
              <p className="text-sm text-indigo-100 font-medium">Total Points</p>
            </div>
            <div className="text-4xl font-bold text-white">{totalPoints}</div>
          </div>
        </div>
      </header>

      {rewards.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
            <Award className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No rewards received yet</p>
          <p className="text-gray-400 text-sm mt-2">Keep up the great work and you'll earn rewards soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="group bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-md">
                  +{reward.points} pts
                </span>
              </div>

              <h3 className="font-bold text-gray-800 text-lg capitalize mb-2">
                {reward.reward_type}
              </h3>
              <p className="text-sm text-gray-700 font-medium mb-2">{reward.title}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {reward.description || "No description"}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-200">
                <TrendingUp className="w-4 h-4" />
                <span>Awarded {new Date(reward.date_awarded).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

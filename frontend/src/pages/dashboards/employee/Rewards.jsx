import { useEffect, useState } from "react";

export default function Rewards() {
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(120); // fake total points
  const [rewards, setRewards] = useState([]);
  const [redeemingId, setRedeemingId] = useState(null);
  const [error, setError] = useState("");

  // Simulate fetching data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRewards([
        {
          id: 1,
          title: "Free Lunch Voucher",
          description: "Enjoy a free lunch worth Ksh 500.",
          pts_required: 100,
          claimed: false,
        },
        {
          id: 2,
          title: "Extra Leave Day",
          description: "Redeem 1 additional leave day.",
          pts_required: 200,
          claimed: false,
        },
        {
          id: 3,
          title: "Company Hoodie",
          description: "Official company-branded hoodie.",
          pts_required: 150,
          claimed: true,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleRedeem = (id, ptsRequired) => {
    if (ptsRequired > totalPoints) {
      setError("You don’t have enough points for this reward.");
      return;
    }

    setError("");
    setRedeemingId(id);

    // simulate redeeming
    setTimeout(() => {
      setRewards((prev) =>
        prev.map((r) => (r.id === id ? { ...r, claimed: true } : r))
      );
      setTotalPoints((prev) => prev - ptsRequired);
      setRedeemingId(null);
    }, 1000);
  };

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎁 Rewards</h1>
          <p className="text-sm text-gray-600">
            Track and redeem your earned points
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total Points</p>
          <div className="mt-1 inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-xl font-semibold">
            {loading ? "—" : totalPoints}
          </div>
        </div>
      </header>

      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading ? (
        <div className="p-6 bg-white rounded shadow text-center">
          Loading rewards…
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rewards.length === 0 ? (
            <div className="p-6 bg-white rounded shadow text-center">
              No rewards available.
            </div>
          ) : (
            rewards.map((r) => (
              <div
                key={r.id}
                className="bg-white p-5 rounded-lg shadow flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {r.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">Required:</span>
                    <span className="ml-2 font-bold text-indigo-600">
                      {r.pts_required} pts
                    </span>
                  </div>

                  {r.claimed ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Claimed
                    </span>
                  ) : (
                    <button
                      className={`px-3 py-2 rounded-lg font-semibold transition ${
                        r.pts_required <= totalPoints
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-200 text-gray-600 cursor-not-allowed"
                      }`}
                      disabled={
                        r.pts_required > totalPoints || redeemingId === r.id
                      }
                      onClick={() => handleRedeem(r.id, r.pts_required)}
                    >
                      {redeemingId === r.id ? "Redeeming..." : "Redeem"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

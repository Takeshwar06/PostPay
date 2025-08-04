import { BadgeCheck, Eye, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "../../utils/axiosPrivate";


const MyClaims = ({}) => {
    const navigate = useNavigate();
    const [claims, setClaims] = useState([]);

    const fetchClaims = async () => {
        try {
            const response = await axiosPrivate.get("/api/v1/claims/user");
            console.log(response.data);
            setClaims(response.data?.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        fetchClaims();
    },[])
    
  return (
    <div className="p-4 space-y-6">
           {/* + Claim Button */}
    <div className="flex justify-end">
      <button
        onClick={() => navigate("/user/create-claim")}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
      >
        <span className="text-xl leading-none">+</span> Claim
      </button>
    </div>
      {claims?.map((claim) => (
        <div
          key={claim._id}
          className="border rounded-2xl shadow p-4 space-y-4 bg-white"
        >
          {/* Claim Info */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">
              Claim ID: {claim._id.slice(-6)}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                claim.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : claim.status.includes("rejected")
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {claim.status.replaceAll("_", " ")}
            </span>
          </div>

          {/* Posts List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {claim.posts.map(({ post, likes, views, screenshot }) => (
              <div
                key={post._id}
                className="border rounded-lg p-3 shadow-sm space-y-2 bg-gray-50"
              >
                <img
                  src={post.image }
                  alt="Post"
                  className="w-full h-40 object-cover rounded-md"
                />
                 <p className="text-sm text-gray-600">screenshot</p>
                 <img
                  src={screenshot}
                  alt="screenshot"
                  className="w-full h-20 object-cover rounded-md"
                />
                <p className="text-sm text-gray-700 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" /> {likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-blue-500" /> {views}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Claim Summary */}
          <div className="pt-3 border-t text-sm text-gray-600 grid sm:grid-cols-2 gap-3">
            <p>
              <strong>Total Likes:</strong> {claim.totalLikes}
            </p>
            <p>
              <strong>Total Views:</strong> {claim.totalViews}
            </p>
            <p>
              <strong>Requested Amount:</strong> ₹{claim.requestedAmount}
            </p>
            <p>
              <strong>Final Amount:</strong> ₹{claim.finalAmount}
            </p>
            {claim.deductionAmount > 0 && (
              <p className="text-red-600">
                <strong>Deduction:</strong> ₹{claim.deductionAmount}
              </p>
            )}
            {claim.deductionReason && (
              <p className="text-gray-700">
                <strong>Reason:</strong> {claim.deductionReason}
              </p>
            )}
            {claim.userNote && (
              <p className="text-gray-700">
                <strong>User Note:</strong> {claim.userNote}
              </p>
            )}
            <p>
              <strong>Stage:</strong> {claim.stage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyClaims;

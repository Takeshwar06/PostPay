import { Flag, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { useEffect, useState } from "react";
import axiosPrivate from "../../utils/axiosPrivate";

export default function AdDashboard() {
  const [claims, setClaims] = useState([]);
  const [endPoint, setEndPoint] = useState("/api/v1/claims");

  const fetchClaims = async () => {
    try {
      const response = await axiosPrivate.get(endPoint);
      console.log(response.data);
      setClaims(response.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [endPoint]);
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Admin Dashboard (Claims)</h1>
        <div className="flex gap-3">
          <button
            className="px-2 py-1 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            onClick={() => setEndPoint("/api/v1/claims")}
          >
            Stage (All)
          </button>
          <button
            className="px-2 py-1 text-sm font-medium bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            onClick={() => setEndPoint("/api/v1/claims?stage=admin")}
          >
            Stage (Admin)
          </button>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {claims?.map((claim) => (
          <div className="border-1 p-1 rounded-sm">
            <AccordionItem value={claim?._id}>
              <AccordionTrigger>
                <div className="w-full  rounded-xl p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200">
                  {/* Left: User Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {claim?.user?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {claim?.user?.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        +91 {claim?.user?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Likes:</span>{" "}
                      {claim?.totalLikes}
                    </div>
                    <div>
                      <span className="font-medium">Views:</span>{" "}
                      {claim?.totalViews}
                    </div>
                    <div>
                      <span className="font-medium">Requested:</span> ₹
                      {claim?.requestedAmount}
                    </div>
                    <div>
                      <span className="font-medium">Final:</span> ₹
                      {claim?.finalAmount}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <span className="text-green-600 font-semibold">
                        {claim?.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Stage:</span> {claim?.stage}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="w-full px-4 py-0 space-y-6">
                  {/* Button Section */}
                  {/* <div className="flex justify-between items-center">
                    <button
                      onClick={() => navigate("/create-post")}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                      <Plus size={16} />
                      Create Post
                    </button>

                    <button
                      onClick={() => navigate("/user/my-claims")}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
                    >
                      <Flag size={16} />
                      View Claims
                    </button>
                  </div> */}

                  {/* Post Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                    {claim?.posts?.map((post, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow p-2 border border-gray-200 flex flex-col text-xs"
                      >
                        <img
                          src={post?.post?.image}
                          alt="Post"
                          className="w-full h-[90px] object-cover rounded-md mb-2"
                        />
                        <p className="text-[12px] text-gray-700 line-clamp-2 mb-1">
                          {post?.post?.content}
                        </p>
                        <div className="flex justify-between text-gray-500 text-[11px] mt-auto">
                          <span>❤️ {post?.likes}</span>
                          <span>👁️ {post?.views}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                    <h1>HISTORY (LOG)</h1>
                  <div className="flex flex-wrap gap-2">
                    {claim?.reviewHistory?.map((history, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-md shadow-sm border border-gray-200 p-2 text-xs w-[200px] h-auto"
                      >
                        <div className="text-[10px] text-gray-400 mb-1">
                          {new Date(history.createdAt).toLocaleString()}
                        </div>

                        <div className="font-semibold text-gray-700 truncate">
                          {history.message}
                        </div>

                        <div className="text-gray-600">
                          <span className="font-semibold">Action:</span>{" "}
                          {history.action}
                        </div>

                        <div className="text-gray-600">
                          <span className="font-semibold">Role:</span>{" "}
                          {history.role}
                        </div>

                        <div className="text-gray-600">
                          <span className="font-semibold">Amt:</span> ₹
                          {history.totalAmtNow}
                        </div>

                        <div className="pt-1 mt-1 border-t border-gray-100 text-gray-500 text-[11px] leading-tight">
                          <div>
                            <span className="font-medium">By:</span>{" "}
                            {history.actedBy.name}
                          </div>
                          <div>
                            <span className="font-medium">Ph:</span>{" "}
                            {history.actedBy.phone}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    </div>
  );
}

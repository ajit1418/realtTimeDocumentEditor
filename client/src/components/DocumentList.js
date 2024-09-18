import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [joinDocumentId, setJoinDocumentId] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/documents", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const createDocument = async (e) => {
    e.preventDefault();
    if (newDocumentTitle) {
      try {
        await axios.post(
          "http://localhost:5000/documents",
          { title: newDocumentTitle, content: "" },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setNewDocumentTitle("");
        fetchDocuments();
      } catch (error) {
        console.error("Error creating document:", error);
      }
    } else {
      toast.error("Document title can't be empty");
    }

  };

  const joinDocument = async (e) => {
    e.preventDefault();
    if (joinDocumentId) {
      try {
        await axios.post(
          `http://localhost:5000/documents/${joinDocumentId}/join`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setJoinDocumentId("");
        fetchDocuments();
        toast("Document added successfully !");
      } catch (error) {
        console.error("Error joining document:", error);
      }
    } else {
      toast.error("Document Id can't be empty");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-6xl p-6 space-x-10">

        {/* Left Section: Fixed Form */}
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Document Actions</h2>

          {/* Forms Section - Flexbox to display side-by-side */}
          <div className="flex space-x-6">

            {/* Left Form: Create Document */}
            <div className="w-1/2">
              <form onSubmit={createDocument} className="space-y-4">
                <input
                  type="text"
                  value={newDocumentTitle}
                  onChange={(e) => setNewDocumentTitle(e.target.value)}
                  placeholder="Type here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Create Document
                </button>
              </form>
            </div>

            {/* Right Form: Join Document */}
            <div className="w-1/2">
              <form onSubmit={joinDocument} className="space-y-4">
                <input
                  type="text"
                  value={joinDocumentId}
                  onChange={(e) => setJoinDocumentId(e.target.value)}
                  placeholder="Join By ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                >
                  Join Document
                </button>
              </form>
            </div>

          </div>
        </div>


        {/* Right Section: Scrollable Document List */}
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Documents</h2>
          {documents.length > 0 ? (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li key={doc._id} className="p-3 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Link
                    to={`/document/${doc._id}`}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No document is present</p>
          )}
        </div>
      </div>
    </div>


  );
}

export default DocumentList;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DocumentEdit() {
  const [document, setDocument] = useState({ title: '', content: '', owner: '' });
  const [collaborators, setCollaborators] = useState([]);
  const { id } = useParams();
  const [socket, setSocket] = useState(null);

  const copyDocumentId = () => {
    navigator.clipboard.writeText(id).then(() => {
      toast("Document ID copied!");
    }).catch(err => {
      toast.error("Failed to copy Document ID");
    });
  };


  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });
    setSocket(newSocket);

    newSocket.emit('join-document', id);

    newSocket.on('document-update', (updatedDoc) => {
      // console.log({ updatedDoc })
      setDocument(updatedDoc);
    });

    newSocket.on('collaborators-update', (updatedCollaborators) => {
      setCollaborators(updatedCollaborators);
    });

    return () => {
      newSocket.emit('leave-document', id);
      newSocket.disconnect();
    };
  }, [id]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setDocument(prev => ({ ...prev, content: newContent }));
    socket.emit('update-document', { documentId: id, content: newContent });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto space-y-4">
      {/* Document Title */}
      <h2 className="text-2xl font-semibold text-gray-700">{document.title}</h2>

      {/* Collaborators and Copy Button */}
      <div className="mb-4">
        {/* <div className="flex items-center mb-2">
          <button
            onClick={copyDocumentId}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Copy Document ID
          </button>
          <ToastContainer />
        </div> */}

        {/* Collaborators List */}
        <strong className="block text-gray-700 mb-2">Collaborators:</strong>
        <div className="flex flex-wrap">
          {collaborators.map((collaborator, index) => (
            <span key={index} className="flex items-center mr-4 mb-2">
              <span
                className={`mr-2 text-lg ${collaborator.isOnline ? 'text-green-500' : 'text-gray-400'
                  }`}
              >
                ●
              </span>
              <span
                className={`${collaborator.username === document.owner
                    ? 'font-bold'
                    : 'font-normal'
                  } text-gray-700`}
              >
                {collaborator.username}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Document Content Area */}
      <textarea
        value={document.content}
        onChange={handleContentChange}
        className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

  );
};


export default DocumentEdit;
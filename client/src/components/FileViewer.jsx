import { useState, useEffect } from 'react';
     import { useParams } from 'react-router-dom';
     import axios from 'axios';

     function FileViewer() {
       const { linkId } = useParams();
       const [file, setFile] = useState(null);
       const [verificationType, setVerificationType] = useState('none');
       const [name, setName] = useState('');
       const [verified, setVerified] = useState(false);
       const [error, setError] = useState('');

       useEffect(() => {
         const fetchLink = async () => {
           try {
             const res = await axios.get(`http://localhost:5000/api/links/${linkId}`);
             setFile(res.data.file);
             setVerificationType(res.data.verificationType);
           } catch (err) {
             setError(err.response?.data.error || 'Error fetching link');
           }
         };
         fetchLink();
       }, [linkId]);

       const handleVerify = async () => {
         try {
           const res = await axios.post(`http://localhost:5000/api/links/${linkId}/verify`, { name });
           if (res.data.verified) {
             setVerified(true);
           } else {
             setError('Verification failed');
           }
         } catch (err) {
           setError(err.response?.data.error || 'Error verifying');
         }
       };

       if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

       return (
         <div className="flex items-center justify-center min-h-screen">
           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
             <h2 className="text-2xl font-bold mb-4">Access File</h2>
             {verificationType !== 'none' && !verified ? (
               <>
                 <input
                   type="text"
                   placeholder="Enter your name"
                   onChange={(e) => setName(e.target.value)}
                   className="mb-4 w-full p-2 border rounded"
                 />
                 <button
                   onClick={handleVerify}
                   className="bg-blue-500 text-white p-2 rounded w-full"
                 >
                   Verify
                 </button>
               </>
             ) : (
               file && (
                 <div>
                   <p>File: {file.filename}</p>
                   <a
                     href={`http://localhost:5000/${file.path}`}
                     download
                     className="bg-green-500 text-white p-2 rounded"
                   >
                     Download File
                   </a>
                 </div>
               )
             )}
           </div>
         </div>
       );
     }

     export default FileViewer;
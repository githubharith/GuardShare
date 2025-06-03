import { useState } from 'react';
     import axios from 'axios';

     function FileSender() {
       const [file, setFile] = useState(null);
       const [expiration, setExpiration] = useState('none');
       const [verificationType, setVerificationType] = useState('none');
       const [verificationData, setVerificationData] = useState('');
       const [link, setLink] = useState('');

       const handleUpload = async () => {
         const formData = new FormData();
         formData.append('file', file);
         try {
           const res = await axios.post('http://localhost:5000/api/files/upload', formData);
           const fileId = res.data.fileId;
           const expiresAt = expiration === 'none' ? null : new Date(Date.now() + (expiration === '1h' ? 3600000 : 86400000));
           const linkRes = await axios.post('http://localhost:5000/api/links/generate', {
             fileId,
             expiresAt,
             verificationType,
             verificationData: verificationData.split(',').map(s => s.trim()),
           });
           setLink(linkRes.data.link);
         } catch (err) {
           console.error(err);
         }
       };

       return (
         <div className="flex items-center justify-center min-h-screen">
           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
             <h2 className="text-2xl font-bold mb-4">Upload File</h2>
             <input
               type="file"
               onChange={(e) => setFile(e.target.files[0])}
               className="mb-4 w-full"
             />
             <select
               onChange={(e) => setExpiration(e.target.value)}
               className="mb-4 w-full p-2 border rounded"
             >
               <option value="none">No Expiration</option>
               <option value="1h">1 Hour</option>
               <option value="24h">24 Hours</option>
             </select>
             <select
               onChange={(e) => setVerificationType(e.target.value)}
               className="mb-4 w-full p-2 border rounded"
             >
               <option value="none">No Verification</option>
               <option value="full">Full Verification</option>
               <option value="semi">Semi Verification</option>
             </select>
             {verificationType !== 'none' && (
               <input
                 type="text"
                 placeholder="Enter names (comma-separated)"
                 onChange={(e) => setVerificationData(e.target.value)}
                 className="mb-4 w-full p-2 border rounded"
               />
             )}
             <button
               onClick={handleUpload}
               className="bg-blue-500 text-white p-2 rounded w-full"
             >
               Upload and Generate Link
             </button>
             {link && (
               <div className="mt-4">
                 <p>Shareable Link: <a href={link} className="text-blue-500">{link}</a></p>
               </div>
             )}
           </div>
         </div>
       );
     }

     export default FileSender;
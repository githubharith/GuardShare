import { useState, useEffect } from 'react';
   import axios from 'axios';
   import { useNavigate } from 'react-router-dom';

   function FileSender() {
     const [file, setFile] = useState(null);
     const [fileUrl, setFileUrl] = useState('');
     const [mimeType, setMimeType] = useState('');
     const [fileId, setFileId] = useState('');
     const [error, setError] = useState('');
     const [uploadedFiles, setUploadedFiles] = useState([]);
     const navigate = useNavigate();

     useEffect(() => {
       const fetchFiles = async () => {
         try {
           const res = await axios.get('http://localhost:5000/api/files');
           setUploadedFiles(res.data);
         } catch (err) {
           setError(err.response?.data.error || 'Error fetching files');
         }
       };
       fetchFiles();
     }, []);

     const handleUpload = async () => {
       if (!file) {
         setError('Please select a file');
         return;
       }
       const formData = new FormData();
       formData.append('file', file);
       try {
         const res = await axios.post('http://localhost:5000/api/files/upload', formData);
         setFileUrl(res.data.fileUrl);
         setFileId(res.data.fileId);
         setMimeType(file.type);
         setUploadedFiles([...uploadedFiles, { _id: res.data.fileId, fileUrl: res.data.fileUrl, filename: file.name, mimeType: file.type }]);
         setError('');
       } catch (err) {
         setError(err.response?.data.error || 'Error uploading file');
       }
     };

     const renderFilePreview = (fileUrl, mimeType) => {
       if (!fileUrl || !mimeType) return null;
       if (mimeType.startsWith('image/')) {
         return <img src={fileUrl} alt="Preview" className="max-w-full h-auto mt-2" />;
       } else if (mimeType.startsWith('video/')) {
         return (
           <video controls className="max-w-full h-auto mt-2">
             <source src={fileUrl} type={mimeType} />
           </video>
         );
       } else if (mimeType.startsWith('audio/')) {
         return (
           <audio controls className="w-full mt-2">
             <source src={fileUrl} type={mimeType} />
           </audio>
         );
       } else if (mimeType === 'text/plain') {
         return (
           <iframe src={fileUrl} title="Text Preview" className="w-full h-64 mt-2 border" />
         );
       }
       return <p className="mt-2">Preview not available for this file type</p>;
     };

     return (
       <div className="flex items-center justify-center min-h-screen">
         <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
           <h2 className="text-2xl font-bold mb-4">Upload and Manage Files</h2>
           <div className="mb-6">
             <input
               type="file"
               onChange={(e) => setFile(e.target.files[0])}
               className="mb-4 w-full"
             />
             <button
               onClick={handleUpload}
               className="bg-blue-500 text-white p-2 rounded w-full mb-4"
             >
               Upload File
             </button>
             {error && <p className="text-red-500 mb-4">{error}</p>}
             {fileUrl && (
               <div className="mb-6">
                 <h3 className="text-lg font-semibold">Uploaded File Preview</h3>
                 {renderFilePreview(fileUrl, mimeType)}
                 <button
                   onClick={() => navigate(`/generate-link/${fileId}`)}
                   className="bg-green-500 text-white p-2 rounded w-full mt-4"
                 >
                   Generate Shareable Link
                 </button>
               </div>
             )}
           </div>
           <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
           {uploadedFiles.length === 0 ? (
             <p>No files uploaded yet.</p>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {uploadedFiles.map((uploadedFile) => (
                 <div key={uploadedFile._id} className="border p-4 rounded">
                   <p className="font-medium">{uploadedFile.filename}</p>
                   {renderFilePreview(uploadedFile.fileUrl, uploadedFile.mimeType)}
                   <button
                     onClick={() => navigate(`/generate-link/${uploadedFile._id}`)}
                     className="bg-green-500 text-white p-2 rounded w-full mt-2"
                   >
                     Generate Shareable Link
                   </button>
                 </div>
               ))}
             </div>
           )}
         </div>
       </div>
     );
   }

   export default FileSender;
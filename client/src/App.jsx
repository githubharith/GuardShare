import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import FileSender from './components/FileSender';
   import FileViewer from './components/FileViewer';
   import LinkGenerator from './components/LinkGenerator';

   function App() {
     return (
       <Router>
         <div className="min-h-screen bg-gray-100">
           <Routes>
             <Route path="/" element={<FileSender />} />
             <Route path="/link/:linkId" element={<FileViewer />} />
             <Route path="/generate-link/:fileId" element={<LinkGenerator />} />
           </Routes>
         </div>
       </Router>
     );
   }

   export default App;
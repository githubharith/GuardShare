import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
     import FileSender from './components/FileSender';
     import FileViewer from './components/FileViewer';

     function App() {
       return (
         <Router>
           <div className="min-h-screen bg-gray-100">
             <Routes>
               <Route path="/" element={<FileSender />} />
               <Route path="/link/:linkId" element={<FileViewer />} />
             </Routes>
           </div>
         </Router>
       );
     }

     export default App;
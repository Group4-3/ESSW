import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './scss/index.scss';
import Layout from './components/layout';
import NotFound from './pages/notFound';
import SubmitSecret from './pages/submitSecret';
import RetrieveSecret from './pages/retrieveSecret';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SubmitSecret />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/testRoute" element={<RetrieveSecret />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  </React.StrictMode>
);
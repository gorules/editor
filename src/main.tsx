import React from 'react';
import ReactDOM from 'react-dom/client';

import './main.css';

import '@gorules/jdm-editor/dist/style.css';

import 'react-ace';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-liquid';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/theme-chrome';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { JdmConfigProvider } from '@gorules/jdm-editor';
import { DecisionSimplePage } from './pages/decision-simple.tsx';
import { NotFoundPage } from './pages/not-found';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DecisionSimplePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JdmConfigProvider>
      <RouterProvider router={router} />
    </JdmConfigProvider>
  </React.StrictMode>,
);

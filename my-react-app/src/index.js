// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );


import Header from '../components/Header';
import Form from '../components/Form';
import CodePreview from '../components/CodePreview';
import FontPreview from '../components/FontPreview';
// import styles from '../components/styles/styles.css';

const Home = () => {
  return (
    <div id="wrap">
      <div id="app">
        <Header />
        <Form />
      </div>
      <div style={{ width: '100%' }}>
        <CodePreview />
        <FontPreview />
      </div>
    </div>
  );
};

export default Home;

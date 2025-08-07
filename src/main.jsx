import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Chat from './Components/Chat.jsx'
import Layout from './Layout.jsx'
import Landing from './Components/Landing.jsx'
import Login from './Components/Login.jsx'
import SignUp from './Components/SignUp.jsx'
import { store, persistor } from './store/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react' 


const router=createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        path:"/",
        element:<Landing/>
      },
      {
        path:"/chat",
        element:<Chat/>
      },
      {
        path:"/login",
        element:<Login/>
      },
      {
        path:"/signUp",
        element:<SignUp/>
      }
    ]
  }
])


// Loading component for PersistGate
const PersistLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: 'white'
  }}>
    Loading...
  </div>
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
    <PersistGate loading={<PersistLoading />} persistor={persistor}>
      <RouterProvider router={router}/>
    </PersistGate>
  </Provider>
)

import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import CreativityStudio from './pages/CreativityStudio'
import SparringLab from './features/creativity/SparringLab'
import WritingAtelier from './features/creativity/WritingAtelier'
import ArtWorkshop from './features/creativity/ArtWorkshop'
import CreativityLanding from './features/creativity/CreativityLanding'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'creativity',
        element: <CreativityStudio />,
        children: [
          { index: true, element: <CreativityLanding /> },
          { path: 'sparring', element: <SparringLab /> },
          { path: 'art', element: <ArtWorkshop /> },
          { path: 'writing', element: <WritingAtelier /> },
        ],
      },
    ],
  },
])

export default router

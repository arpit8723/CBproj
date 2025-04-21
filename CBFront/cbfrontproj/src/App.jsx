
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CostExplorer from './Pages/CostExplorer'
import ProtectedRoutes from './Config/ProtectedRoutes';
import NavLayout from './Config/NavLayout';

import Onboarding from './Onboarding/Onboarding';
import OnboardingPage1 from './Onboarding/OnboardingPage1';


import UserManagement from './Pages/UserManagement';
import NotFoundPage from './Pages/404Page';
import AwsServices from './Pages/AwsServices';
import PageTracker from './components/PageTracker';
import ThankYouPage from './Onboarding/ThankYouPage';



function App() {
  return (
    <BrowserRouter>
     <PageTracker />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<ProtectedRoutes />}>  
        <Route element={<NavLayout />}>

        <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/costexplorer" element={<CostExplorer />} />
        <Route path="/aws" element={<AwsServices/>} />
        <Route path="/onboarding" element={<Onboarding/>}/>
        <Route path="/onboarding/Process" element={<OnboardingPage1 />} />
        <Route path="/onboarding/thankyou" element={<ThankYouPage/>} />
   
        
        </Route>
        </Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Catch all unmatched routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

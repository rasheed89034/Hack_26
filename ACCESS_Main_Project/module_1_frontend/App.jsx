import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';

export default function App() {
    return (
        <div className="min-h-screen bg-[#0A0706] text-white font-sans selection:bg-[#E05305] selection:text-white relative overflow-x-hidden">
                    {/* Dynamic Background Glow Effect */}
                    <div className="fixed inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#E05305]/10 blur-[150px] rounded-full" />
                    </div>

                    <Navbar />

                    <main className="relative z-10">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Protected Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/opportunities" element={<Opportunities />} />
                                <Route path="/opportunity/:id" element={<OpportunityDetail />} />
                            </Route>
                        </Routes>
            </main>

            <Footer />
        </div>
    );
}
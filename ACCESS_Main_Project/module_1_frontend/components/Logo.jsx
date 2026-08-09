import React from 'react';
import logo from '../assets/logo.png';

export default function Logo({ className = "w-8 h-8" }) {
    return (
        <img src={logo} alt="ACCESS Logo" className={className} />
    );
}
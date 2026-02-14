import React from 'react';
import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <ServicesGrid />
    </div>
  );
}
import React from 'react';
import Banner from '../components/home/Banner';
import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <Hero />
      <ServicesGrid />
    </div>
  );
}
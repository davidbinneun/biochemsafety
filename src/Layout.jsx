import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Check if already loaded
    if (window._accessibilityLoaded) return;
    window._accessibilityLoaded = true;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/accessibility@6.1.0/dist/main.bundle.js';
    script.async = true;
    script.onload = () => {
      const labels = {
        resetTitle: 'איפוס',
        closeTitle: 'סגור',
        menuTitle: 'תפריט נגישות',
        increaseText: 'הגדל טקסט',
        decreaseText: 'הקטן טקסט',
        increaseTextSpacing: 'הגדל מרווח טקסט',
        decreaseTextSpacing: 'הקטן מרווח טקסט',
        increaseLineHeight: 'הגדל גובה שורה',
        decreaseLineHeight: 'הקטן גובה שורה',
        invertColors: 'הפוך צבעים',
        grayHues: 'גווני אפור',
        underlineLinks: 'הדגש קישורים',
        bigCursor: 'סמן גדול',
        readingGuide: 'מדריך קריאה',
        textToSpeech: 'טקסט לדיבור',
        speechToText: 'דיבור לטקסט',
        disableAnimations: 'בטל אנימציות',
        hotkeyPrefix: 'קיצור מקשים:',
      };

      const options = {
        labels: labels,
        textToSpeechLang: 'he-IL',
        speechToTextLang: 'he-IL',
      };

      new window.Accessibility(options);
    };
    document.body.appendChild(script);
  }, []);

  const { data: footerContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'layout', 'footer'],
    queryFn: () => base44.entities.ContentBlock.filter({ page: 'layout', section: 'footer' }),
  });

  const { data: copyrightContent = [] } = useQuery({
    queryKey: ['contentBlocks', 'layout', 'footer-copyright'],
    queryFn: () => base44.entities.ContentBlock.filter({ page: 'layout', section: 'footer-copyright' }),
  });

  const { data: contactInfo = [] } = useQuery({
    queryKey: ['contentBlocks', 'global', 'contact-info'],
    queryFn: () => base44.entities.ContentBlock.filter({ page: 'global', section: 'contact-info' }),
  });

  const getContactInfo = (key, fallback) => {
    const item = contactInfo.find(c => c.title === key);
    return item?.content || fallback;
  };

  const phone = getContactInfo('phone', '053-735-8888');
  const email = getContactInfo('email', 'blankporat@gmail.com');

  const footerName = footerContent.find(c => c.title === 'שם מלא')?.content || 'ד"ר דיאנה בלנק-פורת';
  const footerDesc = footerContent.find(c => c.title === 'תיאור')?.content || '';
  const copyright = copyrightContent[0]?.content || '';

  const navItems = [
    { name: 'דף הבית', page: 'Home' },
    { name: 'אודות', page: 'About' },
    { name: 'תחומי התמחות', page: 'Services' },
    { name: 'יצירת קשר', page: 'Contact' },
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      <style>{`
        * {
          font-family: 'Heebo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        :root {
          --burgundy: #8B1538;
          --burgundy-dark: #6B1028;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
        
        body {
          background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693ff28dde58acabbdf9d717/1a39d3806_diana_logo2.png" 
                alt="BioChem Safety & Health Logo"
                className="h-12 w-auto"
              />
              <div className="hidden md:block text-right">
                <div className="text-sm font-semibold text-gray-900">ד"ר דיאנה בלנק-פורת</div>
                <div className="text-xs text-gray-600">BioChem Safety & Health</div>
              </div>
              <div className="hidden md:block w-px h-10 bg-black mx-2"></div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693ff28dde58acabbdf9d717/3e18a6447_WhatsAppImage2026-01-26at000621.jpeg"
                alt="פורת לוגו"
                className="h-16 w-auto hidden md:block mr-4"
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navItems.map((item) => (
                <Link key={item.page} to={createPageUrl(item.page)}>
                  <Button
                    variant="ghost"
                    className={`${
                      currentPageName === item.page
                        ? 'text-[#8c2b60] bg-[#8c2b60]/10'
                        : 'text-gray-700 hover:text-[#8c2b60] hover:bg-[#8c2b60]/5'
                    }`}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Contact Info & Mobile Menu */}
            <div className="flex items-center gap-4">
              

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-[#8B1538]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-end ${
                        currentPageName === item.page
                          ? 'text-[#8c2b60] bg-[#8c2b60]/10'
                          : 'text-gray-700'
                        }`}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}

                <div className="pt-4 border-t border-gray-200 mt-2">
                  <a href={`tel:${phone}`}>
                    <Button className="w-full bg-[#8c2b60] hover:bg-[#6B1028] text-white">
                      <Phone className="w-4 h-4 ml-2" />
                      {phone}
                    </Button>
                  </a>
                  <a href={`mailto:${email}`} className="flex items-center justify-end gap-2 text-sm text-gray-700 hover:text-[#8c2b60] py-2">
                    <span>{email}</span>
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#4e1635] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-right">
            <div>
              <h3 className="text-xl font-bold mb-4">{footerName}</h3>
              <div className="space-y-2 text-sm opacity-90">
                <a href={`tel:${phone}`} className="flex items-center gap-2 justify-start hover:opacity-100">
                  <Phone className="w-4 h-4" />
                  <span>{phone}</span>
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-2 justify-start hover:opacity-100">
                  <Mail className="w-4 h-4" />
                  <span>{email}</span>
                </a>
                <a href={`https://wa.me/${phone.replace(/-/g, '').replace(/^0/, '972')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-start hover:opacity-100">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">אבינועם פורת</h3>
              <div className="space-y-2 text-sm opacity-90">
                <a href="tel:052-7076730" className="flex items-center gap-2 justify-start hover:opacity-100">
                  <Phone className="w-4 h-4" />
                  <span>052-7076730</span>
                </a>
                <a href="mailto:avipor50@outlook.com" className="flex items-center gap-2 justify-start hover:opacity-100">
                  <Mail className="w-4 h-4" />
                  <span>avipor50@outlook.com</span>
                </a>
                <a href="https://wa.me/972527076730" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-start hover:opacity-100">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">קישורים מהירים</h3>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className="block text-sm opacity-90 hover:opacity-100 hover:underline"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-75">
            <p>© {new Date().getFullYear()} {copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
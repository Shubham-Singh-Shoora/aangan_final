
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { Home, Shield, Zap, CheckCircle, Sparkles, Globe, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Enhanced futuristic background elements */}
      <div className="absolute inset-0 bg-holographic"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-3000"></div>
        <div className="absolute top-10 left-1/2 w-36 h-36 bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-2xl animate-bounce-slow"></div>
      </div>
      
      <Header variant="landing" />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 border border-blue-300/50 rounded-full text-blue-700 text-sm font-medium mb-4 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  India's First NFT-Powered Rental Platform
                </div>
                <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  Smart Rental
                  <span className="block text-6xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 animate-gradient">
                    Revolution
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium">
                  Experience secure, transparent, and decentralized property rentals 
                  powered by blockchain technology and NFTs. Built for Bharat's digital future.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="btn-futuristic px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/add-property">
                    <Home className="w-5 h-5 mr-2" />
                    List Your Property
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="btn-outline-light px-8 py-4 text-lg font-bold rounded-xl hover-glow transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/marketplace">
                    <Globe className="w-5 h-5 mr-2" />
                    Browse Rentals
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">10K+</div>
                  <div className="text-sm text-gray-600 font-medium">Properties Listed</div>
                </div>
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">50K+</div>
                  <div className="text-sm text-gray-600 font-medium">Happy Tenants</div>
                </div>
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">99.9%</div>
                  <div className="text-sm text-gray-600 font-medium">Secure Transactions</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl float-animation">
                <img 
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&auto=format&fit=crop&q=80"
                  alt="Beautiful modern Indian family home with traditional and contemporary design"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl shadow-xl border border-blue-300/50 pulse-glow backdrop-blur-md">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">NFT Secured</p>
                    <p className="text-sm text-gray-600 font-medium">Blockchain verified</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 glass-card p-4 rounded-xl shadow-lg border border-cyan-300/50 backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-sm font-bold text-gray-800">Live Verification</span>
                </div>
              </div>
              <div className="absolute top-1/2 -left-8 glass-card p-3 rounded-xl shadow-lg border border-purple-300/50 backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-800">AI Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 glass-nav relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 border border-blue-300/50 rounded-full text-blue-700 text-sm font-medium mb-4 backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Advanced Technology
            </div>
            <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Why Choose AANGAN?
            </h2>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              Revolutionary features that make property rentals secure, transparent, and efficient for modern India
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="card-futuristic bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">NFT-Backed Security</h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Every rental agreement is secured by blockchain technology, ensuring transparent and immutable records for complete peace of mind.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-futuristic bg-gradient-to-br from-white to-cyan-50 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Streamlined processes powered by smart contracts make renting faster and more efficient than traditional methods.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-futuristic bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted Platform</h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Built with Indian property laws in mind, ensuring compliance and peace of mind for all parties involved.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Indian Testimonial Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                Trusted by Indians Across the Country
              </h3>
              <p className="text-lg lg:text-xl text-gray-700 font-medium leading-relaxed">
                From Mumbai to Bangalore, Delhi to Chennai, families are choosing AANGAN for secure, transparent rentals.
              </p>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-gray-800 font-bold text-lg">Join 50,000+ satisfied users</span>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 relative">
              <div className="image-carousel w-[300%] h-full flex animate-[slideCarousel_9s_infinite_ease-in-out]">
                <img 
                  src="/person1.jpg"
                  alt="Happy Indian person - satisfied AANGAN user"
                  className="w-1/3 h-full object-contain bg-gradient-to-br from-blue-50 to-cyan-50 p-4"
                />
                <img 
                  src="/person2.jpg"
                  alt="Confident Indian person - trusted AANGAN customer"
                  className="w-1/3 h-full object-contain bg-gradient-to-br from-blue-50 to-cyan-50 p-4"
                />
                <img 
                  src="/person3.jpg"
                  alt="Smiling Indian person - happy AANGAN member"
                  className="w-1/3 h-full object-contain bg-gradient-to-br from-blue-50 to-cyan-50 p-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of property owners and tenants who trust AANGAN for secure, transparent rentals across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/add-property">
                <Home className="w-5 h-5 mr-2" />
                Start Listing
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 bg-transparent transform hover:scale-105"
            >
              <Link to="/marketplace">
                <Globe className="w-5 h-5 mr-2" />
                Explore Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="glass-nav text-gray-700 py-16 px-4 sm:px-6 lg:px-8 border-t border-blue-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg pulse-glow animate-gradient overflow-hidden">
                  <img 
                    src="/favicon.jpg" 
                    alt="AANGAN Logo" 
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient aangan-font" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '800', letterSpacing: '0.05em' }}>
                  AANGAN
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-md font-medium">
                India's first NFT-powered property rental platform. Experience the future of real estate with blockchain security, transparency, and trust.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-700">Beta Version</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-green-700">Live</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/marketplace" className="text-gray-600 hover:text-blue-600 transition-colors font-medium hover:underline">
                    Browse Properties
                  </Link>
                </li>
                <li>
                  <Link to="/add-property" className="text-gray-600 hover:text-blue-600 transition-colors font-medium hover:underline">
                    List Property
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium hover:underline">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">NFT Security</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-600" />
                  <span className="font-medium">Smart Contracts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Verified Properties</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Trusted Community</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-blue-200/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-600 text-sm font-medium">
                © 2024 AANGAN. Built for the future of property rentals in India. 🇮🇳
              </div>
              <div className="flex items-center space-x-6 text-sm font-medium">
                <span className="text-gray-600">Made with ❤️ in India</span>
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200/50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 font-bold">Blockchain Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

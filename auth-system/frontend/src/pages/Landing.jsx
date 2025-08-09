import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Code, 
  Users, 
  Lock, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Star,
  Github,
  ExternalLink,
  Smartphone,
  Database,
  Settings,
  Book
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with JWT tokens, bcrypt hashing, and secure session management.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'High-performance authentication with minimal latency and optimized API endpoints.'
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Simple SDKs for JavaScript, React, and Node.js with comprehensive documentation.'
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Complete user lifecycle management with roles, permissions, and custom fields.'
    },
    {
      icon: Globe,
      title: 'Multi-Platform',
      description: 'Works seamlessly across web, mobile, and server-side applications.'
    },
    {
      icon: Database,
      title: 'Scalable Infrastructure',
      description: 'Built to handle millions of users with MongoDB and modern cloud architecture.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Users per Project' },
    { number: '100k+', label: 'API Calls/Month' },
    { number: '99.9%', label: 'Uptime SLA' },
    { number: '5 mins', label: 'Setup Time' }
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Senior Developer',
      company: 'TechCorp',
      content: 'AccessKit saved us months of development time. The API is intuitive and the documentation is excellent.',
      avatar: '👨‍💻'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      company: 'StartupXYZ',
      content: 'We migrated from Auth0 to AccessKit and couldn\'t be happier. Better performance, lower costs.',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Product Manager',
      company: 'InnovateLab',
      content: 'The user management features are incredibly powerful. Custom fields and roles work perfectly.',
      avatar: '👨‍🚀'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Navigation */}
      <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-300/50">
        <div className="navbar-start">
          <div className="flex items-center">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary mr-2 sm:mr-3" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AccessKit
            </span>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a href="#features" className="font-medium">Features</a></li>
            <li><a href="#pricing" className="font-medium">Pricing</a></li>
            <li><Link to="/docs" className="font-medium">Documentation</Link></li>
            <li><a href="#about" className="font-medium">About</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link to="/auth/login" className="btn btn-ghost btn-sm mr-1 sm:mr-2">Sign In</Link>
          <Link to="/auth/signup" className="btn btn-primary btn-sm">
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero min-h-[80vh] bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="hero-content text-center max-w-6xl px-4">
          <div>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6">
              Authentication{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-base-content/70 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Build secure, scalable applications with our powerful authentication platform. 
              Start protecting your users in minutes, not days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth/signup" className="btn btn-primary btn-lg">
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/docs" className="btn btn-outline btn-lg">
                <Code className="w-5 h-5 mr-2" />
                View Documentation
              </Link>
            </div>
            
            {/* Code Preview */}
            <div className="bg-base-200 rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto shadow-2xl overflow-hidden">
              <div className="text-xs sm:text-sm text-left">
                <div className="text-base-content/60 mb-2">// Get started in 3 lines of code</div>
                <div className="mockup-code bg-black overflow-x-auto">
                  <pre data-prefix="$" className="text-xs sm:text-sm text-gray-300"><code>npm install @gsarthak783/accesskit-auth</code></pre>
                  <pre data-prefix=">" className="text-warning text-xs sm:text-sm"><code>Installing...</code></pre>
                  <pre data-prefix=">" className="text-success text-xs sm:text-sm"><code>Ready to authenticate!</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-base-content/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Modern Authentication
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-base-content/70 max-w-3xl mx-auto px-4">
              Built by developers, for developers. Get enterprise-grade security without the complexity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg mr-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="card-title text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-base-100 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Get Started in <span className="text-primary">Minutes</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-4">Create Account</h3>
              <p className="text-base-content/70">Sign up and create your first project in under 30 seconds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-4">Install SDK</h3>
              <p className="text-base-content/70">Add our lightweight SDK to your app with one npm command</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-4">Start Authenticating</h3>
              <p className="text-base-content/70">Your users can sign up and log in immediately</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-base-200 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Trusted by <span className="text-primary">Developers</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-base-content/60">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-base-content/70 italic">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-secondary px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 px-4">
              Join thousands of developers building secure applications with AccessKit
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup" className="btn btn-lg bg-white text-primary hover:bg-base-100">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/docs" className="btn btn-lg btn-outline btn-ghost text-white border-white hover:bg-white hover:text-primary">
                View Documentation
                <Book className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-6 sm:p-10 bg-base-200 text-base-content">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-primary mr-3" />
              <span className="text-xl font-bold">AccessKit</span>
            </div>
            <p className="max-w-md text-center text-sm sm:text-base">
              Modern authentication platform for developers who want to build secure applications fast.
            </p>
          </div>
          <div className="my-6">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/docs" className="link link-hover text-sm sm:text-base">Documentation</Link>
              <a href="https://github.com/gsarthak783/Auth-app" className="link link-hover text-sm sm:text-base">GitHub</a>
              <Link to="/auth/signup" className="link link-hover text-sm sm:text-base">Get Started</Link>
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-base text-center">Copyright © 2025 AccessKit. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
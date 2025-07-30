import React from 'react';
import { Logo } from './Logo';
import { Github, Twitter, Mail, Heart, ExternalLink, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import GoogleAd from './GoogleAd';
import myImage from '../assets/pc-fast.gif';


export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: 'https://github.com/pchandra191/gossip-ai/tree/dev?tab=readme-ov-file#moderation-tools' },
      { label: 'Personas', href: 'https://github.com/pchandra191/gossip-ai/tree/dev?tab=readme-ov-file#available-personas' },
      { label: 'API Status', href: 'https://github.com/pchandra191/gossip-ai/tree/dev?tab=readme-ov-file#demo-mode' },
      { label: 'Demo', href: 'https://github.com/pchandra191/gossip-ai/tree/dev?tab=readme-ov-file#live' }
    ],
    resources: [
      { label: 'Documentation', href: 'https://github.com/pchandra191/gossip-ai/tree/dev?tab=readme-ov-file#getting-started ' },
      { label: 'ChatGPT API Guide', href: 'https://github.com/pchandra191/gossip-ai/tree/dev?tab=readme-ov-file#getting-started' },
      { label: 'Gemini API Guide', href: 'https://github.com/pchandra191/gossip-ai/tree/dev?tab=readme-ov-file#getting-started' },
      { label: 'How to Use', href: 'https://github.com/pchandra191/gossip-ai/tree/dev?tab=readme-ov-file#getting-started' }
    ],
    community: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prabhatchandra114/', icon: Linkedin },
      { label: 'GitHub', href: 'https://github.com/pchandra191', icon: Github },
      { label: 'YouTube', href: 'https://www.youtube.com/191prabhat', icon: Youtube },
      { label: 'Twitter', href: 'https://twitter.com/pchandra191', icon: Twitter },
      { label: 'Instagram', href: 'https://instagram.com/pchandra191', icon: Instagram },
      { label: 'facebook', href: ' https://www.facebook.com/prabhat191', icon: Facebook },
      { label: 'Contact', href: 'mailto:apcreations191@gmail.com', icon: Mail }
    ],
    legal: [
      { label: 'Privacy Policy', href: 'https://github.com/pchandra191/gossip-ai?tab=readme-ov-file#privacy--security' },
      { label: 'Terms of Service', href: 'https://github.com/pchandra191/gossip-ai?tab=readme-ov-file#privacy--security' },
      { label: 'Contributing', href: 'https://github.com/pchandra191/gossip-ai?tab=readme-ov-file#contributing' },
      { label: 'License', href: 'https://opensource.org/license/mit' }
    ]
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
              Experience the future of AI conversations. Watch real AI models debate, 
              discuss, and explore ideas while you moderate and guide the discussion.
            </p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Developer</h4>
                    <img src={myImage} alt="Description" width="100" />
              <div className="text-gray-600 dark:text-gray-300">
                <p className="font-medium">Prabhat Chandra</p>
                <p className="text-sm">Full Stack Developer & AI Enthusiast</p>
                <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 text-sm">
                  <a href="https://commons.wikimedia.org/wiki/User:Prabhat114" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Wiki: @Prabhat114
                  </a>
                </div>
              </div>
            <div className="mt-6 flex space-x-4">
              {footerLinks.community.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : '_self'}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
          </div>
            </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Google Ad - Above Bottom Section */}
        <div className="mt-8 mb-4 adsbygoogle">
        <GoogleAd
                client="ca-pub-4366848715535129"
                slot="8400088323"
                format="auto"
                responsive={true}
                style={{ minHeight: '100px', margin: '20px 0' }}
              />
        </div>
        

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <span>© {currentYear} aPCreations . Made with</span>
              <Heart size={16} className="text-red-500" />
              <span>for AI enthusiasts</span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-500">
              Powered by OpenAI GPT-4 & Google Gemini
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
import React from 'react';
import { Logo } from './Logo';
import { Github, Twitter, Mail, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Personas', href: '#personas' },
      { label: 'API Status', href: '#api' },
      { label: 'Demo', href: '#demo' }
    ],
    resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'ChatGPT API Guide', href: '#api-guide' },
      { label: 'Gemini API Guide', href: '#tutorials' },
      { label: 'FAQ', href: '#faq' }
    ],
    community: [
      { label: 'GitHub', href: 'https://github.com', icon: Github },
      { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
      { label: 'Discord', href: 'https://discord.com', icon: ExternalLink },
      { label: 'Contact', href: 'mailto:pchandra114@gmail.com', icon: Mail }
    ],
    legal: [
      { label: 'Privacy Policy', href: 'https://github.com/pchandra191/gossip-ai?tab=readme-ov-file#privacy--security' },
      { label: 'Terms of Service', href: '#terms' },
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
              <br></br>
              Developer:<b>Prabhat Chandra</b> 
            </p>
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

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <span>© {currentYear} aPCreations. Made with</span>
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
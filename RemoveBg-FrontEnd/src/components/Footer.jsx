import { Github, Youtube, Linkedin, Mail, Heart } from "lucide-react";
import { assets } from "../assets/assets";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100">
            {/* Main Footer */}
            <div className="px-8 py-12">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    
                    {/* Brand - Left */}
                    <div className="flex items-center gap-3">
                        <img src={assets.DeepMask} alt="DeepMask" className="h-8 w-12 object-contain" />
                        <div>
                            <span className="text-xl font-semibold text-indigo-700">
                                DeepMask <span className="text-gray-400">AI</span>
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                                © {currentYear} All rights reserved
                            </p>
                        </div>
                    </div>

                    {/* Social Links - Center (on desktop) */}
                    <div className="flex items-center gap-6">
                        <a 
                            href="https://github.com/alok341" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-900 transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>

                        <a 
                            href="https://www.youtube.com/@UCzjgWY4bwOfszdKfAMDgzTw" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="YouTube"
                        >
                            <Youtube className="w-5 h-5" />
                        </a>

                        <a 
                            href="https://www.linkedin.com/in/alokkumar-ajaykumar-dubey-2b68282b9" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>

                        <a 
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=dubeyalokkumar2005@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-yellow-600 transition-colors"
                            aria-label="Email"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>

                    {/* Contact Button - Right */}
                    <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=dubeyalokkumar2005@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full hover:bg-indigo-100 transition-all text-sm font-medium"
                    >
                        Contact Me
                    </a>
                </div>
            </div>

            {/* Bottom Bar - Minimal */}
            <div className="border-t border-gray-100 px-8 py-4">
                <div className="max-w-6xl mx-auto flex justify-center items-center gap-2 text-xs text-gray-400">
                    <span>Made </span>                  
                    <span>by Alokkumar Dubey</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
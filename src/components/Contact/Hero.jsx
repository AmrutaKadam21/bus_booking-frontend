import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import API from '../../config/api';

const Hero = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API}/api/contact`, formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 4000);
        } catch {
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Address',
            details: 'Pimple Gurav, Pune, India',
            color: 'bg-orange-500'
        },
        {
            icon: Phone,
            title: 'Phone Number',
            details: '738281827172',
            color: 'bg-orange-500'
        },
        {
            icon: Mail,
            title: 'E-Mail',
            details: 'rajmudratravels@gmail.com',
            color: 'bg-orange-500'
        }
    ];

    const socialLinks = [
        { icon: Facebook, name: 'Facebook', color: 'hover:bg-blue-600' },
        { icon: Twitter, name: 'Twitter', color: 'hover:bg-blue-400' },
        { icon: Instagram, name: 'Instagram', color: 'hover:bg-pink-600' },
        { icon: Linkedin, name: 'LinkedIn', color: 'hover:bg-blue-700' }
    ];

    return (
        <div className="w-full bg-gray-50">
            {/* HERO SECTION */}
            <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">

                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop"
                        alt="Contact Us Background"
                        className="w-full h-full object-cover object-center"
                    />
                 
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                </div>

                {/* CONTENT AREA */}
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">

         

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-6">
                        Contact <span className="text-orange-500">Us</span>
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium mb-8">
                        Have questions about your journey? Our team is here to help 24/7.
                        We'd love to hear from you!
                    </p>

                    {/* CTA Button */}
                    <a href="#contact-form" className="inline-block">
                        <button className="bg-orange-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-lg active:scale-95 transform hover:scale-105">
                            Send a Message
                        </button>
                    </a>

                </div>
            </section>

            {/* CONTACT INFORMATION & FORM SECTION */}
            <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-16">

                        {/* LEFT: Contact Information */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                                    Get In Touch
                                </h2>

                                <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet accumsan eros, sit amet eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>

                                {/* Contact Items */}
                                <div className="space-y-6 mb-10">
                                    {contactInfo.map((item, index) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className={`${item.color} p-3 rounded-full flex-shrink-0 mt-1`}>
                                                    <IconComponent className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 mb-1">{item.title}</p>
                                                    {item.title === 'E-Mail' ? (
                                                        <a href={`mailto:${item.details}`} className="text-orange-500 text-sm hover:underline">{item.details}</a>
                                                    ) : (
                                                        <p className="text-gray-600 text-sm">{item.details}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Social Media Links */}
                                <div>
                                    <p className="font-bold text-gray-900 mb-4">Follow Us:</p>
                                    <div className="flex items-center gap-3">
                                        {socialLinks.map((social, index) => {
                                            const SocialIcon = social.icon;
                                            return (
                                                <a
                                                    key={index}
                                                    href="#"
                                                    className={`bg-orange-500 text-white p-3 rounded-full transition-all duration-300 ${social.color} hover:text-white hover:scale-110`}
                                                    aria-label={social.name}
                                                >
                                                    <SocialIcon className="w-5 h-5" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg" id="contact-form">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    Send a Message
                                </h3>
                                <p className="text-gray-600 text-sm mb-8">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>

                                {submitted && (
                                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm md:text-base">
                                        ✓ Thank you! Your message has been sent successfully.
                                    </div>
                                )}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Name</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Full Name"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-gray-700 placeholder-gray-400" required />
                                    </div>

                                    {/* Email + Phone row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Email Address</label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-gray-700 placeholder-gray-400" required />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Phone Number</label>
                                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-gray-700 placeholder-gray-400" />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Subject</label>
                                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="How can we help?"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-gray-700 placeholder-gray-400" required />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Message</label>
                                        <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us how we can help..."
                                            rows="5" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-gray-700 placeholder-gray-400 resize-none" required />
                                    </div>

                                    <p className="text-xs md:text-sm text-gray-500">
                                        By submitting, you agree to the processing of your personal data as described in our{' '}
                                        <a href="#" className="text-orange-500 hover:underline">Privacy Statement</a>.
                                    </p>

                                    <button type="submit" disabled={loading}
                                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 md:py-4 rounded-full transition-all duration-300 shadow-lg active:scale-95 transform hover:scale-105 flex items-center justify-center gap-2 text-base md:text-lg">
                                        <Send className="w-5 h-5" />
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>

                   
                    <div className="  overflow-hidden shadow-lg h-90 md:h-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.9157937335396!2d-0.11977592346817378!3d51.50310070000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487603515fae71fd%3A0x6e5049c0d42f0f4e!2sLondon%20Eye!5e0!3m2!1sen!2suk!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Company Location Map"
                        ></iframe>


                    </div>
                    <a
                        href="https://maps.google.com/?q=Pimple+Gurav,Pune,India"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='inline-block p-2 m-4 bg-white hover:bg-orange-400 hover:text-white rounded-md font-semibold cursor-pointer transition-colors duration-200'
                    >See Location</a>

                </div>
            </section>

        </div>
    );
};

export default Hero;
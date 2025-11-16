import React, { useState } from 'react';
import { SparklesIcon, PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function DesignStudio() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [selectedGarment, setSelectedGarment] = useState('tshirt');
  const [chatHistory, setChatHistory] = useState([]);

  // Demo designs for different prompts
  const demoDesigns = {
    'sunset': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
    'mountain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'ocean': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop',
    'abstract': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop',
    'geometric': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
    'nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    'space': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop',
    'floral': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
  };

  const examplePrompts = [
    "Create a vibrant sunset over mountains design",
    "Design a minimalist geometric pattern in teal and coral",
    "Generate a tropical beach theme with palm trees",
    "Create a space-themed design with planets and stars"
  ];

  const garmentTypes = [
    { id: 'tshirt', name: 'T-Shirt', icon: '👕' },
    { id: 'shirt', name: 'Shirt', icon: '👔' },
    { id: 'hoodie', name: 'Hoodie', icon: '🧥' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    const userMessage = prompt.trim();
    setPrompt('');

    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    setTimeout(() => {
      let designUrl = null;
      const lowerPrompt = userMessage.toLowerCase();
      
      for (const [key, url] of Object.entries(demoDesigns)) {
        if (lowerPrompt.includes(key)) {
          designUrl = url;
          break;
        }
      }

      if (!designUrl) {
        const designs = Object.values(demoDesigns);
        designUrl = designs[Math.floor(Math.random() * designs.length)];
      }

      setGeneratedDesign(designUrl);

      const aiResponse = `Perfect! I've created a unique design for your ${garmentTypes.find(g => g.id === selectedGarment)?.name}. The design features: "${userMessage}". You can customize it further or add it to your cart!`;
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse,
        design: designUrl 
      }]);

      setLoading(false);
      toast.success('Design generated! ✨');
    }, 2000);
  };

  const handleExampleClick = (exampleText) => {
    setPrompt(exampleText);
  };

  const handleRegenerate = () => {
    if (chatHistory.length > 0) {
      const lastUserMessage = chatHistory.filter(msg => msg.role === 'user').pop();
      if (lastUserMessage) {
        setPrompt(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-coral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <SparklesIcon className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Custom Creator</h1>
            <p className="text-xl text-teal-50">
              Design your own custom apparel with AI - Describe it, we'll create it!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Garment Type Selector */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex bg-white rounded-xl shadow-lg p-2 gap-2">
              {garmentTypes.map((garment) => (
                <button
                  key={garment.id}
                  onClick={() => setSelectedGarment(garment.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    selectedGarment === garment.id
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{garment.icon}</span>
                  {garment.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Design Preview */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Design Preview</h2>
                
                {/* Garment Preview */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-h-[450px] flex items-center justify-center">
                  {generatedDesign ? (
                    <div className="relative">
                      {/* T-Shirt/Shirt/Hoodie Mockup */}
                      <div className="relative">
                        {selectedGarment === 'tshirt' && (
                          <svg viewBox="0 0 300 350" className="w-full max-w-md">
                            {/* T-Shirt Shape */}
                            <path
                              d="M 50 80 L 50 50 L 100 30 L 100 50 Q 100 70 150 70 Q 200 70 200 50 L 200 30 L 250 50 L 250 80 L 230 100 L 230 320 Q 230 330 220 330 L 80 330 Q 70 330 70 320 L 70 100 Z"
                              fill="white"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            {/* Design Area */}
                            <defs>
                              <clipPath id="tshirt-clip">
                                <rect x="90" y="100" width="120" height="180" rx="10" />
                              </clipPath>
                            </defs>
                            <image
                              href={generatedDesign}
                              x="90"
                              y="100"
                              width="120"
                              height="180"
                              clipPath="url(#tshirt-clip)"
                              preserveAspectRatio="xMidYMid slice"
                            />
                          </svg>
                        )}
                        
                        {selectedGarment === 'shirt' && (
                          <svg viewBox="0 0 300 350" className="w-full max-w-md">
                            {/* Shirt Shape with Collar */}
                            <path
                              d="M 50 80 L 50 50 L 100 30 L 120 50 L 130 40 L 150 50 L 170 40 L 180 50 L 200 30 L 250 50 L 250 80 L 230 100 L 230 320 Q 230 330 220 330 L 80 330 Q 70 330 70 320 L 70 100 Z"
                              fill="white"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            {/* Collar */}
                            <path
                              d="M 130 40 L 150 60 L 170 40"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            {/* Design Area */}
                            <defs>
                              <clipPath id="shirt-clip">
                                <rect x="90" y="100" width="120" height="180" rx="10" />
                              </clipPath>
                            </defs>
                            <image
                              href={generatedDesign}
                              x="90"
                              y="100"
                              width="120"
                              height="180"
                              clipPath="url(#shirt-clip)"
                              preserveAspectRatio="xMidYMid slice"
                            />
                          </svg>
                        )}
                        
                        {selectedGarment === 'hoodie' && (
                          <svg viewBox="0 0 300 380" className="w-full max-w-md">
                            {/* Hoodie Shape with Hood */}
                            <path
                              d="M 80 30 Q 150 10 220 30 L 250 50 L 250 80 L 230 100 L 230 340 Q 230 350 220 350 L 80 350 Q 70 350 70 340 L 70 100 L 50 80 L 50 50 Z"
                              fill="white"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            {/* Hood */}
                            <ellipse cx="150" cy="40" rx="50" ry="30" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                            {/* Pocket */}
                            <rect x="110" y="200" width="80" height="60" rx="5" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                            {/* Design Area */}
                            <defs>
                              <clipPath id="hoodie-clip">
                                <rect x="90" y="100" width="120" height="150" rx="10" />
                              </clipPath>
                            </defs>
                            <image
                              href={generatedDesign}
                              x="90"
                              y="100"
                              width="120"
                              height="150"
                              clipPath="url(#hoodie-clip)"
                              preserveAspectRatio="xMidYMid slice"
                            />
                          </svg>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-6 flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                          Add to Cart - ₹599
                        </button>
                        <button
                          onClick={handleRegenerate}
                          className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <ArrowPathIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-6xl">{garmentTypes.find(g => g.id === selectedGarment)?.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No Design Yet</h3>
                      <p className="text-gray-600">
                        Describe your design idea below to see it on your {garmentTypes.find(g => g.id === selectedGarment)?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">What You Get</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SparklesIcon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">AI-Powered Design</h4>
                      <p className="text-sm text-gray-600">Unique designs created just for you</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Premium Quality</h4>
                      <p className="text-sm text-gray-600">100% cotton, print-ready resolution</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ArrowPathIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Unlimited Revisions</h4>
                      <p className="text-sm text-gray-600">Regenerate until it's perfect</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="space-y-6">
              {/* Chat History */}
              <div className="bg-white rounded-2xl shadow-xl p-6 h-[450px] overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Start Designing!</h3>
                    <p className="text-gray-600 mb-6">
                      Try these example prompts:
                    </p>
                    
                    <div className="space-y-3 w-full">
                      {examplePrompts.map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExampleClick(example)}
                          className="w-full p-4 bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl hover:border-teal-400 hover:shadow-lg transition-all duration-300 text-left group"
                        >
                          <p className="text-sm text-gray-700 group-hover:text-gray-900">{example}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                          {message.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                                <SparklesIcon className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-gray-700">AI Designer</span>
                            </div>
                          )}
                          
                          <div className={`rounded-2xl p-4 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            <span className="ml-2 text-sm text-gray-600">Creating your design...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="space-y-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your design... (e.g., 'Create a sunset over mountains with vibrant orange and purple colors')"
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none resize-none"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    {loading ? 'Generating...' : 'Generate Design'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  💡 Be specific about colors, themes, and styles for better results
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

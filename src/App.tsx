import React, { useState, useEffect } from 'react';
import * as openpgp from 'openpgp';
import { Moon, Sun, Lock, Key, Download, Copy, Github } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [keyType, setKeyType] = useState<'ecc' | 'rsa'>('ecc');
  const [rsaBits, setRsaBits] = useState(4096);
  const [eccCurve, setEccCurve] = useState('curve25519');
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [keys, setKeys] = useState<{
    publicKey: string;
    privateKey: string;
  } | null>(null);

  useEffect(() => {
    fetch('https://api.waifu.pics/sfw/waifu')
      .then(response => response.json())
      .then(data => setBackgroundImage(data.url))
      .catch(() => {
        setBackgroundImage('https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=1950&q=80');
      });
  }, []);

  const generateKeys = async () => {
    if (!name || !email) {
      toast.error('Please fill in all required fields, senpai! >_<');
      return;
    }

    setLoading(true);
    try {
      const config = keyType === 'ecc' 
        ? { curve: eccCurve }
        : { rsaBits };

      const { privateKey, publicKey } = await openpgp.generateKey({
        type: keyType === 'ecc' ? 'ecc' : 'rsa',
        userIDs: [{ name, email }],
        ...config,
      });

      setKeys({
        publicKey,
        privateKey,
      });
      toast.success('Keys generated successfully! ٩(◕‿◕｡)۶');
    } catch (error) {
      toast.error('Gomen nasai! An error occurred (╥﹏╥)');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'public' | 'private') => {
    await navigator.clipboard.writeText(text);
    toast.success(`${type === 'public' ? 'Public' : 'Private'} key copied to clipboard! (｡♥‿♥｡)`);
  };

  const downloadKey = (content: string, type: 'public' | 'private') => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pgpchan-${type}-key.asc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${type === 'public' ? 'Public' : 'Private'} key downloaded! ⊂((・▽・))⊃`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-pink-50 text-gray-900'}`}>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `url("${backgroundImage}")`,
          backgroundBlendMode: darkMode ? 'overlay' : 'soft-light'
        }}
      />
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Key className="w-8 h-8" />
            PGPchan
            <span className="text-pink-500">♡</span>
          </h1>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ni5arga/pgpchan"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-pink-200'} transition-colors`}
            >
              <Github className="w-6 h-6" />
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-pink-200 hover:bg-pink-300'} transition-colors`}
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className={`rounded-2xl p-8 mb-8 backdrop-blur-sm ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
          <div className="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-xl ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 focus:border-pink-500' 
                      : 'bg-pink-50 border-pink-200 focus:border-pink-500'
                  } border-2 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all`}
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 rounded-xl ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 focus:border-pink-500' 
                      : 'bg-pink-50 border-pink-200 focus:border-pink-500'
                  } border-2 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all`}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Key Type</label>
                <select
                  value={keyType}
                  onChange={(e) => setKeyType(e.target.value as 'ecc' | 'rsa')}
                  className={`w-full px-4 py-2 rounded-xl ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-pink-50 border-pink-200'
                  } border-2 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all`}
                >
                  <option value="ecc">ECC (Elliptic Curve)</option>
                  <option value="rsa">RSA</option>
                </select>
              </div>

              {keyType === 'rsa' ? (
                <div>
                  <label className="block text-sm font-medium mb-1">RSA Bits</label>
                  <select
                    value={rsaBits}
                    onChange={(e) => setRsaBits(Number(e.target.value))}
                    className={`w-full px-4 py-2 rounded-xl ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-pink-50 border-pink-200'
                    } border-2 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all`}
                  >
                    <option value={2048}>2048 bits</option>
                    <option value={3072}>3072 bits</option>
                    <option value={4096}>4096 bits</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">ECC Curve</label>
                  <select
                    value={eccCurve}
                    onChange={(e) => setEccCurve(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-pink-50 border-pink-200'
                    } border-2 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all`}
                  >
                    <option value="curve25519">Curve25519 (Modern, Fast)</option>
                    <option value="p256">NIST P-256</option>
                    <option value="p384">NIST P-384</option>
                    <option value="p521">NIST P-521</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={generateKeys}
            disabled={loading}
            className={`mt-6 w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 ${
              loading
                ? 'bg-pink-400 cursor-not-allowed'
                : 'bg-pink-500 hover:bg-pink-600 shadow-lg hover:shadow-xl'
            } text-white font-medium transition-all duration-300`}
          >
            <Lock className="w-5 h-5" />
            {loading ? 'Generating Keys... (◕‿◕✿)' : 'Generate Keys'}
          </button>
        </div>

        {keys && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-6 backdrop-blur-sm ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Public Key</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => copyToClipboard(keys.publicKey, 'public')}
                    className={`p-2 rounded-xl ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-pink-100'
                    } transition-colors`}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => downloadKey(keys.publicKey, 'public')}
                    className={`p-2 rounded-xl ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-pink-100'
                    } transition-colors`}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <pre className={`p-4 rounded-xl overflow-x-auto ${
                darkMode ? 'bg-gray-900' : 'bg-pink-50'
              } text-sm`}>
                {keys.publicKey}
              </pre>
            </div>

            <div className={`rounded-2xl p-6 backdrop-blur-sm ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Private Key</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => copyToClipboard(keys.privateKey, 'private')}
                    className={`p-2 rounded-xl ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-pink-100'
                    } transition-colors`}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => downloadKey(keys.privateKey, 'private')}
                    className={`p-2 rounded-xl ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-pink-100'
                    } transition-colors`}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <pre className={`p-4 rounded-xl overflow-x-auto ${
                darkMode ? 'bg-gray-900' : 'bg-pink-50'
              } text-sm`}>
                {keys.privateKey}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

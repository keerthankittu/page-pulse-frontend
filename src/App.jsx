import { useState } from 'react';
import { 
  Search, 
  AlertCircle, 
  Check, 
  Globe, 
  Clock, 
  Type, 
  AlignLeft, 
  Hash, 
  Image as ImageIcon, 
  FileText,
  Loader2,
  ArrowRight
} from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://page-pulse-backend-v4yh.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred while fetching the page.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <main className="flex-grow container mx-auto px-6 py-20 max-w-4xl">
        
        {/* Minimalist Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 mb-3">
            Page Pulse.
          </h1>
          <p className="text-neutral-500 text-lg">
            Instant technical SEO and performance auditing.
          </p>
        </div>

        {/* High-Contrast Search Form */}
        <form onSubmit={handleAudit} className="mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com"
                className="w-full pl-12 pr-4 py-4 text-base bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all placeholder:text-neutral-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-neutral-900 hover:bg-black text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Audit <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Minimalist Error State */}
        {error && (
          <div className="mb-12 p-6 border-l-4 border-neutral-900 bg-neutral-50 flex items-start gap-4 animate-in fade-in duration-300">
            <AlertCircle className="w-6 h-6 text-neutral-900 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-neutral-900">Audit Failed</h3>
              <p className="text-neutral-600 mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Grid - Stark & Clean */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-200">
              <Check className="w-5 h-5 text-neutral-900" />
              <h2 className="text-lg font-medium text-neutral-900 truncate">
                Results for {result.url}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
              <StatCard 
                label="HTTP Status" 
                value={result.status_code} 
                icon={<Globe className="w-4 h-4" />} 
              />
              <StatCard 
                label="Response Time" 
                value={`${result.response_time_ms.toLocaleString()} ms`} 
                icon={<Clock className="w-4 h-4" />} 
              />
              <StatCard 
                label="Word Count" 
                value={result.approximate_word_count.toLocaleString()} 
                icon={<FileText className="w-4 h-4" />} 
              />
              
              <StatCard 
                label="Page Title" 
                value={result.title} 
                icon={<Type className="w-4 h-4" />} 
                fullWidth 
              />
              <StatCard 
                label="Meta Description" 
                value={result.meta_description} 
                icon={<AlignLeft className="w-4 h-4" />} 
                fullWidth 
              />
              
              <StatCard 
                label="H1 Tags" 
                value={result.h1_count} 
                icon={<Hash className="w-4 h-4" />} 
              />
              <StatCard 
                label="Missing Alt Text" 
                value={result.images_missing_alt} 
                icon={<ImageIcon className="w-4 h-4" />} 
                isWarning={result.images_missing_alt > 0}
              />
              
              {/* Empty placeholder card to keep the 3-column grid perfectly aligned at the bottom */}
              <div className="hidden md:block bg-white p-6"></div>
            </div>
          </div>
        )}
      </main>

      {/* Required Footer */}
      <footer className="mt-auto py-8 border-t border-neutral-100 text-center">
        <p className="text-sm text-neutral-400">
          Built for{' '}
          <a 
            href="https://digitalheroesco.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-neutral-900 hover:underline underline-offset-4 font-medium"
          >
            Digital Heroes Training Task
          </a>
        </p>
      </footer>
    </div>
  );
}

// Reusable UI Component for the Metric Cards
function StatCard({ label, value, icon, fullWidth = false, isWarning = false }) {
  return (
    <div className={`bg-white p-6 ${fullWidth ? 'col-span-1 sm:col-span-2 md:col-span-3' : ''}`}>
      <div className="flex items-center gap-2 mb-3 text-neutral-500">
        {icon}
        <h3 className="text-xs font-medium uppercase tracking-wider">{label}</h3>
      </div>
      <p className={`text-lg font-medium break-words ${isWarning ? 'text-neutral-900 underline decoration-dashed decoration-neutral-300' : 'text-neutral-900'}`}>
        {value || 'None'}
      </p>
    </div>
  );
}

export default App;
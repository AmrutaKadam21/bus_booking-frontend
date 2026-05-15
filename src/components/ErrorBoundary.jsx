import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We encountered an unexpected error while loading the page.</p>
            <pre className="text-xs text-left bg-gray-100 p-4 rounded-lg overflow-x-auto text-red-600">{String(this.state.error)}</pre>
            <button
              onClick={() => window.location.assign("/")}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#d84e55] px-6 py-3 text-white font-semibold hover:bg-red-600 transition"
            >
              Go back to home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

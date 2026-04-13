import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-rzs-charcoal flex items-center justify-center p-8">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-xl">
            <h2 className="text-xl font-bold text-rzs-red mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4 text-sm">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <pre className="bg-gray-100 rounded p-3 text-xs overflow-auto max-h-48 text-gray-700 mb-4">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-rzs-red text-white px-4 py-2 rounded text-sm hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

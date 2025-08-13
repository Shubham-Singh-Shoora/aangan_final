import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Props {
    children: React.ReactNode;
    fallback?: React.ComponentType<ErrorInfo>;
}

interface State {
    hasError: boolean;
    error?: Error;
}

interface ErrorInfo {
    error?: Error;
    retry: () => void;
}

const DefaultErrorFallback: React.FC<ErrorInfo> = ({ error, retry }) => (
    <Card className="border-red-200 bg-red-50/50">
        <CardHeader className="flex flex-row items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-red-900">Something went wrong</h3>
                <p className="text-red-700">An unexpected error occurred</p>
            </div>
        </CardHeader>
        <CardContent className="p-6">
            <div className="space-y-4">
                {error && (
                    <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800 font-mono">
                            {error.message || 'Unknown error'}
                        </p>
                    </div>
                )}
                <Button
                    onClick={retry}
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            </div>
        </CardContent>
    </Card>
);

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    retry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback;
            return <FallbackComponent error={this.state.error} retry={this.retry} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

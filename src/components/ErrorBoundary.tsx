import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Đã xảy ra lỗi không mong muốn.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let friendly = 'Hệ thống gặp sự cố kết nối dữ liệu. Vui lòng tải lại trang.';
      if (this.state.errorMessage.includes('insufficient permissions')) {
        friendly = 'Không đủ quyền truy cập dữ liệu hoặc phiên đăng nhập đã thay đổi.';
      } else if (this.state.errorMessage.includes('Quota exceeded')) {
        friendly = 'Hệ thống lưu trữ tạm thời đạt giới hạn trong ngày. Vui lòng thử lại sau.';
      }

      return (
        <div className="passport-paper-bg flex min-h-screen items-center justify-center p-4 text-[#17262B]">
          <div className="passport-frame w-full max-w-md rounded-[16px] bg-[#FBF8F1] p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FBE9E3] text-[#C2553A]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-serif text-xl font-bold text-[#17262B]">
              Thông báo hệ thống
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4A5B60]">{friendly}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[12px] bg-[#0B3D3A] px-5 py-2.5 text-sm font-semibold text-[#FBF8F1] hover:bg-[#137A6F]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Tải lại trang</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  useEffect(() => {
    // If there's a token in the URL, verify it immediately
    if (token) {
      verifyToken(token);
    }
  }, [token]);
  
  const verifyToken = async (tokenValue: string) => {
    setVerifying(true);
    setError('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      await axios.post(`${apiUrl}/api/auth/verify-email`, { token: tokenValue });
      
      setVerified(true);
      setVerifying(false);
      
    } catch (error: any) {
      setVerifying(false);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('E-posta doğrulaması sırasında bir hata oluştu.');
      }
    }
  };
  
  const handleResendVerification = async () => {
    if (!email || loading) return;
    
    setLoading(true);
    setError('');
    setResendSuccess(false);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      await axios.post(`${apiUrl}/api/auth/resend-verification`, { email });
      
      setResendSuccess(true);
      setLoading(false);
      
    } catch (error: any) {
      setLoading(false);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Doğrulama e-postasını gönderirken bir hata oluştu.');
      }
    }
  };
  
  if (verifying) {
    return (
      <div className="py-16 bg-light min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="animate-pulse">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/20"></div>
                <div className="h-6 w-3/4 mx-auto mt-4 rounded bg-gray-300"></div>
                <div className="h-4 w-1/2 mx-auto mt-3 rounded bg-gray-200"></div>
              </div>
              <p className="mt-4 text-gray-600">
                E-posta doğrulaması gerçekleştiriliyor...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (verified) {
    return (
      <div className="py-16 bg-light min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mt-4">E-posta Doğrulandı!</h2>
              <p className="mt-2 text-gray-600">
                E-posta adresiniz başarıyla doğrulandı. Artık giriş yapabilirsiniz.
              </p>
              <div className="mt-6">
                <Link 
                  href="/login"
                  className="w-full inline-block btn-primary py-2.5"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-16 bg-light min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">E-posta Doğrulama</h1>
            <p className="text-gray-600">
              Hesabınızı aktifleştirmek için e-posta adresinizi doğrulayın.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="bg-red-50 p-4 rounded-lg mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {resendSuccess && (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-green-800">
                  Doğrulama e-postası yeniden gönderildi. Lütfen gelen kutunuzu kontrol edin.
                </p>
              </div>
            )}
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mt-4">E-postanızı kontrol edin</h2>
              
              {email ? (
                <p className="mt-2 text-gray-600">
                  <span className="font-medium text-gray-800">{email}</span> adresine bir doğrulama bağlantısı gönderdik.
                </p>
              ) : (
                <p className="mt-2 text-gray-600">
                  E-posta adresinize bir doğrulama bağlantısı gönderdik.
                </p>
              )}
              
              <p className="mt-4 text-gray-600">
                Doğrulama e-postasını almadıysanız, spam klasörünüzü kontrol edin veya aşağıdaki düğmeyi kullanarak yeniden gönderin.
              </p>
              
              <div className="mt-6">
                <button
                  onClick={handleResendVerification}
                  disabled={loading || !email}
                  className="w-full btn-secondary py-2.5 disabled:opacity-50"
                >
                  {loading ? 'Gönderiliyor...' : 'Doğrulama E-postasını Yeniden Gönder'}
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Sorun mu yaşıyorsunuz?{' '}
                  <Link href="/contact" className="text-primary hover:text-secondary font-medium">
                    Bizimle iletişime geçin
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/login" className="text-primary hover:text-secondary font-medium">
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="py-16 bg-light min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 max-w-md mx-auto rounded"></div>
            <div className="h-4 bg-gray-200 max-w-sm mx-auto mt-2 rounded"></div>
            <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-200"></div>
              <div className="h-6 w-1/2 mx-auto mt-4 rounded bg-gray-200"></div>
              <div className="h-4 w-3/4 mx-auto mt-3 rounded bg-gray-200"></div>
              <div className="h-4 w-2/3 mx-auto mt-2 rounded bg-gray-200"></div>
              <div className="h-10 bg-gray-200 rounded mx-auto mt-6 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 
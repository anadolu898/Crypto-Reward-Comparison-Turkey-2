'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [autoActivated, setAutoActivated] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter uzunluğunda olmalıdır');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/auth/register`, formData);
      
      setSuccess(true);
      setLoading(false);
      
      // Check if auto-activated
      if (response.data.auto_activated) {
        setAutoActivated(true);
        // Redirect to login page if auto-activated
        setTimeout(() => {
          router.push('/login');
        }, 3000); // Give user more time to read the message
      } else {
        // Redirect to verification page if not auto-activated
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        }, 3000);
      }
      
    } catch (error: any) {
      setLoading(false);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Kayıt sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };

  return (
    <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Hesap Oluştur</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Crypto staking ve kampanya tekliflerini karşılaştırmak için hesap oluşturun.
            </p>
          </div>
          
          {success ? (
            <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg mb-6 text-center">
              <h3 className="text-green-800 dark:text-green-200 text-xl font-semibold mb-3">
                Hesabınız Başarıyla Oluşturuldu!
              </h3>
              {autoActivated ? (
                <div>
                  <p className="text-green-700 dark:text-green-300 mb-2">
                    Hesabınız aktif edildi ve kullanıma hazır.
                  </p>
                  <p className="text-green-700 dark:text-green-300 mb-2">
                    Kayıt sırasında belirttiğiniz e-posta adresine bir hoş geldin e-postası gönderildi.
                  </p>
                  <p className="text-green-700 dark:text-green-300 font-medium mt-4">
                    Giriş sayfasına yönlendiriliyorsunuz...
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-green-700 dark:text-green-300">
                    Lütfen e-posta adresinize gönderilen doğrulama bağlantısına tıklayarak hesabınızı aktifleştirin.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-6">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İsim (İsteğe bağlı)
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Şifre
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir.
                  </p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Şifreyi Onayla
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full btn-primary py-2.5"
                  disabled={loading}
                >
                  {loading ? 'İşleniyor...' : 'Kaydol'}
                </button>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Zaten hesabınız var mı?{' '}
                    <Link href="/login" className="text-primary hover:text-secondary font-medium">
                      Giriş Yap
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          )}
          
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Kaydolarak, <Link href="/terms" className="text-primary hover:text-secondary">Kullanım Koşullarını</Link> ve{' '}
              <Link href="/privacy" className="text-primary hover:text-secondary">Gizlilik Politikasını</Link> kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
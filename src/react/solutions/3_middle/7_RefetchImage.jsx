import { useEffect, useRef, useState } from 'react';

export const RefetchImage = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [status, setStatus] = useState('');
  const objectUrlRef = useRef(null);

  // Чистим blob-URL при размонтировании, чтобы не текла память
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleRefetch = async () => {
    try {
      setStatus('loading');
      const res = await fetch(src, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Не удалось загрузить изображение: ${res.status}`);
      }
      const blob = await res.blob();
      const nextUrl = URL.createObjectURL(blob);

      // Освобождаем предыдущий blob-URL перед заменой
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = nextUrl;

      setImageSrc(nextUrl);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      console.log(err.message);
    }
  };

  return (
    <div>
      {status === 'loading' && <p>Загрузка...</p>}
      {status === 'error' && <p>Ошибка</p>}
      {status !== 'loading' && status !== 'error' && (
        <img src={imageSrc} alt={alt} style={{ maxWidth: '300px', display: 'block', marginBottom: '12px' }} />
      )}
      <button onClick={handleRefetch} disabled={status === 'loading'}>
        Обновить
      </button>
    </div>
  );
};

export default function App() {
  return <RefetchImage src="https://picsum.photos/300/200" alt="Пример изображения" />;
}

import { useEffect, useRef, useState } from 'react';

export const RefetchImage = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [status, setStatus] = useState('idle');
  // Технические ресурсы, не влияющие на разметку: текущий blob-URL и контроллер запроса
  const objectUrlRef = useRef(null);
  const controllerRef = useRef(null);

  // При размонтировании: отменяем незавершённый запрос и освобождаем blob-URL
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleRefetch = async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus('loading');

    try {
      const response = await fetch(src, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();

      // Компонент мог размонтироваться, пока читали тело ответа: blob-URL тогда не создаём
      if (controller.signal.aborted) return;

      const nextUrl = URL.createObjectURL(blob);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = nextUrl;

      setImageSrc(nextUrl);
      setStatus('success');
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error('Не удалось обновить изображение:', err);
      setStatus('error');
    }
  };

  return (
    <div>
      {status === 'loading' && <p>Загрузка...</p>}
      {status === 'error' && <p role="alert">Ошибка</p>}
      {(status === 'idle' || status === 'success') && (
        <img src={imageSrc} alt={alt} style={{ maxWidth: 300, display: 'block', marginBottom: 12 }} />
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

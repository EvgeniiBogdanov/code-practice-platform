import { useEffect, useRef, useState } from 'react';

export interface TGalleryImage {
  src: string;
  alt?: string;
}

export type TRefetchImageProps = TGalleryImage;
export type TStatus = 'idle' | 'loading' | 'success' | 'error';

export const RefetchImage = ({ src, alt = '' }: TRefetchImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [status, setStatus] = useState<TStatus>('idle');
  // Технические ресурсы: текущий blob-URL и контроллер незавершённого запроса
  const objectUrlRef = useRef<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleRefetch = async (): Promise<void> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus('loading');

    try {
      const response = await fetch(src, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob: Blob = await response.blob();

      // Компонент мог размонтироваться, пока читали тело ответа
      if (controller.signal.aborted) return;

      const nextUrl = URL.createObjectURL(blob);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = nextUrl;

      setImageSrc(nextUrl);
      setStatus('success');
    } catch (error: unknown) {
      if (controller.signal.aborted) return;
      console.error('Не удалось обновить изображение:', error instanceof Error ? error.message : error);
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

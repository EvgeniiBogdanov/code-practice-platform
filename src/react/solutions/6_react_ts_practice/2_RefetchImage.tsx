import { useEffect, useRef, useState } from 'react';

export interface TGalleryImage {
  src: string;
  alt?: string;
}

export type TRefetchImageProps = TGalleryImage;

export type TStatus = 'idle' | 'loading' | 'success' | 'error';

export const RefetchImage = ({ src, alt }: TRefetchImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [status, setStatus] = useState<TStatus>('idle');
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleRefetch = async (): Promise<void> => {
    try {
      setStatus('loading');
      const res = await fetch(src, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Не удалось загрузить изображение: ${res.status}`);
      }
      const blob = await res.blob();
      const nextUrl = URL.createObjectURL(blob);

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = nextUrl;

      setImageSrc(nextUrl);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      console.log(err instanceof Error ? err.message : 'Неизвестная ошибка');
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

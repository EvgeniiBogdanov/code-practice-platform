import React, { lazy, Suspense, use, useState } from 'react';

const Chart = () => <div>📈 Здесь мог быть ваш тяжёлый график</div>;

const loadChartModule = () =>
  new Promise((resolve) => setTimeout(() => resolve({ default: Chart }), 1000));

// 1. lazy вызывается на уровне модуля, а не внутри компонента.
//    В реальном проекте: lazy(() => import('./Chart'))
const LazyChart = lazy(loadChartModule);

const fetchProfile = () =>
  fetch('https://jsonplaceholder.typicode.com/users/1').then((res) => res.json());

// 2. Промис создаётся один раз — вне рендера. Новый промис на каждый рендер
//    заставил бы use() приостанавливать компонент бесконечно
const profilePromise = fetchProfile();

const Profile = ({ profilePromise }) => {
  // 3. use() «разворачивает» промис: пока он не выполнен, ближайший Suspense показывает fallback
  const profile = use(profilePromise);
  return <p>{profile.name}</p>;
};

const App = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <Suspense fallback={<p>Загрузка профиля...</p>}>
        <Profile profilePromise={profilePromise} />
      </Suspense>

      <button onClick={() => setShowChart(true)}>Показать график</button>
      {showChart && (
        <Suspense fallback={<p>Загрузка графика...</p>}>
          <LazyChart />
        </Suspense>
      )}
    </div>
  );
};

export default App;

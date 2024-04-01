import { useState } from 'react';
import Card from './Card.jsx';
import CardDetail from './CardDetail.jsx';

const CardsByCategory = ({ category, articles }) => {
  const [activeIndex, setActiveIndex] = useState(null); // 현재 활성화된 카드의 인덱스

  // 토글 및 모달 열고 닫기
  const toggleActiveIndex = (i) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <div className="mb-8">
      <h2
        className="flex items-start w-full pb-2 text-2xl font-bold text-center border-b-2"
        style={{ textTransform: 'uppercase' }}
      >
        {category}
      </h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar">
        {articles.map((article) => (
          <div key={article.id} className="inline-block">
            <button
              onClick={() => toggleActiveIndex(article.id)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  toggleActiveIndex(article.id);
                }
              }}
              className=""
            >
              <Card article={article} />
            </button>
            {article.id === activeIndex && <CardDetail article={article} setActiveIndex={setActiveIndex} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsByCategory;
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { getTimeRecords, getSolved, getScrapArticles } from '@/apis/myApi.jsx';
import PageMovingButton from '@/components/commons/buttons/PageMovingButtons.jsx';
import BodyContainer from '@/components/commons/containers/BodyContainer.jsx';
import ResultTitle from '@/components/commons/containers/ResultTitle.jsx';
import TranslucentContainer from '@/components/commons/containers/TranslucentContainer.jsx';
import WhiteContainer from '@/components/commons/containers/WhiteContainer.jsx';
import WhiteContainerHoverEffect from '@/components/commons/containers/WhiteContainerHoverEffect.jsx';
import { formatTime } from '@/components/game/Timer.jsx';
import Badges from '@/components/my/badge/Badges.jsx';
import Cards from '@/components/my/card/Cards.jsx';
import RadarChart from '@/components/my/RadarChart.jsx';
import {
  useGameResultStore,
  useGameModalStore,
  useGameItemStore,
  useVisibilityStore,
  checkCollidedStore,
  checkGameSuccessStore,
  checkGameYearStore,
  useResultDataStore,
  useChallengedArticleStore,
} from '@/stores/game/gameStore.jsx';
import {
  useQuizStore,
  useHitsCategoryStore,
  useAnswerCheckStore,
  useClueIndexStore,
  useClueStateStore,
} from '@/stores/game/quizStore.jsx';

const MyPage = () => {
  const [timeresult, setTimeresult] = useState([]);
  const [solvedCount, setSolvedCount] = useState({
    social: 0,
    politics: 0,
    economy: 0,
    international: 0,
    culture: 0,
    sports: 0,
  });
  const [scrapedArticle, setScrapedArticle] = useState([]);
  // const [articleDetail, setArticleDetail] = useState([]);

  const { gameResult } = useGameResultStore();

  const navigate = useNavigate();

  const resetGame = () => {
    useGameModalStore.getState().reset();
    useGameResultStore.getState().reset();
    useGameItemStore.getState().reset();
    useVisibilityStore.getState().reset();
    checkCollidedStore.getState().reset();
    checkGameSuccessStore.getState().reset();
    checkGameYearStore.getState().reset();
    useResultDataStore.getState().reset();
    useQuizStore.getState().reset();
    useHitsCategoryStore.getState().reset();
    useAnswerCheckStore.getState().reset();
    useClueIndexStore.getState().reset();
    useClueStateStore.getState().reset();
    useChallengedArticleStore.getState().reset();
  };

  const navigateToLandingPage = () => {
    resetGame();
    navigate('/');
  };

  useEffect(() => {
    getTimeRecords()
      .then((data) => {
        setTimeresult(data);
      })
      .catch((error) => {
        console.error('Error requesting badge:', error);
      });

    getSolved()
      .then((data) => {
        setSolvedCount(data);
      })
      .catch((error) => {
        console.error('Error requesting badge:', error);
      });

    // 스크랩한 기사 리스트 보기
    getScrapArticles()
      .then((data) => {
        setScrapedArticle(data);
      })
      .catch((error) => {
        console.error('Error requesting badge:', error);
      });
  }, []);

  return (
    <>
      <div className="fixed z-10 flex flex-col right-5 top-5">
        <PageMovingButton onClick={navigateToLandingPage} buttonText="다시 시계토끼 쫓아가기" buttonColor="#FBFAEA" />
      </div>
      <BodyContainer>
        <div className="mb-2 text-xl font-bold text-white">MY PAGE</div>
        <div className="relative flex flex-col items-center w-full gap-4">
          {/* 나의 기록 myRecordbox */}
          <TranslucentContainer>
            <ResultTitle title={'나의 기록'} />
            <div className="flex flex-col justify-between w-full gap-4 lg:flex-row lg:justify-center">
              {/* 타임어택 기록 */}
              <div className="w-full h-[363px]">
                <WhiteContainerHoverEffect>
                  <ResultTitle title={'타임어택 기록'} />
                  <div className="px-6 py-6 text-lg font-medium text-center ">
                    <div className="w-full px-4 py-2 mb-3 font-bold border border-gray-200 rounded-full bg-gradient-to-r from-primary-yellow to-primary-teal-1">
                      <span className="text-teal-600">NEW!</span> {formatTime(600 - gameResult.timeAttackTime)}
                    </div>
                    {timeresult &&
                      timeresult
                        .slice(0, 5)
                        .reverse()
                        .map((record, i) => (
                          <div key={record.playDate} className="flex items-center w-full px-4 mb-3 space-x-4">
                            <div className="w-1/6 font-bold text-gray-500">{i + 1}</div>
                            <div className="w-2/6 font-bold">{formatTime(600 - record.timeAttackTime)}</div>
                            <div className="w-3/6 text-xs text-gray-500">
                              {format(new Date(record.playDate), 'yyyy-MM-dd HH:mm')}
                            </div>
                          </div>
                        ))}
                  </div>
                </WhiteContainerHoverEffect>
              </div>
              {/* 카테고리별 맞은 개수 */}
              <div className="w-full h-[363px]">
                <WhiteContainerHoverEffect>
                  <RadarChart solvedCount={solvedCount} />
                </WhiteContainerHoverEffect>
              </div>
            </div>
            {/* 획득한 뱃지 */}
            <div className="w-full">
              <WhiteContainerHoverEffect>
                <ResultTitle title={'획득한 뱃지'} />
                <div className="overflow-y-auto h-[150px]">
                  <Badges />
                </div>
              </WhiteContainerHoverEffect>
            </div>
          </TranslucentContainer>
          {/* 스크랩한 기사 scapedArticlebox */}
          <TranslucentContainer>
            <ResultTitle title={'스크랩한 기사'} />
            <WhiteContainer>
              <Cards scrapedArticles={scrapedArticle} />
            </WhiteContainer>
          </TranslucentContainer>
        </div>
      </BodyContainer>
    </>
  );
};

export default MyPage;
